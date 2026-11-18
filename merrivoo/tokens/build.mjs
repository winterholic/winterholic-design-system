// 토큰 빌드 — src/*.json(DTCG) 을 합쳐 tokens.json 과 dist/* 를 만든다.
// 사용: node tokens/build.mjs          (merrivoo 디렉터리 기준 어디서 실행해도 된다)
// 의존성 없음. Node 18+.
//
// 산출물
//   tokens.json          합쳐진 단일 소스(라이트 색 기준). 다른 툴(Style Dictionary·Tokens Studio)에 넘길 때 이것.
//   tokens.dark.json     다크 색 토큰만.
//   dist/tokens.css      CSS 변수. :root(라이트) + 다크(prefers-color-scheme·[data-theme=dark])
//   dist/typography.css  .mv-heading-1 같은 역할별 텍스트 클래스
//   dist/tokens.js/.d.ts JS 객체(값은 CSS 변수 참조 문자열 + raw 값)
//   dist/tailwind.preset.cjs  Tailwind v3/v4 프리셋(색은 CSS 변수를 가리켜 다크모드가 자동)
//   dist/tokens.scss     SCSS 변수
//   dist/tokens.figma.json  Figma Tokens Studio 가 읽는 단일 세트(라이트·다크 두 세트)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, '..', 'dist');
const PREFIX = 'mv';

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
    ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'brand', 'success', 'warning', 'danger', 'info']
      .flatMap((t) => ['canvas', 'default'].map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
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
    case 'gradient': return `linear-gradient(var(--${PREFIX}-gradient-angle-default, 135deg), ${v.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(', ')})`;
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
const gradientAngleLine = `  --${PREFIX}-gradient-angle-default: 135deg;\n  --${PREFIX}-gradient-angle-scrim: 180deg;`;

const css = `/* merrivoo design tokens · 자동 생성 — 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
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
// 세계관 테마: color.scene.* 와 프레임 금박만 바꾼다. 글자·버튼·상태 색은 건드리지 않는다
const WORLD_ALLOWED = new Set(['scene.glow', 'scene.ground-shadow', 'scene.tint', 'border.gold']);
const worldBlocks = [];
const worldIds = [];
const worldMap = flatten({ ...primitives, ...shared, ...read('color.light.json') });
for (const [wid, toks] of Object.entries(read('theme.worlds.json').world)) {
  if (wid.startsWith('$')) continue;
  worldIds.push(wid);
  const lines = [];
  for (const [k, t] of Object.entries(toks)) {
    if (k.startsWith('$')) continue;
    if (!WORLD_ALLOWED.has(k)) { errors.push(`세계관 테마 ${wid}: 허용되지 않은 토큰 ${k}`); continue; }
    if (!L.has('color.' + k)) { errors.push(`세계관 테마 ${wid}: 없는 토큰 color.${k}`); continue; }
    lines.push(`  --${PREFIX}-color-${k.replace(/\./g, '-')}: ${resolveValue(t.$value, worldMap)};`);
  }
  worldBlocks.push(`[data-world="${wid}"] {\n${lines.join('\n')}\n}`);
}
if (errors.length) { console.error('토큰 빌드 실패:\n' + errors.map((e) => '  - ' + e).join('\n')); process.exit(1); }
writeFileSync(join(DIST, 'tokens.css'), css + `\n/* 세계관 테마 */\n${worldBlocks.join('\n')}\n`);

// 4c. typography.css — 역할 클래스 + base 스타일
const typoEntries = [...L].filter(([k, t]) => t.$type === 'typography' && k.startsWith('typography.'));
const typoClass = ([k, t]) => {
  const v = t.resolved;
  const name = k.split('.').pop();
  const fam = Array.isArray(v.fontFamily) ? v.fontFamily.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : v.fontFamily;
  const extra = name === 'numeric' ? '\n  font-variant-numeric: tabular-nums;' : name === 'overline' ? '\n  text-transform: uppercase;' : (name === 'score' || name.startsWith('display')) ? '\n  font-variant-numeric: lining-nums;' : '';
  return `.${PREFIX}-${name} {\n  font-family: ${fam};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* merrivoo typography · 자동 생성 */
/* Pretendard 로드는 소비 앱이 한다(docs/02-typography.md). 여기서는 클래스만 정의한다. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; word-break: keep-all; overflow-wrap: anywhere; }
body { font-family: var(--${PREFIX}-font-family-sans); font-size: var(--${PREFIX}-font-size-md); line-height: var(--${PREFIX}-font-line-height-relaxed); color: var(--${PREFIX}-color-text-primary); background: var(--${PREFIX}-color-surface-canvas); -webkit-font-smoothing: antialiased; }
code, kbd, pre, samp { font-family: var(--${PREFIX}-font-family-mono); }
:where(code):not(pre code) { font-size: 0.9em; padding: 0.1em 0.35em; border-radius: var(--${PREFIX}-radius-xs); background: var(--${PREFIX}-color-surface-sunken); }
:focus-visible { outline: var(--${PREFIX}-focus-ring-width) solid var(--${PREFIX}-color-interactive-focus-ring); outline-offset: var(--${PREFIX}-focus-ring-offset); }

${typoEntries.map(typoClass).join('\n\n')}

/* 반응형: 작은 휴대폰(~374px)은 display 를 한 단계 내려 한 줄 8~10자가 줄바꿈 없이 들어가게 한다 */
@media (max-width: 374px) {
  .${PREFIX}-display-lg { font-size: var(--${PREFIX}-font-size-4xl); }
  .${PREFIX}-display-md { font-size: var(--${PREFIX}-font-size-3xl); }
  .${PREFIX}-score { font-size: var(--${PREFIX}-font-size-5xl); }
}
/* 태블릿(600px~)에서 display 를 한 단계 올린다. 휴대폰은 기본 값이 이미 모바일 기준 */
@media (min-width: 600px) {
  .${PREFIX}-display-lg { font-size: var(--${PREFIX}-font-size-6xl); }
  .${PREFIX}-display-md { font-size: var(--${PREFIX}-font-size-5xl); }
  .${PREFIX}-display-sm { font-size: var(--${PREFIX}-font-size-4xl); }
}
/* 한글 질문·카드 글자: 단어 단위 줄바꿈, 어색한 한 글자 줄을 줄인다 */
.${PREFIX}-question, .${PREFIX}-heading-1, .${PREFIX}-heading-2, .${PREFIX}-display-lg, .${PREFIX}-display-md, .${PREFIX}-display-sm { text-wrap: balance; }
.${PREFIX}-body-md, .${PREFIX}-body-lg, .${PREFIX}-body-sm { text-wrap: pretty; }
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
writeFileSync(join(DIST, 'tokens.js'), `// merrivoo tokens · 자동 생성\n// 각 leaf: { var: 'var(--mv-…)', value: 라이트 raw 값, dark?: 다크 raw 값 }\n// 스타일에는 .var 를 쓰고(다크 자동), 계산이 필요할 때만 .value 를 쓴다.\nexport const tokens = ${JSON.stringify(jsTree, null, 2)};\nexport default tokens;\n`);
function dts(node, indent = '  ') {
  if ('var' in node && 'value' in node) return `{ var: string; value: ${typeof node.value === 'number' ? 'number' : typeof node.value === 'string' ? 'string' : 'unknown'}; dark?: unknown }`;
  return `{\n${Object.entries(node).map(([k, v]) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${dts(v, indent + '  ')};`).join('\n')}\n${indent.slice(2)}}`;
}
writeFileSync(join(DIST, 'tokens.d.ts'), `// merrivoo tokens · 자동 생성\nexport declare const tokens: ${dts(jsTree)};\nexport default tokens;\n`);

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
writeFileSync(join(DIST, 'tailwind.preset.cjs'), `// merrivoo Tailwind preset · 자동 생성\n// tailwind.config: { presets: [require('merrivoo/dist/tailwind.preset.cjs')] }\n// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드해야 한다. 다크모드는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// 4f. tokens.scss
const scss = `// merrivoo tokens · 자동 생성 — 라이트 raw 값. 다크가 필요하면 CSS 변수(dist/tokens.css)를 쓴다.\n` +
  [...L].filter(([, t]) => cssValue(t) != null).map(([, t]) => `$${PREFIX}-${t.path.join('-')}: ${cssValue(t)};`).join('\n') + '\n';
writeFileSync(join(DIST, 'tokens.scss'), scss);

// 4g. Figma Tokens Studio 포맷(세트 2개)
writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify({ 'mv/light': stripInternal(light), 'mv/dark': stripInternal(read('color.dark.json')), $metadata: { tokenSetOrder: ['mv/light', 'mv/dark'] } }, null, 2) + '\n');

