// Merrivoo React 바인딩. 빌드 단계 없이 쓰도록 JSX 없이 createElement 로 작성했다.
// 스타일은 dist/components.css(클래스 mv-*)가 맡고, 이 파일은 구조·상태·접근성만 맡는다.
import { createElement as h, Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { fitScene } from '../engine/fit.mjs';

const cx = (...a) => a.filter(Boolean).join(' ');
const pct = (x) => `${(x * 100).toFixed(3)}%`;

/* ───────── hooks ───────── */
export function useReducedMotion() {
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return undefined;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setR(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return r;
}
/** 동적 주소창·키보드를 반영하는 뷰포트. visualViewport 가 없으면 window 크기 */
export function useViewport() {
  const read = () => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    return { w: Math.round(vv?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 390)), h: Math.round(vv?.height ?? (typeof window !== 'undefined' ? window.innerHeight : 844)) };
  };
  const [v, setV] = useState(read);
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setV((p) => { const n = read(); return n.w === p.w && n.h === p.h ? p : n; })); };
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', on); window.visualViewport?.removeEventListener('resize', on); };
  }, []);
  return v;
}

/* ───────── 기본 컴포넌트 ───────── */
export function Button({ variant = 'primary', size = 'md', block, loading, icon, className, children, disabled, type = 'button', ...rest }) {
  return h('button', {
    type, disabled: disabled && !loading, 'aria-busy': loading ? 'true' : undefined, 'aria-disabled': disabled || loading ? 'true' : undefined,
    className: cx('mv-btn', variant !== 'primary' && `mv-btn--${variant}`, size !== 'md' && `mv-btn--${size}`, block && 'mv-btn--block', className), ...rest,
    onClick: loading || disabled ? undefined : rest.onClick,
  }, icon ? h('span', { className: 'mv-btn__icon', 'aria-hidden': 'true' }, icon) : null, children);
}

export function ChoiceList({ legend, children, className }) {
  return h('fieldset', { className: cx('mv-choice-list', className) }, legend ? h('legend', { className: 'mv-vh' }, legend) : null, children);
}
export function ChoiceCard({ name, value, title, sub, icon, checked, onChange, disabled, type = 'radio' }) {
  return h('label', { className: 'mv-choice', 'data-selected': checked ? '' : undefined, 'aria-disabled': disabled ? 'true' : undefined },
    h('input', { className: 'mv-choice__input', type, name, value, checked: !!checked, disabled, onChange: () => onChange?.(value) }),
    icon ? h('span', { className: 'mv-choice__icon', 'aria-hidden': 'true' }, icon) : null,
    h('span', { className: 'mv-choice__body' }, h('span', { className: 'mv-choice__title' }, title), sub ? h('span', { className: 'mv-choice__sub' }, sub) : null),
    h('span', { className: 'mv-choice__check', 'aria-hidden': 'true' }, '✓'));
}

