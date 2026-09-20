// 토큰 빌드(notting) — src/*.json(DTCG) 을 합쳐 tokens.json 과 dist/* 를 만든다.
// winterholic-base/tokens/build.mjs 와 같은 구조. 접두 nt, notting 전용 색 그룹(ai·citation·mark·diff·workflow·priority·decision·fidelity·code)의 대비 검사와 dist/prose.css(문서 본문 스타일)가 추가됐다.
// 사용: node tokens/build.mjs          (notting 디렉터리 기준 어디서 실행해도 된다)
// 의존성 없음. Node 18+.
//
// 산출물
//   tokens.json          합쳐진 단일 소스(라이트 색 기준). 다른 툴(Style Dictionary·Tokens Studio)에 넘길 때 이것.
//   tokens.dark.json     다크 색 토큰만.
//   dist/tokens.css      CSS 변수. :root(라이트) + 다크(prefers-color-scheme·[data-theme=dark])
//   dist/typography.css  .nt-heading-1 같은 역할별 텍스트 클래스
//   dist/prose.css       .nt-doc 안의 h1·p·code·blockquote 등 문서 본문 스타일(에디터·읽기 모드·Ask 답변)
//   dist/tokens.js/.d.ts JS 객체(값은 CSS 변수 참조 문자열 + raw 값)
//   dist/tailwind.preset.cjs  Tailwind v3/v4 프리셋(색은 CSS 변수를 가리켜 다크모드가 자동)
//   dist/tokens.scss     SCSS 변수
//   dist/tokens.figma.json  Figma Tokens Studio 가 읽는 단일 세트(라이트·다크 두 세트)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, '..', 'dist');
const PREFIX = 'nt';

const read = (f) => JSON.parse(readFileSync(join(SRC, f), 'utf8'));

// ---------- 1. 합치기 ----------
const primitives = { ...read('palette.json'), ...read('brand.json') };
const shared = { ...read('dimension.json'), ...read('typography.json'), ...read('effects.json'), ...read('motion.json') };
const component = read('component.json');
const light = { ...primitives, ...shared, ...read('color.light.json'), ...component };
const dark = { ...primitives, ...shared, ...read('color.dark.json'), ...component };

// ---------- 2. 평탄화 + 참조 해석 ----------
function flatten(obj, path = [], out = new Map(), inheritedType) {
  const type = obj.$type ?? inheritedType;
  if ('$value' in obj) { out.set(path.join('.'), { ...obj, $type: type, path }); return out; }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    flatten(v, [...path, k], out, type);
  }
  return out;
}
const REF = /^\{([^}]+)\}$/;
function resolveValue(value, map, seen = new Set()) {
  if (typeof value === 'string') {
    const m = value.match(REF);
    if (!m) return value;
    const target = map.get(m[1]);
    if (!target) throw new Error(`참조 대상 없음: ${value}`);
    if (seen.has(m[1])) throw new Error(`순환 참조: ${[...seen, m[1]].join(' -> ')}`);
    return resolveValue(target.$value, map, new Set([...seen, m[1]]));
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(v, map, seen));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveValue(v, map, seen)]));
  return value;
}
function resolveAll(tree) {
  const map = flatten(tree);
  const resolved = new Map();
  for (const [k, t] of map) resolved.set(k, { ...t, resolved: resolveValue(t.$value, map) });
  return resolved;
}
const L = resolveAll(light);
const D = resolveAll(dark);

// ---------- 3. 검증 ----------
const errors = [];
const lightColor = [...L.keys()].filter((k) => k.startsWith('color.'));
const darkColor = [...D.keys()].filter((k) => k.startsWith('color.'));
for (const k of lightColor) if (!D.has(k)) errors.push(`다크에 없음: ${k}`);
for (const k of darkColor) if (!L.has(k)) errors.push(`라이트에 없음: ${k}`);

