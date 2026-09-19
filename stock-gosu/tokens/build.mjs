// 토큰 빌드(stock-gosu) — src/*.json(DTCG) 을 합쳐 tokens.json 과 dist/* 를 만든다.
// winterholic-base/tokens/build.mjs 와 같은 구조에 금융 전용 산출물(chart-theme.ts, legacy-aliases.css, [data-market=us] 반전)을 더했다.
// 사용: node tokens/build.mjs          (winterholic-base 디렉터리 기준 어디서 실행해도 된다)
// 의존성 없음. Node 18+.
//
// 산출물
//   tokens.json          합쳐진 단일 소스(라이트 색 기준). 다른 툴(Style Dictionary·Tokens Studio)에 넘길 때 이것.
//   tokens.dark.json     다크 색 토큰만.
//   dist/tokens.css      CSS 변수. :root(라이트) + 다크(prefers-color-scheme·[data-theme=dark])
//   dist/typography.css  .wh-heading-1 같은 역할별 텍스트 클래스
//   dist/tokens.js/.d.ts JS 객체(값은 CSS 변수 참조 문자열 + raw 값)
//   dist/tailwind.preset.cjs  Tailwind v3/v4 프리셋(색은 CSS 변수를 가리켜 다크모드가 자동)
//   dist/tokens.scss     SCSS 변수
//   dist/tokens.figma.json  Figma Tokens Studio 가 읽는 단일 세트(라이트·다크 두 세트)
//   dist/chart-theme.ts  recharts 용 raw 색(SVG 속성은 var() 불가). 라이트·다크 두 벌 + 시리즈 배열
//   dist/legacy-aliases.css  기존 global.css 변수명(--blue-500, --space-16, --finance-up …) → 새 토큰 브리지

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, '..', 'dist');
const PREFIX = 'sg';

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
    // canvas(gray.100) 위에는 primary·secondary 만 직접 놓는다(01 §3). 나머지 글자색은 흰 카드(default) 기준.
    ...['primary', 'secondary'].map((t) => [`color.text.${t}`, 'color.surface.canvas', 4.5]),
    ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'brand', 'success', 'warning', 'danger', 'info']
      .map((t) => [`color.text.${t}`, 'color.surface.default', 4.5]),
    ['color.action.primary-strict.text', 'color.action.primary-strict.bg', 4.5],
    ['color.action.primary.text', 'color.action.primary.bg', 3],
    ...['up', 'down', 'flat', 'us-up', 'us-down'].flatMap((d) => [[`color.finance.${d}.text`, 'color.surface.default', 4.5], [`color.finance.${d}.solid`, 'color.surface.default', 3], [`color.finance.${d}.on-bg`, `color.finance.${d}.bg`, 4.5]]),
    ['color.action.outline.text', 'color.surface.default', 4.5],
    ['color.action.secondary.text', 'color.action.secondary.bg', 4.5],
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
const GRADIENT_ANGLE = { sky: 'vertical', 'sparkline-up': 'vertical', 'sparkline-down': 'vertical', 'scrim-bottom': 'vertical', 'fade-right': 'horizontal' };
const varName = (path) => `--${PREFIX}-${path.join('-')}`;
const cssValue = (t) => {
  const v = t.resolved;
  switch (t.$type) {
    case 'fontFamily': return Array.isArray(v) ? v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : v;
    case 'shadow': return (Array.isArray(v) ? v : [v]).map((s) => `${s.inset ? 'inset ' : ''}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ');
    case 'gradient': { const ang = GRADIENT_ANGLE[t.path.at(-1)] ?? 'default'; return `linear-gradient(var(--${PREFIX}-gradient-angle-${ang}), ${v.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(', ')})`; }
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
const gradientAngleLine = `  --${PREFIX}-gradient-angle-default: 135deg;\n  --${PREFIX}-gradient-angle-vertical: 180deg;\n  --${PREFIX}-gradient-angle-horizontal: 90deg;`;

const css = `/* winterholic-base design tokens · 자동 생성 — 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
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

/* 미국식 등락색(상승 초록·하락 빨강). <html data-market="us"> 또는 종목 카드 단위로 스코프 */
[data-market="us"] {
${['text', 'solid', 'bg', 'border', 'muted', 'on-bg'].map((k) => `  --${PREFIX}-color-finance-up-${k}: var(--${PREFIX}-color-finance-us-up-${k});\n  --${PREFIX}-color-finance-down-${k}: var(--${PREFIX}-color-finance-us-down-${k});`).join('\n')}
  --${PREFIX}-color-finance-flash-up: var(--${PREFIX}-color-finance-us-flash-up);
  --${PREFIX}-color-finance-flash-down: var(--${PREFIX}-color-finance-us-flash-down);
  --${PREFIX}-color-chart-candle-up: var(--${PREFIX}-color-finance-us-up-solid);
  --${PREFIX}-color-chart-candle-down: var(--${PREFIX}-color-finance-us-down-solid);
  --${PREFIX}-color-chart-sparkline-up: var(--${PREFIX}-color-finance-us-up-solid);
  --${PREFIX}-color-chart-sparkline-down: var(--${PREFIX}-color-finance-us-down-solid);
}

/* 모션 축소 환경 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --${PREFIX}-motion-duration-fast: 0ms;
    --${PREFIX}-motion-duration-normal: 0ms;
    --${PREFIX}-motion-duration-slow: 0ms;
    --${PREFIX}-motion-duration-flash: 0ms;
    --${PREFIX}-motion-duration-chart: 0ms;
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
  const extra = /^(numeric|price-|change)/.test(name) ? '\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;' : '';
  return `.${PREFIX}-${name} {\n  font-family: ${fam};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* winterholic-base typography · 자동 생성 */
/* Pretendard 로드는 소비 앱이 한다(docs/02-typography.md). 여기서는 클래스만 정의한다. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; word-break: keep-all; overflow-wrap: anywhere; }
/* 등락 방향 유틸: 색 + 방향 부호는 컴포넌트가 붙인다(색만으로 전달 금지) */
.${PREFIX}-up { color: var(--${PREFIX}-color-finance-up-text); } .${PREFIX}-down { color: var(--${PREFIX}-color-finance-down-text); } .${PREFIX}-flat { color: var(--${PREFIX}-color-finance-flat-text); }
.${PREFIX}-up-solid { color: var(--${PREFIX}-color-finance-up-solid); } .${PREFIX}-down-solid { color: var(--${PREFIX}-color-finance-down-solid); }
body { font-family: var(--${PREFIX}-font-family-sans); font-size: var(--${PREFIX}-font-size-md); line-height: var(--${PREFIX}-font-line-height-relaxed); letter-spacing: var(--${PREFIX}-font-letter-spacing-snug); color: var(--${PREFIX}-color-text-primary); background: var(--${PREFIX}-color-surface-canvas); -webkit-font-smoothing: antialiased; }
code, kbd, pre, samp { font-family: var(--${PREFIX}-font-family-mono); }
:where(code):not(pre code) { font-size: 0.9em; padding: 0.1em 0.35em; border-radius: var(--${PREFIX}-radius-xs); background: var(--${PREFIX}-color-surface-sunken); }
:focus-visible { outline: var(--${PREFIX}-focus-ring-width) solid var(--${PREFIX}-color-interactive-focus-ring); outline-offset: var(--${PREFIX}-focus-ring-offset); }

${typoEntries.map(typoClass).join('\n\n')}

/* 반응형: 모바일에서 한 단계 내린다 */
@media (max-width: 767px) {
  .${PREFIX}-display-lg { font-size: var(--${PREFIX}-font-size-5xl); }
  .${PREFIX}-display    { font-size: var(--${PREFIX}-font-size-4xl); }
  .${PREFIX}-title-1    { font-size: var(--${PREFIX}-font-size-2xl); }
  .${PREFIX}-price-lg   { font-size: var(--${PREFIX}-font-size-3xl); }
}
`;
writeFileSync(join(DIST, 'typography.css'), typographyCss);

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
writeFileSync(join(DIST, 'tokens.js'), `// winterholic-base tokens · 자동 생성\n// 각 leaf: { var: 'var(--wh-…)', value: 라이트 raw 값, dark?: 다크 raw 값 }\n// 스타일에는 .var 를 쓰고(다크 자동), 계산이 필요할 때만 .value 를 쓴다.\nexport const tokens = ${JSON.stringify(jsTree, null, 2)};\nexport default tokens;\n`);
function dts(node, indent = '  ') {
  if ('var' in node && 'value' in node) return `{ var: string; value: ${typeof node.value === 'number' ? 'number' : typeof node.value === 'string' ? 'string' : 'unknown'}; dark?: unknown }`;
  return `{\n${Object.entries(node).map(([k, v]) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${dts(v, indent + '  ')};`).join('\n')}\n${indent.slice(2)}}`;
}
writeFileSync(join(DIST, 'tokens.d.ts'), `// winterholic-base tokens · 자동 생성\nexport declare const tokens: ${dts(jsTree)};\nexport default tokens;\n`);

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
writeFileSync(join(DIST, 'tailwind.preset.cjs'), `// winterholic-base Tailwind preset · 자동 생성\n// tailwind.config: { presets: [require('winterholic-base/dist/tailwind.preset.cjs')] }\n// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// 4f. tokens.scss
const scss = `// winterholic-base tokens · 자동 생성 — 라이트 raw 값. 다크가 필요하면 CSS 변수(dist/tokens.css)를 쓴다.\n` +
  [...L].filter(([, t]) => cssValue(t) != null).map(([, t]) => `$${PREFIX}-${t.path.join('-')}: ${cssValue(t)};`).join('\n') + '\n';
writeFileSync(join(DIST, 'tokens.scss'), scss);

// 4g. Figma Tokens Studio 포맷(세트 2개)
writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify({ 'wh/light': stripInternal(light), 'wh/dark': stripInternal(read('color.dark.json')), $metadata: { tokenSetOrder: ['wh/light', 'wh/dark'] } }, null, 2) + '\n');

// 4h. chart-theme.ts — recharts 용 raw 값
const chartOf = (map) => {
  const o = {};
  for (const [k, t] of map) if (k.startsWith('color.chart.') || k.startsWith('color.finance.')) {
    const parts = t.path.slice(1); let n = o; for (const p of parts.slice(0, -1)) n = n[p] ??= {}; n[parts.at(-1)] = t.resolved;
  }
  return o;
};
const cl = chartOf(L), cd = chartOf(D);
const chartTs = `// stock-gosu chart theme · 자동 생성 — 손으로 고치지 말고 tokens/src/color.*.json 을 고친 뒤 node tokens/build.mjs
// recharts 는 SVG fill/stroke 에 CSS var() 를 못 쓰므로 raw hex 를 여기서 가져간다. DOM 스타일(툴팁 등)은 CSS 변수를 쓴다.
// 사용: const t = currentChartTheme(); <Line stroke={t.series['1']} /> — 다크는 data-theme / prefers-color-scheme 로 고른다.
export const chartLight = ${JSON.stringify({ ...cl.chart, finance: cl.finance }, null, 2)} as const;
export const chartDark = ${JSON.stringify({ ...cd.chart, finance: cd.finance }, null, 2)} as const;
export type ChartTheme = typeof chartLight;
/** 카테고리 시리즈 8색. 고정 순서·순환 금지. 9번째부터는 other('기타')로 접는다. */
export const seriesColors = (t: ChartTheme = chartLight): readonly string[] => [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (t.series as Record<string, string>)[String(i)]);
export const seriesColor = (index: number, t: ChartTheme = chartLight): string => seriesColors(t)[index] ?? t.series.other;
export const isDarkTheme = (): boolean => typeof document !== 'undefined' && (document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
export const currentChartTheme = (): ChartTheme => (isDarkTheme() ? (chartDark as unknown as ChartTheme) : chartLight);
/** 공통 축·격자 스펙 — 모든 차트가 같은 문법으로 보이게 */
export const axisProps = (t: ChartTheme = chartLight) => ({ axisLine: false as const, tickLine: false as const, tick: { fontSize: 11, fill: t.axis } });
export const gridProps = (t: ChartTheme = chartLight) => ({ stroke: t.grid, strokeDasharray: '2 5', vertical: false as const });
export const chartMargin = { top: 8, right: 8, left: 0, bottom: 0 } as const;
export const chartAnimationDuration = ${parseInt(L.get('motion.duration.chart').resolved)};
`;
writeFileSync(join(DIST, 'chart-theme.ts'), chartTs);

// 4i. legacy-aliases.css — 기존 global.css 변수명 → 새 토큰. 점진 이관용(13 운영 §5)
const alias = (old, path) => `  ${old}: var(${varName(path.split('.'))});`;
const legacy = [
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => alias(`--blue-${s}`, `blue.${s}`)),
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => alias(`--gray-${s}`, `gray.${s}`)),
  alias('--white', 'base.white'),
  alias('--red-50', 'red.50'), alias('--red-500', 'red.500'), alias('--red-600', 'red.600'),
  alias('--green-50', 'green.50'), alias('--green-500', 'green.400'), alias('--green-600', 'green.500'),
  alias('--yellow-50', 'yellow.50'), alias('--yellow-500', 'yellow.300'), alias('--yellow-600', 'yellow.400'),
  alias('--finance-up', 'color.finance.up.solid'), alias('--finance-down', 'color.finance.down.solid'), alias('--finance-flat', 'color.finance.flat.solid'),
  alias('--up-bg', 'color.finance.up.bg'), alias('--down-bg', 'color.finance.down.bg'),
  alias('--text-primary', 'color.text.primary'), alias('--text-secondary', 'color.text.secondary'), alias('--text-tertiary', 'color.text.tertiary'),
  alias('--text-disabled', 'color.text.disabled'), alias('--text-brand', 'color.text.brand'), alias('--text-inverse', 'color.text.inverse'),
  alias('--bg-base', 'color.surface.default'), alias('--bg-subtle', 'color.surface.sunken'), alias('--bg-surface', 'color.surface.sunken-strong'),
  alias('--bg-elevated', 'color.surface.raised'), alias('--bg-page', 'color.surface.canvas'),
  alias('--border', 'color.border.default'), alias('--border-strong', 'color.border.strong'),
  alias('--radius-4', 'radius.xs'), alias('--radius-8', 'radius.md'), alias('--radius-12', 'radius.lg'), alias('--radius-16', 'radius.xl'), alias('--radius-20', 'radius.2xl'), alias('--radius-full', 'radius.full'),
  ...Object.entries({ 2: '0-5', 4: '1', 6: '1-5', 8: '2', 10: '2-5', 12: '3', 14: '3-5', 16: '4', 20: '5', 24: '6', 28: '7', 32: '8', 40: '10', 48: '12', 64: '16' }).map(([px, k]) => alias(`--space-${px}`, `space.${k}`)),
  alias('--shadow-1', 'shadow.sm'), alias('--shadow-2', 'shadow.md'), alias('--shadow-3', 'shadow.lg'), alias('--shadow-4', 'shadow.xl'),
  alias('--font-sans', 'font.family.sans'),
  alias('--ease-out', 'motion.easing.out'), alias('--ease-in-out', 'motion.easing.in-out'),
  alias('--dur-fast', 'motion.duration.fast'), alias('--dur-base', 'motion.duration.normal'), alias('--dur-slow', 'motion.duration.slow'),
  alias('--content-max', 'size.container.xl'), alias('--container-pad', 'size.layout.page-gutter-lg'),
  alias('--blue', 'blue.500'), alias('--blue-dark', 'blue.700'), alias('--blue-bg', 'blue.50'),
  alias('--up', 'color.finance.up.solid'), alias('--down', 'color.finance.down.solid'), alias('--flat', 'color.finance.flat.solid'),
  ...[900, 800, 700, 500, 400, 300, 200, 100].map((s) => alias(`--gray${s}`, `gray.${s}`)),
  alias('--green', 'green.400'), alias('--amber', 'yellow.300'),
  alias('--r-sm', 'radius.lg'), alias('--r', 'radius.xl'), alias('--r-lg', 'radius.2xl'),
  alias('--shadow', 'shadow.sm'), alias('--shadow-lg', 'shadow.md'), alias('--maxw', 'size.container.xl'),
  alias('--color-action-primary', 'color.action.primary.bg'), alias('--color-action-primary-hover', 'color.action.primary.bg-hover'),
  alias('--color-surface-raised', 'color.surface.raised'), alias('--color-surface-selected', 'color.interactive.selected-bg'),
  alias('--color-text-muted', 'color.text.tertiary'), alias('--focus-ring', 'color.interactive.focus-ring-soft'), alias('--size-touch-target', 'size.touch-target-min'),
];
writeFileSync(join(DIST, 'legacy-aliases.css'), `/* stock-gosu legacy aliases · 자동 생성
   기존 front/src/styles/global.css 의 변수명을 새 토큰(--sg-*)에 연결한다. tokens.css 다음에 로드하면 기존 화면이 그대로 돌고 다크모드까지 따라온다.
   새 코드는 --sg-* 를 직접 쓰고, 이 파일은 이관이 끝나면 지운다.
   주의: --green-500/--yellow-500 은 실제 밝기에 맞춰 green.400/yellow.300 으로 매핑된다(값은 같다). --text-tertiary/--text-brand 는 AA 를 맞춘 새 값으로 바뀐다. */
:root {
${legacy.join('\n')}
}
`);

// 4j. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');

console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · dist/ 10 files`);