export function QuestionPanel({ index, total, text, hint, children, id }) {
  return h('section', { className: 'mv-question', 'aria-labelledby': id },
    index != null ? h('span', { className: 'mv-question__index' }, total ? `Q ${index} / ${total}` : `Q ${index}`) : null,
    h('h2', { className: 'mv-question__text', id }, text), hint ? h('p', { className: 'mv-question__hint' }, hint) : null, children);
}
export function Progress({ total, current, variant = 'dots', label }) {
  if (variant === 'bar') {
    const v = Math.round((current / total) * 100);
    return h('div', { className: 'mv-progress mv-progress--bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': current, 'aria-label': label ?? '진행 상태' }, h('span', { className: 'mv-progress__fill', style: { '--mv-progress': v } }));
  }
  return h('div', { className: 'mv-progress', role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': total, 'aria-valuenow': current, 'aria-label': label ?? '진행 상태' },
    Array.from({ length: total }, (_, i) => h('span', { key: i, className: 'mv-progress__dot', 'data-state': i + 1 < current ? 'done' : i + 1 === current ? 'current' : 'todo' })));
}

export function NicknameField({ value, onChange, max = 12, error, disabled, label = '닉네임', placeholder = '친구들이 알아볼 이름', help }) {
  const id = useId();
  return h('div', { className: cx('mv-field', error && 'mv-field--error') },
    h('label', { className: 'mv-field__label', htmlFor: id }, label),
    h('input', { id, className: 'mv-field__input', type: 'text', value, disabled, maxLength: max, placeholder, autoComplete: 'nickname', enterKeyHint: 'done', 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': `${id}-help`, onChange: (e) => onChange?.(e.target.value) }),
    h('span', { className: 'mv-field__help', id: `${id}-help` }, error ?? help ?? ''),
    h('span', { className: 'mv-field__counter', 'aria-hidden': 'true' }, `${[...value].length}/${max}`));
}
export function AnonymousToggle({ checked, onChange, title = '익명으로 남기기', sub = '주인에게는 닉네임 없이 보여요' }) {
  return h('label', { className: 'mv-toggle' },
    h('span', { className: 'mv-toggle__text' }, h('span', { className: 'mv-toggle__title' }, title), h('span', { className: 'mv-toggle__sub' }, sub)),
    h('input', { className: 'mv-toggle__input', type: 'checkbox', role: 'switch', checked: !!checked, onChange: (e) => onChange?.(e.target.checked) }),
    h('span', { className: 'mv-toggle__track', 'aria-hidden': 'true' }));
}

export function OrnamentPicker({ items, value, onChange, name = 'ornament', legend = '장식 고르기', className }) {
  return h('fieldset', { className: 'mv-choice-list' }, h('legend', { className: 'mv-vh' }, legend),
    h('div', { className: cx('mv-orn-picker', className), role: 'presentation' }, items.map((it) =>
      h('label', { key: it.id, className: 'mv-orn-item', 'data-selected': value === it.id ? '' : undefined },
        h('input', { className: 'mv-orn-item__input', type: 'radio', name, value: it.id, checked: value === it.id, disabled: it.disabled, onChange: () => onChange?.(it.id) }),
        h('img', { className: 'mv-orn-item__img', src: it.src, alt: '', draggable: false, loading: 'lazy', decoding: 'async' }),
        h('span', { className: 'mv-orn-item__label' }, it.label)))));
}

export function ScoreMeter({ score, label = '궁합 점수', duration = 1100 }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? score : 0);
  useEffect(() => {
    if (reduced) { setV(score); return undefined; }
    let raf = 0, t0 = 0;
    const tick = (t) => { t0 ||= t; const p = Math.min(1, (t - t0) / duration); setV(Math.round(score * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, reduced, duration]);
  return h('div', { className: 'mv-score', role: 'img', 'aria-label': `${label} ${score}점` },
    h('div', { className: 'mv-score__ring', style: { '--mv-score': v } }, h('span', { className: 'mv-score__value' }, v)),
    h('span', { className: 'mv-score__label' }, label));
}
export function UniverseCard({ eyebrow, title, body, chips = [] }) {
  return h('article', { className: 'mv-universe-card' },
    eyebrow ? h('span', { className: 'mv-universe-card__eyebrow' }, eyebrow) : null, h('h2', { className: 'mv-universe-card__title' }, title),
    body ? h('p', { className: 'mv-universe-card__body' }, body) : null,
    chips.length ? h('div', { className: 'mv-universe-card__meta' }, chips.map((c) => h('span', { key: c, className: 'mv-chip' }, c))) : null);
}
export function ShareCard({ children, title, meta, brand = 'Merrivoo', className }) {
  return h('div', { className: cx('mv-share-card', className) }, h('div', { className: 'mv-share-card__scene' }, children),
    h('div', { className: 'mv-share-card__top' }, title ? h('h2', { className: 'mv-share-card__title' }, title) : null, meta ? h('span', { className: 'mv-share-card__meta' }, meta) : null),
    h('div', { className: 'mv-share-card__bottom' }, h('span', { className: 'mv-share-card__brand' }, brand)));
}

export function Toast({ message, tone, duration = 3200, onDone }) {
  useEffect(() => { const t = setTimeout(() => onDone?.(), duration); return () => clearTimeout(t); }, [message, duration, onDone]);
  return h('div', { className: 'mv-toast', role: tone === 'danger' ? 'alert' : 'status', 'aria-live': tone === 'danger' ? 'assertive' : 'polite', 'data-tone': tone }, message);
}
export function StateView({ kind = 'empty', title, body, action, icon }) {
  const defaults = { loading: ['', '불러오는 중이에요'], error: ['⚠', '앗, 문제가 생겼어요'], empty: ['✦', '아직 아무것도 없어요'] }[kind];
  return h('div', { className: 'mv-state', role: kind === 'error' ? 'alert' : 'status' },
    kind === 'loading' ? h('div', { className: 'mv-spinner', 'aria-hidden': 'true' }) : h('div', { className: 'mv-state__icon', 'aria-hidden': 'true' }, icon ?? defaults[0]),
    h('h3', { className: 'mv-state__title' }, title ?? defaults[1]), body ? h('p', { className: 'mv-state__body' }, body) : null, action ?? null);
}

/* ───────── 시트·모달 ───────── */
function useDialog(open, onClose, ref) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const el = ref.current;
    const focusables = () => [...el.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((n) => !n.disabled);
    (focusables()[0] ?? el).focus?.({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); }
      if (e.key === 'Tab') { const f = focusables(); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.({ preventScroll: true }); };
  }, [open, onClose, ref]);
}
export function BottomSheet({ open, onClose, title, children, footer, id }) {
  const ref = useRef(null);
  const tid = useId();
  useDialog(open, onClose, ref);
  return h(Fragment, null,
    h('div', { className: 'mv-backdrop', 'data-open': open ? '' : undefined, onClick: onClose, 'aria-hidden': 'true' }),
    h('div', { ref, id, className: 'mv-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': title ? tid : undefined, 'aria-hidden': open ? undefined : 'true', 'data-open': open ? '' : undefined, tabIndex: -1, inert: open ? undefined : true },
      h('div', { className: 'mv-sheet__handle', 'aria-hidden': 'true' }), title ? h('h2', { className: 'mv-sheet__title', id: tid }, title) : null,
      h('div', { className: 'mv-sheet__body' }, children), footer ? h('div', { className: 'mv-sheet__footer' }, footer) : null));
}
export function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null);
  const tid = useId();
  useDialog(open, onClose, ref);
  return h(Fragment, null,
    h('div', { className: 'mv-backdrop', 'data-open': open ? '' : undefined, onClick: onClose, 'aria-hidden': 'true' }),
    h('div', { ref, className: 'mv-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': tid, 'data-open': open ? '' : undefined, tabIndex: -1, inert: open ? undefined : true },
      h('h2', { className: 'mv-sheet__title', id: tid }, title), h('div', null, children), footer ? h('div', { className: 'mv-sheet__footer' }, footer) : null));
}

/* ───────── 장면 ───────── */
export function ParticleCanvas({ kind = 'snow', count = 40, opacity = 1 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const cv = ref.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    let w = 0, h2 = 0, raf = 0, last = 0, flakes = [];
    const size = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width * dpr)); h2 = Math.max(1, Math.round(r.height * dpr)); cv.width = w; cv.height = h2;
      flakes = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h2, r: (kind === 'sparkle' ? 1 : 1.2) * dpr + Math.random() * 2.2 * dpr, s: (kind === 'sparkle' ? 4 : 14 + Math.random() * 26) * dpr, p: Math.random() * 6.28, a: 0.35 + Math.random() * 0.6 }));
      draw(0);
    };
    const draw = (dt) => {
      ctx.clearRect(0, 0, w, h2);
      ctx.fillStyle = kind === 'sparkle' ? 'rgb(255,236,190)' : 'rgb(255,255,255)';
      for (const f of flakes) {
        if (!reduced) { f.p += dt * 0.8; f.y += f.s * dt; f.x += Math.sin(f.p) * 8 * dt * (w / 600); if (f.y > h2 + 6) { f.y = -6; f.x = Math.random() * w; } }
        ctx.globalAlpha = kind === 'sparkle' ? f.a * (0.5 + 0.5 * Math.sin(f.p * 2)) : f.a;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill();
      }
    };
    const loop = (t) => { const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t; draw(dt); raf = requestAnimationFrame(loop); };
    size();
    const ro = new ResizeObserver(size); ro.observe(cv);
    const vis = () => { cancelAnimationFrame(raf); last = 0; if (!document.hidden && !reduced) raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', vis); vis();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [kind, count, reduced]);
  return h('canvas', { ref, className: 'mv-scene__layer', 'data-layer': 'fx-top', 'data-type': 'particles', 'aria-hidden': 'true', style: { inset: 0, width: '100%', height: '100%', opacity } });
}