// 4h. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');


// ---------- 5. components.css: components/*.css 를 순서대로 묶고 lint 한다 ----------
import { existsSync } from 'node:fs';
const COMPONENTS = join(ROOT, '..', 'components');
const COMPONENT_ORDER = ['base', 'button', 'form', 'choice', 'question', 'sheet', 'scene', 'ornament', 'result', 'feedback', 'signboard'];
// 렌더러가 인라인 스타일로 넣는 변수. 컴포넌트 CSS 는 읽기만 한다
const RUNTIME_VARS = new Set(['--mv-progress', '--mv-score', '--mv-light', '--mv-phase', '--mv-delay', '--mv-sign-aspect', '--mv-sign-x', '--mv-sign-y', '--mv-sign-w', '--mv-sign-h', '--mv-sign-ink', '--mv-sign-glow', '--mv-sign-fs', '--mv-sign-track']);
const knownVars = new Set([...L.values()].map((t) => varName(t.path)));
for (const wid of worldIds) for (const k of WORLD_ALLOWED) if (read('theme.worlds.json').world[wid]?.[k]) knownVars.add(`--${PREFIX}-color-${k.replace(/\./g, '-')}`);
let cssBundle = `/* merrivoo components · 자동 생성. components/*.css 를 고친 뒤 node tokens/build.mjs. 순서: ${COMPONENT_ORDER.join(' → ')} */\n`;
const lintErrors = [];
for (const name of COMPONENT_ORDER) {
  const file = join(COMPONENTS, `${name}.css`);
  if (!existsSync(file)) { lintErrors.push(`components/${name}.css 없음`); continue; }
  const raw = readFileSync(file, 'utf8');
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const localVars = new Set([...code.matchAll(/(--mv-[\w-]+)\s*:/g)].map((m) => m[1]).concat([...RUNTIME_VARS]));
  const at = (re, msg) => { for (const m of code.matchAll(re)) lintErrors.push(`components/${name}.css: ${msg} → ${m[0].trim()}`); };
  at(/#[0-9a-fA-F]{3,8}\b(?![\w-])/g, 'hex 색 금지(토큰 사용)');
  // media query 안에서는 var() 를 쓸 수 없어 breakpoint 토큰과 같은 값만 허용한다
  const bpValues = new Set([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([, t]) => t.resolved));
  for (const mq of code.matchAll(/@media[^{]*/g)) for (const m of mq[0].matchAll(/(\d+)px/g)) if (!bpValues.has(m[0])) lintErrors.push(`components/${name}.css: media 폭 ${m[0]} 이 breakpoint 토큰과 다르다`);
  const codePx = code.replace(/@media[^{]*/g, '');
  for (const m of codePx.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)px\b/g)) if (!['0', '1'].includes(m[1])) lintErrors.push(`components/${name}.css: 임의 px 금지 → ${m[0]}`);
  for (const m of code.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)\b/g)) if (m[1] !== '0') lintErrors.push(`components/${name}.css: 시간 직접 값 금지(motion 토큰) → ${m[0]}`);
  at(/z-index:\s*-?\d/g, 'z-index 숫자 금지');
  if (name !== 'base') at(/!important/g, '!important 금지');
  at(/transition:\s*all\b/g, 'transition: all 금지');
  for (const m of code.matchAll(/var\((--mv-[\w-]+)/g)) if (!knownVars.has(m[1]) && !localVars.has(m[1])) lintErrors.push(`components/${name}.css: 없는 변수 ${m[1]}`);
  cssBundle += `\n/* ── ${name} ── */\n${raw.trim()}\n`;
}
if (lintErrors.length) { console.error('컴포넌트 CSS lint 실패:\n' + [...new Set(lintErrors)].map((e) => '  - ' + e).join('\n')); process.exit(1); }
writeFileSync(join(DIST, 'components.css'), cssBundle);

