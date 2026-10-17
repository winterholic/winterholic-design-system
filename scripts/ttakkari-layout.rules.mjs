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

const fmt = (n) => Number(Number(n).toFixed(1)).toString();
const rectText = (r) => `@ ${fmt(r.x)},${fmt(r.y)}`;

export function touchTargetFinding({ kind = 'target', sig, visual, hit, fontSize }) {
  if (kind === 'input-font') {
    if (!Number.isFinite(fontSize)) return { rule: 'checker-error', status: 'unmeasured', sig, detail: 'input font-size could not be measured' };
    return fontSize < 16
      ? { rule: 'input-font-under-16', sig, detail: `font-size ${fmt(fontSize)}px (기준 16px)` }
      : null;
  }
  if (!hit || !visual || ![hit.x, hit.y, hit.width, hit.height, visual.width, visual.height].every(Number.isFinite)) {
    return { rule: 'checker-error', status: 'unmeasured', sig, detail: 'touch target geometry could not be measured' };
  }
  if (hit.width >= 44 && hit.height >= 44) return null;
  return {
    rule: 'touch-target-under-44', sig,
    detail: `히트 영역 ${fmt(hit.width)}×${fmt(hit.height)} ${rectText(hit)}; 시각 요소 ${fmt(visual.width)}×${fmt(visual.height)} ${rectText(visual)} (기준 44×44)`,
  };
}

export function fileButtonMismatch(button, input, sig = 'FileButton') {
  const delta = Math.max(
    Math.abs(button.x - input.x), Math.abs(button.y - input.y),
    Math.abs(button.width - input.width), Math.abs(button.height - input.height),
  );
  if (delta <= 0.5) return null;
  return {
    rule: 'file-input-hitbox-mismatch', sig,
    detail: `버튼 ${fmt(button.x)},${fmt(button.y)} ${fmt(button.width)}×${fmt(button.height)} · 투명 input ${fmt(input.x)},${fmt(input.y)} ${fmt(input.width)}×${fmt(input.height)} · 위치/크기 차이`,
  };
}

export function tableViewportFinding({ sig, table, viewport, scroller, overflowX, scrollWidth, clientWidth }) {
  const scrollerInsideViewport = scroller && scroller.left >= viewport.left - 1 && scroller.right <= viewport.right + 1;
  const intentionalScroll = scrollerInsideViewport
    && ['auto', 'scroll'].includes(overflowX)
    && scrollWidth > clientWidth + 1;
  const insideViewport = table.left >= viewport.left - 1 && table.right <= viewport.right + 1 && (!scroller || scrollerInsideViewport);
  if (insideViewport || intentionalScroll) return null;
  return {
    rule: 'table-outside-viewport', sig,
    detail: `표 x ${fmt(table.left)}..${fmt(table.right)} · 화면 x ${fmt(viewport.left)}..${fmt(viewport.right)}`
      + (scroller ? ` · 스크롤 상자 x ${fmt(scroller.left)}..${fmt(scroller.right)} overflow-x ${overflowX} ${scrollWidth}/${clientWidth}` : ' · 가로 스크롤 상자 없음'),
  };
}

export function dialogMeasurementError(samples) {
  if (!samples?.length || samples.some((sample) => !sample.open)) return 'dialog closed during measurement';
  const first = samples[0].rect;
  const keys = ['x', 'y', 'width', 'height'];
  const raw = samples.map(({ rect }) => `[${keys.map((key) => `${key}=${fmt(rect[key])}`).join(',')}]`).join(' → ');
  if (samples.some(({ rect }) => !keys.every((key) => Number.isFinite(rect?.[key])))) return `dialog geometry could not be measured: ${raw}`;
  const stable = samples.every(({ rect }) => keys.every((key) => Math.abs(rect[key] - first[key]) <= 0.5));
  return stable ? null : `dialog geometry unstable across animation frames: ${raw}`;
}

export function dialogClosedError(open) {
  return open ? 'dialog remained open after checker measurement' : null;
}