// 대비 검사: 글자 토큰은 canvas·default 위에서 4.5:1, on-* 글자는 자기 배경 위에서 4.5:1
const hex6 = (v) => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : null);
function checkContrast(map, mode) {
  const get = (k) => hex6(map.get(k)?.resolved);
  const pairs = [
    ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'brand', 'success', 'warning', 'danger', 'info', 'ai']
      .flatMap((t) => ['canvas', 'default'].map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
    ['color.action.ai.text', 'color.action.ai.bg', 4.5],
    ['color.action.danger-ghost.text', 'color.surface.default', 4.5],
    // notting 전용 그룹
    ['color.ai.text', 'color.ai.bg', 4.5],
    ['color.ai.icon', 'color.ai.bg', 3],
    ['color.ai.on-solid', 'color.ai.solid', 4.5],
    ['color.citation.text', 'color.citation.bg', 4.5],
    ['color.citation.text', 'color.citation.bg-hover', 4.5],
    ['color.citation.stale-text', 'color.citation.stale-bg', 4.5],
    ['color.citation.marker', 'color.surface.default', 3],
    ['color.mark.highlight-text', 'color.mark.highlight', 4.5],
    ['color.text.primary', 'color.mark.selection', 4.5],
    ['color.mark.drop-indicator', 'color.surface.default', 3],
    ...['added', 'removed', 'changed'].flatMap((d) => [[`color.diff.${d}-text`, `color.diff.${d}-bg`, 4.5], [`color.diff.${d}-marker`, `color.diff.${d}-bg`, 3]]),
    ['color.text.primary', 'color.diff.conflict-bg', 4.5],
    ...['backlog', 'todo', 'in-progress', 'review', 'done', 'canceled'].map((w) => [`color.workflow.${w}.text`, `color.workflow.${w}.bg`, 4.5]),
    ...['proposed', 'accepted', 'deprecated', 'superseded', 'rejected'].map((d) => [`color.decision.${d}.text`, `color.decision.${d}.bg`, 4.5]),
    ...['lossless', 'normalized', 'degraded', 'dropped', 'opaque'].flatMap((f) => [[`color.fidelity.${f}.text`, `color.fidelity.${f}.bg`, 4.5], [`color.fidelity.${f}.solid`, 'color.surface.default', 3]]),
    ...['urgent', 'high', 'medium', 'low'].map((p) => [`color.priority.${p}`, 'color.surface.default', 3]),
    ...['text', 'keyword', 'string', 'number', 'function', 'punctuation', 'comment'].map((c) => [`color.code.${c}`, 'color.code.bg', 4.5]),
    ['color.code.line-number', 'color.code.bg', 3],
    ['color.code.text', 'color.code.line-highlight', 4.5],
    ['color.code.string', 'color.code.bg-inline', 4.5],
    ['color.text.primary', 'color.code.bg-inline', 4.5],
    ['color.text.primary', 'color.surface.sunken', 4.5],
    ['color.text.secondary', 'color.surface.sunken', 4.5],
    ['color.text.primary', 'color.surface.brand-subtle', 4.5],
    ['color.interactive.selected-text', 'color.interactive.selected-bg', 4.5],
    ['color.text.tertiary', 'color.ai.bg', 4.5],
    ['color.action.primary.text', 'color.action.primary.bg', 4.5],
    ['color.action.danger.text', 'color.action.danger.bg', 4.5],
    ['color.action.secondary.text', 'color.action.secondary.bg', 4.5],
    ['color.action.ghost.text', 'color.surface.default', 4.5],
    ['color.text.on-brand', 'color.surface.brand', 4.5],
    ['color.text.inverse', 'color.surface.inverse', 4.5],
    ...['success', 'warning', 'danger', 'info', 'neutral'].flatMap((s) => [
      [`color.status.${s}.text`, `color.status.${s}.bg`, 4.5],
      [`color.status.${s}.on-solid`, `color.status.${s}.solid`, 4.5],
      [`color.status.${s}.icon`, `color.status.${s}.bg`, 3],
    ]),
    ['color.interactive.focus-ring', 'color.surface.default', 3],
    ['color.border.input-strict', 'color.surface.default', 3],
  ];
  const report = [];
  for (const [fg, bg, min] of pairs) {
    const f = get(fg), b = get(bg);
    if (!f || !b) continue;
    const c = contrast(f, b);
    report.push({ mode, fg, bg, ratio: +c.toFixed(2), min, pass: c >= min });
    if (c < min) errors.push(`[${mode}] 대비 미달 ${fg}(${f}) on ${bg}(${b}) = ${c.toFixed(2)} < ${min}`);
  }
  return report;
}
const contrastReport = [...checkContrast(L, 'light'), ...checkContrast(D, 'dark')];