// ---------- 6. 컴포넌트 레지스트리 검증 + 기계 판독 설정 ----------
const registryPath = join(ROOT, '..', 'registry', 'components.json');
const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, 'utf8')) : { components: [] };
const regErrors = [];
for (const c of registry.components) {
  for (const cls of [c.class, ...(c.parts ?? []), ...(c.variants ? Object.values(c.variants).flat() : [])]) {
    if (cls && !cssBundle.includes(`.${cls.replace(/^\./, '')}`)) regErrors.push(`레지스트리 ${c.name}: components.css 에 .${cls} 없음`);
  }
  for (const t of c.tokens ?? []) if (!L.has(t)) regErrors.push(`레지스트리 ${c.name}: 없는 토큰 ${t}`);
}
if (regErrors.length) { console.error('레지스트리 검증 실패:\n' + regErrors.map((e) => '  - ' + e).join('\n')); process.exit(1); }
const pkg = JSON.parse(readFileSync(join(ROOT, '..', 'package.json'), 'utf8'));
const semantic = (grp) => [...L.keys()].filter((k) => k.startsWith(`color.${grp}.`)).map((k) => k.slice(6));
const sceneCfg = (() => { try { return JSON.parse(readFileSync(join(ROOT, '..', 'registry', 'scene.json'), 'utf8')); } catch { return {}; } })();
const config = {
  $schema: 'https://github.com/winterholic/winterholic-design-system/merrivoo/schema/design-system.config.schema.json',
  name: pkg.name, version: pkg.version, prefix: PREFIX, kind: 'mobile-first scene design system',
  read_first: ['CLAUDE.md', 'docs/00-decision-guide.md'],
  themes: { modes: ['light', 'dark'], attribute: 'data-theme', worlds: worldIds, worldAttribute: 'data-world', worldTokens: [...WORLD_ALLOWED] },
  tokens: {
    source: 'tokens/src/*.json', build: 'node tokens/build.mjs', css: 'dist/tokens.css', js: 'dist/tokens.js', total: L.size,
    semantic: { surface: semantic('surface'), text: semantic('text'), border: semantic('border'), action: semantic('action'), status: semantic('status'), interactive: semantic('interactive'), scene: semantic('scene') },
    contrastChecks: contrastReport.length,
  },
  layout: { breakpoints: Object.fromEntries([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([k, t]) => [t.path.at(-1), t.resolved])), phoneBands: ['320-374', '375-430', '431-599'], tablet: '600-1024', verifiedViewports: ['360x800', '390x844', '430x932', '768x1024', '820x1180'], touchTargetMin: L.get('size.touch-target-min').resolved, sceneAspect: '9:16', fit: { phone: 'cover (viewport aspect <= 0.62)', wide: 'stage (centered 9:16 + blurred side fill)' } },
  scene: { size: { w: 1080, h: 1920 }, coordinates: 'normalized 0..1 of scene; trees use tree-normalized (u,v)', layers: ['background', 'environment', 'atmosphere', 'shadow', 'tree', 'lighting', 'ornaments', 'foreground', 'grade', 'fx-top'], zIndexTokens: 'z-index.scene-*', ...sceneCfg },
  engine: { module: 'engine/index.mjs', renderers: ['react (react/index.js)', 'dom (engine/dom.mjs)', 'canvas (engine/canvas.mjs, poster export)'], schemas: ['schema/world.schema.json', 'schema/tree.schema.json', 'schema/ornament.schema.json', 'schema/catalog.schema.json'], tools: 'tools/process_assets.py' },
  components: registry.components,
  rules: registry.rules ?? [],
};
writeFileSync(join(DIST, 'design-system.config.json'), JSON.stringify(config, null, 2) + '\n');

console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · components ${COMPONENT_ORDER.length} files lint ok · registry ${registry.components.length} · dist/ ${readdirSync(DIST).length} files`);