export function SceneView({ scene, interactive, onOrnamentClick, selectedId, selecting, enter, labelFor, particles = true, className, style }) {
  const reduced = useReducedMotion();
  let orn = 0;
  const layers = scene.layers.map((l) => {
    const common = { key: l.key, 'data-layer': l.layer, 'data-type': l.type, className: 'mv-scene__layer', 'aria-hidden': l.type === 'ornament' ? undefined : 'true' };
    switch (l.type) {
      case 'image': return h('img', { ...common, src: l.src, alt: '', draggable: false, decoding: 'async', style: { left: pct(l.x), top: pct(l.y), width: pct(l.w), height: pct(l.h), mixBlendMode: l.blend, opacity: l.opacity } });
      case 'shadow': return h('div', { ...common, style: { left: pct(l.cx - l.rx), top: pct(l.cy - l.ry), width: pct(l.rx * 2), height: pct(l.ry * 2) } });
      case 'lights': return h('div', { ...common, style: { '--mv-light': l.color } }, l.points.map((p, i) => h('i', { key: i, 'data-tone': p.tone, style: { left: pct(p.x), top: pct(p.y), width: pct(p.r * 2), '--mv-phase': p.phase } })));
      case 'grade': return h('div', { ...common, style: { background: l.color, mixBlendMode: l.blend } });
      case 'particles': return particles ? h(ParticleCanvas, { key: l.key, kind: l.kind, count: Math.round((l.count ?? 40) * (reduced ? 0.5 : 1)), opacity: l.opacity }) : null;
      case 'ornament': {
        const i = orn++;
        const style = { left: pct(l.ax), top: pct(l.ay), width: pct(l.w), transform: `translate(${-l.anchor.x * 100}%, ${-l.anchor.y * 100}%) rotate(${l.rotate}deg)`, transformOrigin: `${l.anchor.x * 100}% ${l.anchor.y * 100}%`, zIndex: l.z, '--mv-delay': `${i * 55}ms` };
        const attrs = { ...common, 'aria-hidden': undefined, 'data-ornament-id': l.id, 'data-zone': l.zone, 'data-hero': l.hero ? '' : undefined, 'data-selected': selectedId === l.id ? '' : undefined, style };
        const img = h('img', { src: l.src, alt: '', draggable: false, decoding: 'async' });
        return interactive
          ? h('button', { ...attrs, type: 'button', 'aria-label': labelFor?.(l) ?? l.ornamentId, onClick: () => onOrnamentClick?.(l) }, img)
          : h('div', attrs, img);
      }
      default: return null;
    }
  });
  return h('div', { className: cx('mv-scene', className), 'data-world': scene.theme, 'data-enter': enter ? '' : undefined, 'data-selecting': selecting ? '' : undefined, style, role: 'img', 'aria-label': '크리스마스 트리 장면' }, layers);
}

/** 뷰포트에 장면을 맞추는 무대. children 은 장면 위 UI 이며 뷰포트 전체를 기준으로 놓인다 */
export function Stage({ scene, bgSrc, children, focus, sceneProps }) {
  const vp = useViewport();
  const fit = useMemo(() => fitScene(vp.w, vp.h, focus ?? { x: scene.tree.anchorX, y: 0.55 }), [vp.w, vp.h, focus, scene.tree.anchorX]);
  return h('div', { className: 'mv-stage', 'data-fit': fit.mode, style: { height: vp.h } },
    fit.mode === 'stage' && bgSrc ? h('div', { className: 'mv-stage__fill', style: { backgroundImage: `url(${bgSrc})` }, 'aria-hidden': 'true' }) : null,
    h('div', { className: 'mv-stage__frame', style: { left: fit.offsetX, width: fit.stageW, top: fit.offsetY, height: fit.stageH, bottom: 'auto' } }, h(SceneView, { scene, ...sceneProps })),
    h('div', { className: 'mv-scene-ui', style: { height: vp.h } }, children));
}
