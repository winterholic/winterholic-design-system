// 프레임워크 없는 DOM 렌더러(예제·진단 화면용). React 렌더러는 ../react 에 있고 같은 scene 데이터를 쓴다.
const pct = (x) => `${(x * 100).toFixed(3)}%`;
const BLEND = { screen: 'screen', multiply: 'multiply' };

export function renderSceneDOM(container, scene, opts = {}) {
  container.classList.add('mv-scene');
  container.dataset.world = scene.theme;
  container.replaceChildren();
  const frag = document.createDocumentFragment();
  for (const l of scene.layers) {
    let el;
    if (l.type === 'image') {
      el = document.createElement('img');
      el.src = l.src; el.alt = ''; el.decoding = 'async'; el.draggable = false;
      Object.assign(el.style, { left: pct(l.x), top: pct(l.y), width: pct(l.w), height: pct(l.h) });
      if (l.blend) el.style.mixBlendMode = BLEND[l.blend] ?? 'normal';
      if (l.opacity != null) el.style.opacity = l.opacity;
    } else if (l.type === 'shadow') {
      el = document.createElement('div');
      Object.assign(el.style, { left: pct(l.cx - l.rx), top: pct(l.cy - l.ry), width: pct(l.rx * 2), height: pct(l.ry * 2) });
    } else if (l.type === 'lights') {
      el = document.createElement('div');
      for (const p of l.points) {
        const d = document.createElement('i');
        Object.assign(d.style, { left: pct(p.x), top: pct(p.y), width: pct(p.r * 2), '--mv-phase': p.phase });
        d.dataset.tone = p.tone;
        el.append(d);
      }
      el.style.setProperty('--mv-light', l.color);
    } else if (l.type === 'ornament') {
      el = document.createElement(opts.interactive ? 'button' : 'div');
      if (opts.interactive) { el.type = 'button'; el.setAttribute('aria-label', opts.labelFor?.(l) ?? l.ornamentId); }
      el.dataset.ornamentId = l.id;
      if (l.hero) el.dataset.hero = '';
      el.dataset.zone = l.zone;
      Object.assign(el.style, { left: pct(l.ax), top: pct(l.ay), width: pct(l.w), transform: `translate(${-l.anchor.x * 100}%, ${-l.anchor.y * 100}%) rotate(${l.rotate}deg)`, transformOrigin: `${l.anchor.x * 100}% ${l.anchor.y * 100}%`, zIndex: l.z });
      const img = document.createElement('img');
      img.src = l.src; img.alt = ''; img.draggable = false;
      el.append(img);
    } else if (l.type === 'particles') {
      el = document.createElement('div'); el.dataset.kind = l.kind; el.style.opacity = l.opacity;
    } else if (l.type === 'grade') {
      el = document.createElement('div'); el.style.background = l.color; el.style.mixBlendMode = BLEND[l.blend] ?? 'normal';
    }
    if (!el) continue;
    el.classList.add('mv-scene__layer');
    el.dataset.layer = l.layer; el.dataset.type = l.type;
    if (l.type !== 'ornament') el.setAttribute('aria-hidden', 'true');
    frag.append(el);
  }
  container.append(frag);
  return container;
}
