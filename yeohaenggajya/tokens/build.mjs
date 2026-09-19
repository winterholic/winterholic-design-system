// 토큰 빌드(여행가쟈) — src/*.json(DTCG) 을 합쳐 tokens.json 과 dist/* 를 만든다.
// 다크 '테마'는 없다. color.dark.json 은 가챠 연출 무대(tone=dark)이며 [data-tone="dark"] 스코프로만 나간다(prefers-color-scheme 무시).
// legacy-aliases.css 가 원본 tokens.css 변수명(--hanji, --dc-red, --sp-4 …)을 --yg-* 에 잇는다.
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

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, '..', 'dist');
const PREFIX = 'yg';

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
    // 읽어야 하는 글자: 한지·한지-bright 위 4.5. decorative(ink-4)는 글자가 아니므로 검사하지 않는다(15 부채 참조)
    ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'danger']
      .flatMap((t) => ['canvas', 'default'].map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
    ['color.text.brand', 'color.surface.default', 4.5],
    ['color.text.brand', 'color.surface.canvas', 3],
    ['color.action.primary.text', 'color.action.primary.bg', 4.5],
    ['color.action.secondary.text', 'color.action.secondary.bg', 4.5],
    ['color.action.ghost.text', 'color.surface.canvas', 4.5],
    ['color.action.danger.text', 'color.action.danger.bg', 4.5],
    ['color.text.inverse', 'color.surface.inverse', 4.5],
    ['color.text.on-brand', 'color.surface.brand', 4.5],
    ...['success', 'warning', 'danger', 'info', 'neutral'].flatMap((st) => [
      [`color.status.${st}.text`, `color.status.${st}.bg`, 4.5],
      [`color.status.${st}.on-solid`, `color.status.${st}.solid`, 3],
      [`color.status.${st}.icon`, `color.status.${st}.bg`, 2.7],
    ]),
    ...['red', 'blue', 'jade', 'plum'].map((c) => [`color.chip.${c}`, 'color.surface.default', 3]),
    ...['rare', 'epic', 'unique', 'common', 'moment'].map((r) => [`color.rarity.${r}.text`, 'color.surface.default', 3]),
    ['color.interactive.focus-ring', 'color.surface.default', 3],
    ['color.interactive.nav-active', 'color.surface.default', 3],
    ['color.tabs-check', 'color.surface.default', 3],
  ].filter(([fg]) => fg !== 'color.tabs-check');
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
    case 'gradient': { const n = t.path.at(-1); const stops = v.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(', '); if (n === 'holo-rainbow') return `conic-gradient(from 0deg, ${stops})`; if (n === 'stage-vignette') return `radial-gradient(circle at 50% 40%, ${stops})`; const ang = n === 'holo-sheen' ? 'sheen' : 'default'; return `linear-gradient(var(--${PREFIX}-gradient-angle-${ang}), ${stops})`; }
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
const gradientAngleLine = `  --${PREFIX}-gradient-angle-default: 90deg;\n  --${PREFIX}-gradient-angle-sheen: 120deg;\n  --${PREFIX}-gradient-angle-vertical: 180deg;`;

