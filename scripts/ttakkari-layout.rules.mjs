export function findSilentClip({ sig, text, scrollWidth, clientWidth, style, role = null, dataActive = null }) {
  if (!text || scrollWidth <= clientWidth + 1 || clientWidth <= 0) return null;
  const ellipsis = style.textOverflow === 'ellipsis' || style.webkitLineClamp && style.webkitLineClamp !== 'none' && String(style.display ?? '').includes('box');
  if (ellipsis) return null;

  const pixels = (value) => Number.parseFloat(value) || 0;
  const tinyBox = pixels(style.width) <= 1.5 && pixels(style.height) <= 1.5;
  const noPadding = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].every((side) => pixels(style[side]) === 0);
  const clipsOverflow = ['hidden', 'clip'].includes(style.overflowX) || ['hidden', 'clip'].includes(style.overflowY);
  const hasClipGeometry = Boolean(style.clip && style.clip !== 'auto' || style.clipPath && style.clipPath !== 'none');
  const intentionallyVisuallyHidden = ['absolute', 'fixed'].includes(style.position) && tinyBox && noPadding && clipsOverflow && hasClipGeometry;
  const tabPanel = role === 'tabpanel';
  const inactiveTabPanel = tabPanel && dataActive === 'false';
  if (intentionallyVisuallyHidden && (!tabPanel || inactiveTabPanel)) return null;

  return { rule: 'silent-clip', sig, detail: `내용 ${scrollWidth} > 상자 ${clientWidth}, 말줄임 없음` };
}

export async function inspectDynamicTargets(targets, inspect, isConnected = (target) => target.isConnected) {
  const findings = [];
  const errors = [];
  for (const target of targets) {
    if (!await isConnected(target)) {
      errors.push({ rule: 'checker-error', status: 'unmeasured', detail: 'dialog target was removed before measurement' });
      continue;
    }
    let result;
    try {
      result = await inspect(target);
    } catch (error) {
      errors.push({ rule: 'checker-error', status: 'unmeasured', detail: String(error?.message ?? error) });
      continue;
    }
    if (!await isConnected(target)) {
      errors.push({ rule: 'checker-error', status: 'unmeasured', detail: 'dialog target was removed during measurement' });
      continue;
    }
    findings.push(...result);
  }
  return { findings, errors };
}

export function validateTargets(targets) {
  return targets.length && targets.every((target) => target.name && target.url)
    ? null
    : { rule: 'target-error', status: 'unmeasured', detail: 'zero or incomplete route targets' };
}

export function navigationError(name, url, status) {
  if (status >= 200 && status < 300) return null;
  return { rule: 'target-error', status: 'unmeasured', sig: name, detail: `HTTP ${status ?? 'no response'} · ${url}` };
}

export function pageErrorFinding(name, error) {
  return { rule: 'page-error', status: 'render-error', sig: name, detail: String(error?.message ?? error) };
}