if (errors.length) {
  console.error('토큰 빌드 실패:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---------- 4. 직렬화 ----------
const varName = (path) => `--${PREFIX}-${path.join('-')}`;
const cssValue = (t) => {
  const v = t.resolved;
  switch (t.$type) {
    case 'fontFamily': return Array.isArray(v) ? v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : v;
    case 'shadow': return (Array.isArray(v) ? v : [v]).map((s) => `${s.inset ? 'inset ' : ''}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ');
    case 'gradient': { const ang = ['scrim-bottom', 'fade-bottom'].includes(t.path.at(-1)) ? 'vertical' : 'default'; return `linear-gradient(var(--${PREFIX}-gradient-angle-${ang}), ${v.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(', ')})`; }
    case 'cubicBezier': return `cubic-bezier(${v.join(', ')})`;
    case 'typography': return null; // 복합 — 별도 클래스로
    case 'number': return String(v);
    default: return String(v);
  }
};
const cssVarLines = (map, filter = () => true) => {
  const lines = [];
  for (const [k, t] of map) {
    if (!filter(k)) continue;
    const val = cssValue(t);
    if (val == null) continue;
    lines.push(`  ${varName(t.path)}: ${val};`);
  }
  return lines;
};

mkdirSync(DIST, { recursive: true });

// 4a. tokens.json / tokens.dark.json
const stripInternal = (obj) => JSON.parse(JSON.stringify(obj));
writeFileSync(join(ROOT, 'tokens.json'), JSON.stringify(stripInternal(light), null, 2) + '\n');
writeFileSync(join(ROOT, 'tokens.dark.json'), JSON.stringify(stripInternal(read('color.dark.json')), null, 2) + '\n');

// 4b. tokens.css
const isDarkVarying = (k) => k.startsWith('color.') || k.startsWith('component.') && ['bg', 'border', 'text', 'color'].some((s) => k.includes(`.${s}`));
const darkDiffers = (k) => JSON.stringify(L.get(k)?.resolved) !== JSON.stringify(D.get(k)?.resolved);
// 다크에서 shadow.* 는 shadow-dark.* 값으로 갈아 끼운다
const darkShadowLines = [...L.keys()].filter((k) => k.startsWith('shadow.')).map((k) => {
  const dk = k.replace('shadow.', 'shadow-dark.');
  return D.has(dk) ? `  ${varName(L.get(k).path)}: ${cssValue(D.get(dk))};` : null;
}).filter(Boolean);
const darkLines = [...cssVarLines(D, (k) => (k.startsWith('color.') || k.startsWith('component.')) && darkDiffers(k)), ...darkShadowLines];
const gradientAngleLine = `  --${PREFIX}-gradient-angle-default: 135deg;\n  --${PREFIX}-gradient-angle-vertical: 180deg;`;

const css = `/* notting design tokens · 자동 생성 — 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
:root {
  color-scheme: light dark;
${gradientAngleLine}
${cssVarLines(L, (k) => !k.startsWith('shadow-dark.') && !k.startsWith('gradient-angle.')).join('\n')}
}

/* 다크: 시스템 설정을 따르되 data-theme="light" 로 강제 라이트 가능 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${darkLines.join('\n')}
  }
}
/* 다크: data-theme="dark" 로 강제 */
:root[data-theme="dark"] {
${darkLines.join('\n')}
}

/* 모션 축소 환경 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --${PREFIX}-motion-duration-fast: 0ms;
    --${PREFIX}-motion-duration-normal: 0ms;
    --${PREFIX}-motion-duration-slow: 0ms;
    --${PREFIX}-motion-duration-slower: 0ms;
  }
}
`;
writeFileSync(join(DIST, 'tokens.css'), css);

// 4c. typography.css — 역할 클래스 + base 스타일
const typoEntries = [...L].filter(([k, t]) => t.$type === 'typography' && k.startsWith('typography.'));
const typoClass = ([k, t]) => {
  const v = t.resolved;
  const name = k.split('.').pop();
  const fam = Array.isArray(v.fontFamily) ? v.fontFamily.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : v.fontFamily;
  const extra = name === 'numeric' || name === 'mono-label' || name === 'kbd' ? '\n  font-variant-numeric: tabular-nums;' : name === 'overline' ? '\n  text-transform: uppercase;' : '';
  return `.${PREFIX}-${name} {\n  font-family: ${fam};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* notting typography · 자동 생성 */
/* Pretendard·JetBrains Mono 로드는 소비 앱이 한다(docs/02-typography.md). 여기서는 클래스만 정의한다. 문서 본문은 dist/prose.css. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; word-break: keep-all; overflow-wrap: anywhere; }
body { font-family: var(--${PREFIX}-font-family-sans); font-size: var(--${PREFIX}-font-size-md); line-height: var(--${PREFIX}-font-line-height-relaxed); color: var(--${PREFIX}-color-text-primary); background: var(--${PREFIX}-color-surface-canvas); -webkit-font-smoothing: antialiased; }
code, kbd, pre, samp { font-family: var(--${PREFIX}-font-family-mono); }
:where(code):not(pre code) { font-size: 0.9em; padding: 0.1em 0.35em; border-radius: var(--${PREFIX}-radius-xs); background: var(--${PREFIX}-color-surface-sunken); }
:focus-visible { outline: var(--${PREFIX}-focus-ring-width) solid var(--${PREFIX}-color-interactive-focus-ring); outline-offset: var(--${PREFIX}-focus-ring-offset); }

${typoEntries.map(typoClass).join('\n\n')}

::selection { background: var(--${PREFIX}-color-mark-selection); }
mark, .${PREFIX}-mark { background: var(--${PREFIX}-color-mark-highlight); color: var(--${PREFIX}-color-mark-highlight-text); border-radius: var(--${PREFIX}-radius-xs); padding-inline: var(--${PREFIX}-space-0-5); }
kbd, .${PREFIX}-kbd { display: inline-flex; align-items: center; height: var(--${PREFIX}-component-kbd-height); padding-inline: var(--${PREFIX}-component-kbd-padding-x); border-radius: var(--${PREFIX}-component-kbd-radius); background: var(--${PREFIX}-component-kbd-bg); border: var(--${PREFIX}-border-width-hairline) solid var(--${PREFIX}-component-kbd-border); border-bottom-width: var(--${PREFIX}-border-width-focus); color: var(--${PREFIX}-component-kbd-text); font-family: var(--${PREFIX}-font-family-mono); font-size: var(--${PREFIX}-font-size-2xs); font-weight: var(--${PREFIX}-font-weight-medium); line-height: 1; }

/* 반응형: 랜딩 display·문서 제목은 모바일에서 한 단계 내린다 */
@media (max-width: 767px) {
  .${PREFIX}-display-lg { font-size: var(--${PREFIX}-font-size-5xl); }
  .${PREFIX}-display-md { font-size: var(--${PREFIX}-font-size-4xl); }
  .${PREFIX}-display-sm { font-size: var(--${PREFIX}-font-size-3xl); }
  .${PREFIX}-heading-1  { font-size: var(--${PREFIX}-font-size-2xl); }
  .${PREFIX}-prose-title { font-size: var(--${PREFIX}-font-size-3xl); }
}
`;
writeFileSync(join(DIST, 'typography.css'), typographyCss);

// 4c-2. prose.css — .nt-doc 안의 문서 본문. 에디터(Tiptap 렌더 결과)·읽기 모드·Ask 답변 본문·Markdown 미리보기가 같은 클래스를 쓴다.
const P = PREFIX;
const proseCss = `/* notting prose · 자동 생성 — .${P}-doc 안의 문서 본문 스타일. 값은 전부 토큰(docs/02 §6, docs/06 §17). */
.${P}-doc { max-width: var(--${P}-size-container-prose); color: var(--${P}-color-text-primary); font-family: var(--${P}-font-family-sans); font-size: var(--${P}-font-size-md); line-height: var(--${P}-font-line-height-prose); }
.${P}-doc > * + * { margin-top: var(--${P}-component-editor-block-gap); }
.${P}-doc h1, .${P}-doc h2, .${P}-doc h3, .${P}-doc h4, .${P}-doc h5, .${P}-doc h6 { margin-bottom: 0; color: var(--${P}-color-text-primary); }
.${P}-doc h1 { font-size: var(--${P}-font-size-3xl); font-weight: var(--${P}-font-weight-bold); line-height: var(--${P}-font-line-height-snug); letter-spacing: var(--${P}-font-letter-spacing-tight); margin-top: var(--${P}-component-editor-heading-gap-h1); }
.${P}-doc h2 { font-size: var(--${P}-font-size-2xl); font-weight: var(--${P}-font-weight-semibold); line-height: var(--${P}-font-line-height-snug); letter-spacing: var(--${P}-font-letter-spacing-tight); margin-top: var(--${P}-component-editor-heading-gap-h2); }
.${P}-doc h3, .${P}-doc h4, .${P}-doc h5, .${P}-doc h6 { font-size: var(--${P}-font-size-xl); font-weight: var(--${P}-font-weight-semibold); line-height: var(--${P}-font-line-height-snug); letter-spacing: var(--${P}-font-letter-spacing-snug); margin-top: var(--${P}-component-editor-heading-gap-h3); }
.${P}-doc > :is(h1, h2, h3):first-child { margin-top: 0; }
.${P}-doc p { margin: 0; }
.${P}-doc a { color: var(--${P}-color-text-link); text-decoration: underline; text-underline-offset: 0.15em; text-decoration-color: var(--${P}-color-border-brand); }
.${P}-doc a:hover { color: var(--${P}-color-text-link-hover); }
.${P}-doc strong { font-weight: var(--${P}-font-weight-semibold); }
.${P}-doc ul, .${P}-doc ol { margin: 0; padding-left: var(--${P}-size-layout-indent); }
.${P}-doc li + li, .${P}-doc li > ul, .${P}-doc li > ol { margin-top: var(--${P}-space-0-5); }
.${P}-doc ul[data-type="taskList"] { list-style: none; padding-left: 0; }
.${P}-doc ul[data-type="taskList"] > li { display: flex; gap: var(--${P}-component-checkbox-label-gap); align-items: flex-start; }
.${P}-doc ul[data-type="taskList"] input[type="checkbox"] { width: var(--${P}-component-checkbox-size-inline); height: var(--${P}-component-checkbox-size-inline); margin: 0.35em 0 0; accent-color: var(--${P}-component-checkbox-bg-checked); }
.${P}-doc li[data-checked="true"] > div { color: var(--${P}-color-text-tertiary); text-decoration: line-through; }
.${P}-doc blockquote { margin: 0; padding-left: var(--${P}-component-block-quote-padding-left); border-left: var(--${P}-component-block-quote-marker-width) solid var(--${P}-component-block-quote-marker-color); color: var(--${P}-component-block-quote-text); }
.${P}-doc code { font-family: var(--${P}-font-family-mono); }
.${P}-doc :not(pre) > code { font-size: 0.9em; padding: 0.1em var(--${P}-component-inline-code-padding-x); border-radius: var(--${P}-component-inline-code-radius); background: var(--${P}-component-inline-code-bg); color: var(--${P}-component-inline-code-text); }
.${P}-doc pre { margin: 0; padding: var(--${P}-component-block-code-padding); border-radius: var(--${P}-component-block-code-radius); background: var(--${P}-component-block-code-bg); border: var(--${P}-border-width-hairline) solid var(--${P}-component-block-code-border); color: var(--${P}-color-code-text); font-size: var(--${P}-font-size-sm); line-height: var(--${P}-font-line-height-relaxed); overflow-x: auto; tab-size: 2; }
.${P}-doc pre code { font-size: inherit; padding: 0; background: none; color: inherit; }
.${P}-doc :is(.token.comment, .hljs-comment) { color: var(--${P}-color-code-comment); }
.${P}-doc :is(.token.keyword, .hljs-keyword) { color: var(--${P}-color-code-keyword); }
.${P}-doc :is(.token.string, .hljs-string) { color: var(--${P}-color-code-string); }
.${P}-doc :is(.token.number, .hljs-number) { color: var(--${P}-color-code-number); }
.${P}-doc :is(.token.function, .hljs-title) { color: var(--${P}-color-code-function); }
.${P}-doc :is(.token.punctuation, .hljs-punctuation) { color: var(--${P}-color-code-punctuation); }
.${P}-doc pre .line-highlight, .${P}-doc pre [data-highlighted] { background: var(--${P}-component-block-code-line-highlight); }
.${P}-doc hr { border: 0; border-top: var(--${P}-border-width-hairline) solid var(--${P}-component-block-divider-color); margin: var(--${P}-component-block-divider-margin-y) 0; }
.${P}-doc table { width: 100%; border-collapse: collapse; font-size: var(--${P}-font-size-sm); line-height: var(--${P}-font-line-height-relaxed); }
.${P}-doc th, .${P}-doc td { padding: var(--${P}-component-block-table-cell-padding-y) var(--${P}-component-block-table-cell-padding-x); border: var(--${P}-border-width-hairline) solid var(--${P}-component-block-table-border); text-align: left; vertical-align: top; min-width: var(--${P}-component-block-table-min-col-width); }
.${P}-doc th { background: var(--${P}-component-block-table-header-bg); font-weight: var(--${P}-font-weight-medium); color: var(--${P}-color-text-secondary); }
.${P}-doc img { max-width: 100%; height: auto; border-radius: var(--${P}-component-block-image-radius); display: block; }
.${P}-doc figure { margin: 0; }
.${P}-doc figcaption { margin-top: var(--${P}-component-block-image-caption-gap); font-size: var(--${P}-font-size-sm); line-height: var(--${P}-font-line-height-normal); color: var(--${P}-component-block-image-caption-color); }
.${P}-doc .${P}-callout { display: flex; gap: var(--${P}-component-block-callout-gap); padding: var(--${P}-component-block-callout-padding); border-radius: var(--${P}-component-block-callout-radius); background: var(--${P}-component-block-callout-bg); }
.${P}-doc .${P}-callout > :is(svg, .icon) { flex: none; width: var(--${P}-component-block-callout-icon-size); height: var(--${P}-component-block-callout-icon-size); margin-top: 0.15em; }
.${P}-doc .${P}-callout--info    { background: var(--${P}-color-status-info-bg);    border-left: var(--${P}-component-block-callout-accent-width) solid var(--${P}-color-status-info-icon); }
.${P}-doc .${P}-callout--warning { background: var(--${P}-color-status-warning-bg); border-left: var(--${P}-component-block-callout-accent-width) solid var(--${P}-color-status-warning-icon); }
.${P}-doc .${P}-callout--danger  { background: var(--${P}-color-status-danger-bg);  border-left: var(--${P}-component-block-callout-accent-width) solid var(--${P}-color-status-danger-icon); }
.${P}-doc .${P}-callout--success { background: var(--${P}-color-status-success-bg); border-left: var(--${P}-component-block-callout-accent-width) solid var(--${P}-color-status-success-icon); }
.${P}-doc .${P}-callout--ai      { background: var(--${P}-color-ai-bg); border-left: var(--${P}-component-block-callout-accent-width) solid var(--${P}-color-ai-icon); }
.${P}-doc details > summary { cursor: pointer; list-style: none; display: flex; align-items: flex-start; gap: var(--${P}-space-1); }
.${P}-doc details > summary::-webkit-details-marker { display: none; }
.${P}-doc details > summary::before { content: ''; flex: none; width: var(--${P}-component-block-toggle-chevron-size); height: var(--${P}-component-block-toggle-chevron-size); margin-top: 0.3em; background-color: var(--${P}-component-block-toggle-chevron-color); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E") center / contain no-repeat; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E") center / contain no-repeat; transition: transform var(--${P}-motion-duration-normal) var(--${P}-motion-easing-standard); }
.${P}-doc details[open] > summary::before { transform: rotate(90deg); }
.${P}-doc details > :not(summary) { margin-left: var(--${P}-component-block-toggle-indent); }
.${P}-doc .${P}-cite { display: inline-flex; align-items: center; justify-content: center; vertical-align: baseline; min-width: var(--${P}-component-citation-min-width); height: var(--${P}-component-citation-height); padding-inline: var(--${P}-component-citation-padding-x); margin-left: var(--${P}-component-citation-gap); border-radius: var(--${P}-component-citation-radius); background: var(--${P}-component-citation-bg); color: var(--${P}-component-citation-text); font-family: var(--${P}-font-family-mono); font-size: var(--${P}-font-size-2xs); font-weight: var(--${P}-font-weight-medium); line-height: 1; text-decoration: none; }
.${P}-doc .${P}-cite:hover { background: var(--${P}-component-citation-bg-hover); }
.${P}-doc .${P}-cite--stale { background: var(--${P}-color-citation-stale-bg); color: var(--${P}-color-citation-stale-text); }
.${P}-doc [data-cited] { position: relative; }
.${P}-doc [data-cited]::before { content: ''; position: absolute; left: calc(-1 * var(--${P}-space-3)); top: 0; bottom: 0; width: var(--${P}-component-citation-source-marker-width); border-radius: var(--${P}-radius-full); background: var(--${P}-component-citation-source-marker-color); }
.${P}-doc .${P}-flash { animation: ${P}-flash var(--${P}-motion-duration-flash) var(--${P}-motion-easing-standard) both; }
@keyframes ${P}-flash { from { background-color: var(--${P}-component-citation-source-flash-bg); } to { background-color: transparent; } }
.${P}-doc .${P}-empty-block::before { content: attr(data-placeholder); color: var(--${P}-component-editor-placeholder); pointer-events: none; }
@media (max-width: 767px) { .${P}-doc h1 { font-size: var(--${P}-font-size-2xl); } .${P}-doc h2 { font-size: var(--${P}-font-size-xl); } .${P}-doc :is(h3, h4, h5, h6) { font-size: var(--${P}-font-size-lg); } }
`;
writeFileSync(join(DIST, 'prose.css'), proseCss);

// 4d. tokens.js / tokens.d.ts — 중첩 객체. 각 leaf = { var, value, dark? }
function nest(map, other) {
  const root = {};
  for (const [k, t] of map) {
    let node = root;
    for (const p of t.path.slice(0, -1)) node = node[p] ??= {};
    const leaf = { var: `var(${varName(t.path)})`, value: t.resolved };
    const o = other.get(k);
    if (o && JSON.stringify(o.resolved) !== JSON.stringify(t.resolved)) leaf.dark = o.resolved;
    node[t.path.at(-1)] = leaf;
  }
  return root;
}
const jsTree = nest(L, D);
writeFileSync(join(DIST, 'tokens.js'), `// notting tokens · 자동 생성\n// 각 leaf: { var: 'var(--nt-…)', value: 라이트 raw 값, dark?: 다크 raw 값 }\n// 스타일에는 .var 를 쓰고(다크 자동), 계산이 필요할 때만 .value 를 쓴다.\nexport const tokens = ${JSON.stringify(jsTree, null, 2)};\nexport default tokens;\n`);
function dts(node, indent = '  ') {
  if ('var' in node && 'value' in node) return `{ var: string; value: ${typeof node.value === 'number' ? 'number' : typeof node.value === 'string' ? 'string' : 'unknown'}; dark?: unknown }`;
  return `{\n${Object.entries(node).map(([k, v]) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${dts(v, indent + '  ')};`).join('\n')}\n${indent.slice(2)}}`;
}
writeFileSync(join(DIST, 'tokens.d.ts'), `// notting tokens · 자동 생성\nexport declare const tokens: ${dts(jsTree)};\nexport default tokens;\n`);

// 4e. tailwind.preset.cjs — 색·간격·radius·shadow 를 CSS 변수로 연결
const twColors = {};
for (const [k, t] of L) {
  if (!k.startsWith('color.')) continue;
  const parts = t.path.slice(1);
  let node = twColors;
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  node[parts.at(-1)] = `var(${varName(t.path)})`;
}
// 원시 램프도 노출(장식용). 사용 규칙은 docs/01-color.md
for (const ramp of Object.keys(read('palette.json'))) {
  twColors[ramp] = Object.fromEntries([...L].filter(([k]) => k.startsWith(`${ramp}.`)).map(([k, t]) => [t.path.at(-1), `var(${varName(t.path)})`]));
}
const twScale = (prefix) => Object.fromEntries([...L].filter(([k]) => k.startsWith(prefix + '.')).map(([k, t]) => [t.path.slice(prefix.split('.').length).join('-'), `var(${varName(t.path)})`]));
const preset = {
  theme: {
    extend: {
      colors: twColors,
      spacing: Object.fromEntries(Object.entries(twScale('space')).map(([k, v]) => [k.replace('-', '.'), v])),
      borderRadius: twScale('radius'),
      boxShadow: twScale('shadow'),
      fontFamily: { sans: `var(${varName(['font', 'family', 'sans'])})`, mono: `var(${varName(['font', 'family', 'mono'])})`, display: `var(${varName(['font', 'family', 'display'])})` },
      fontSize: twScale('font.size'),
      lineHeight: twScale('font.line-height'),
      letterSpacing: twScale('font.letter-spacing'),
      fontWeight: twScale('font.weight'),
      zIndex: twScale('z-index'),
      transitionDuration: Object.fromEntries([...L].filter(([k]) => k.startsWith('motion.duration.')).map(([k, t]) => [t.path.at(-1), `var(${varName(t.path)})`])),
      transitionTimingFunction: Object.fromEntries([...L].filter(([k]) => k.startsWith('motion.easing.')).map(([k, t]) => [t.path.at(-1), `var(${varName(t.path)})`])),
      maxWidth: Object.fromEntries([...L].filter(([k]) => k.startsWith('size.container.')).map(([k, t]) => [`container-${t.path.at(-1)}`, `var(${varName(t.path)})`])),
      height: { ...Object.fromEntries([...L].filter(([k]) => k.startsWith('size.control.')).map(([k, t]) => [`control-${t.path.at(-1)}`, `var(${varName(t.path)})`])) },
      width: { ...Object.fromEntries([...L].filter(([k]) => k.startsWith('size.icon.')).map(([k, t]) => [`icon-${t.path.at(-1)}`, `var(${varName(t.path)})`])) },
    },
    screens: Object.fromEntries([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([k, t]) => [t.path.at(-1), t.resolved])),
  },
};
writeFileSync(join(DIST, 'tailwind.preset.cjs'), `// notting Tailwind preset · 자동 생성\n// tailwind.config: { presets: [require('notting/dist/tailwind.preset.cjs')] }\n// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// 4f. tokens.scss
const scss = `// notting tokens · 자동 생성 — 라이트 raw 값. 다크가 필요하면 CSS 변수(dist/tokens.css)를 쓴다.\n` +
  [...L].filter(([, t]) => cssValue(t) != null).map(([, t]) => `$${PREFIX}-${t.path.join('-')}: ${cssValue(t)};`).join('\n') + '\n';
writeFileSync(join(DIST, 'tokens.scss'), scss);

// 4g. Figma Tokens Studio 포맷(세트 2개)
writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify({ 'nt/light': stripInternal(light), 'nt/dark': stripInternal(read('color.dark.json')), $metadata: { tokenSetOrder: ['nt/light', 'nt/dark'] } }, null, 2) + '\n');

// 4h. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');

console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · dist/ 9 files`);