const css = `/* winterholic-base design tokens · 자동 생성 — 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
:root {
  color-scheme: light;
${gradientAngleLine}
${cssVarLines(L, (k) => !k.startsWith('shadow-dark.') && !k.startsWith('gradient-angle.')).join('\n')}
}

/* 어두운 무대(가챠 연출·AppShell tone=dark). 시스템 다크 설정을 따르지 않는다 — 한지가 정체성 */
[data-tone="dark"] {
${darkLines.join('\n')}
}

/* 모션 축소 환경 */
@media (prefers-reduced-motion: reduce) {
  :root {
    /* 원본 effects.css 전역 가드: 모든 animation/transition 1ms. 여기서는 토큰만 맞춘다 */
    --${PREFIX}-motion-duration-fast: 1ms;
    --${PREFIX}-motion-duration-normal: 1ms;
    --${PREFIX}-motion-duration-flip: 1ms;
    --${PREFIX}-motion-duration-arrive: 1ms;
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
  const extra = name.startsWith('mono') ? '\n  font-variant-numeric: tabular-nums;' : name === 'rank' || name === 'rank-lg' ? '\n  text-transform: uppercase;' : name === 'brush' ? '\n  display: inline-block;\n  transform: rotate(calc(var(--yg-motion-rotate-brush) * 1deg));' : '';
  return `.${PREFIX}-${name} {\n  font-family: ${fam};\n  font-size: ${v.fontSize};\n  font-weight: ${v.fontWeight};\n  line-height: ${v.lineHeight};\n  letter-spacing: ${v.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* 여행가쟈 typography · 자동 생성 */
/* 서체 7종 로드는 소비 앱(next/font 또는 Google Fonts)이 한다(docs/02). 여기서는 역할 클래스만. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; }
:where(h1, h2, h3, h4, h5, h6, p, li, dt, dd, figcaption, label, button, a, summary, strong, em, b, i, small, span, td, th) { word-break: keep-all; overflow-wrap: break-word; }
body { font-family: var(--${PREFIX}-font-family-ui); font-size: var(--${PREFIX}-font-size-md); line-height: var(--${PREFIX}-font-line-height-relaxed); color: var(--${PREFIX}-color-text-primary); background: var(--${PREFIX}-color-surface-canvas); background-image: radial-gradient(circle at 25% 30%, var(--${PREFIX}-texture-dot-color) 0.5px, transparent 1px), radial-gradient(circle at 75% 70%, var(--${PREFIX}-texture-dot-color-2) 0.5px, transparent 1px); background-size: var(--${PREFIX}-texture-dot-size) var(--${PREFIX}-texture-dot-size), var(--${PREFIX}-texture-dot-size-2) var(--${PREFIX}-texture-dot-size-2); -webkit-font-smoothing: antialiased; }
/* 오방색 띠 · 한지 스크롤바 유틸 */
.${PREFIX}-band { height: var(--${PREFIX}-size-layout-band); background: var(--${PREFIX}-gradient-band); }
.${PREFIX}-hanji-scroll { scrollbar-color: var(--${PREFIX}-hanji-deep) transparent; scrollbar-width: thin; }
.${PREFIX}-hanji-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
.${PREFIX}-hanji-scroll::-webkit-scrollbar-thumb { background-clip: padding-box; background-color: color-mix(in srgb, var(--${PREFIX}-hanji-deep) 80%, transparent); border: 3px solid transparent; border-radius: 999px; }
.${PREFIX}-hanji-scroll::-webkit-scrollbar-button { display: none; }
code, kbd, pre, samp { font-family: var(--${PREFIX}-font-family-mono); }
:focus-visible { outline: var(--${PREFIX}-focus-ring-width) solid var(--${PREFIX}-color-interactive-focus-ring); outline-offset: var(--${PREFIX}-focus-ring-offset); }

${typoEntries.map(typoClass).join('\n\n')}

/* 모바일 375 기준 시스템이라 축소 규칙 없음. 데스크톱은 폰 프레임 셸 안에서 같은 크기 */
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
// 원본 @theme inline 매핑 유지
Object.assign(twColors, { background: `var(${varName(['color', 'surface', 'canvas'])})`, foreground: `var(${varName(['color', 'text', 'primary'])})` });
const preset = {
  theme: {
    extend: {
      colors: twColors,
      spacing: Object.fromEntries(Object.entries(twScale('space')).map(([k, v]) => [k.replace('-', '.'), v])),
      borderRadius: twScale('radius'),
      boxShadow: twScale('shadow'),
      fontFamily: Object.fromEntries([...L].filter(([k]) => k.startsWith('font.family.')).map(([k, t]) => [t.path.at(-1), `var(${varName(t.path)})`]).concat([['sans', `var(${varName(['font', 'family', 'ui'])})`]])),
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

// 4h. legacy-aliases.css — 원본 src/styles/tokens.css 변수명 전부
const A = (old, path) => `  ${old}: var(${varName(path.split('.'))});`;
const legacy = [
  A('--hanji-bright', 'hanji.bright'), A('--hanji', 'hanji.base'), A('--hanji-2', 'hanji.2'), A('--hanji-dark', 'hanji.dark'), A('--hanji-deep', 'hanji.deep'),
  A('--dc-red', 'dancheong.red'), A('--dc-red-deep', 'dancheong.red-deep'), A('--dc-blue', 'dancheong.blue'), A('--dc-blue-deep', 'dancheong.blue-deep'),
  A('--dc-yellow', 'dancheong.yellow'), A('--dc-yellow-deep', 'dancheong.yellow-deep'), A('--dc-white', 'dancheong.white'), A('--dc-black', 'dancheong.black'),
  A('--jade', 'korean.jade'), A('--persimmon', 'korean.persimmon'), A('--indigo', 'korean.indigo'), A('--plum', 'korean.plum'), A('--gold', 'korean.gold'), A('--gold-bright', 'korean.gold-bright'), A('--twilight', 'korean.twilight'),
  A('--holo-red', 'holo.red'), A('--holo-blue', 'holo.blue'), A('--holo-yellow', 'holo.yellow'), A('--holo-jade', 'holo.jade'), A('--holo-plum', 'holo.plum'),
  A('--ink', 'ink.1'), A('--ink-2', 'ink.2'), A('--ink-3', 'ink.3'), A('--ink-4', 'ink.4'),
  A('--r-common', 'color.rarity.common.accent'), A('--r-rare', 'color.rarity.rare.accent'), A('--r-epic', 'color.rarity.epic.accent'), A('--r-legend', 'color.rarity.legend.accent'), A('--r-unique', 'color.rarity.unique.accent'), A('--r-moment', 'color.rarity.moment.accent'),
  A('--f-myeongjo', 'font.family.myeongjo'), A('--f-batang', 'font.family.batang'), A('--f-brush', 'font.family.brush'), A('--f-rank', 'font.family.rank'), A('--f-hand', 'font.family.hand'), A('--f-ui', 'font.family.ui'), A('--f-mono', 'font.family.mono'),
  ...[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => A(`--sp-${n}`, `space.${n}`)),
  A('--w-panel', 'size.container.panel'), A('--w-doc', 'size.container.doc'), A('--w-wide', 'size.container.wide'), A('--w-content', 'size.container.content'),
  A('--r-xs', 'radius.xs'), A('--r-sm', 'radius.sm'), A('--r-md', 'radius.md'), A('--r-lg', 'radius.lg'), A('--r-frame', 'radius.frame'),
  A('--sh-stamp', 'shadow.stamp'), A('--sh-paper', 'shadow.paper'), A('--sh-paper-lg', 'shadow.paper-lg'), A('--sh-foil', 'shadow.foil'), A('--sh-holo', 'shadow.holo'), A('--sh-deep', 'shadow.deep'),
  A('--ease-out', 'motion.easing.out'), A('--dur-fast', 'motion.duration.fast'), A('--dur-norm', 'motion.duration.normal'), A('--dur-flip', 'motion.duration.flip'),
];
writeFileSync(join(DIST, 'legacy-aliases.css'), `/* 여행가쟈 legacy aliases · 자동 생성
   원본 frontend/src/styles/tokens.css 의 모든 변수명을 --yg-* 에 잇는다. 값은 동일하므로 이 파일을 tokens.css 대신 로드해도 화면이 바뀌지 않는다.
   원본 프로젝트는 디자인 변경 예정이 없으므로(2026-09-19) 이 별칭은 "이 저장소가 원본과 같은 값을 갖고 있다"는 증명이자, 다른 프로젝트가 여행가쟈 톤을 빌릴 때의 다리다. */
:root {
${legacy.join('\n')}
}
`);

// 4i. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');

console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · dist/ 9 files`);
