// 토큰 빌드(AIP) — tokens/src/*.json(DTCG) 과 components/*.css 를 합쳐 tokens.json 과 dist/* 를 만든다.
// winterholic-base·notting 빌드와 같은 골격이다. AIP 에서 더한 것:
//   · 다크 덮어쓰기를 이름 규칙이 아니라 '라이트와 값이 다른가' 로 판정한다(컴포넌트 색 토큰 이름이 rule·marker 여도 놓치지 않게).
//   · components/*.css 를 dist/components.css 로 묶기 전에 lint 한다 — hex·rgb()·px·ms·z-index 숫자·transition: all 이 있으면 실패.
//   · prose.css 가 GFM alert(> [!NOTE])·Prism·highlight.js·Shiki(css-variables 테마) 를 AIP 토큰에 연결한다.
//   · dist/diagram.mermaid.json — Mermaid themeVariables + 개념별 classDef(라이트·다크). AI 가 다이어그램을 그릴 때 class 이름만 쓰면 된다.
// 사용: node tokens/build.mjs   (aip 디렉터리 기준 어디서 실행해도 된다) · 의존성 없음 · Node 18+

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const SYSTEM = join(ROOT, '..');
const DIST = join(SYSTEM, 'dist');
const COMPONENTS = join(SYSTEM, 'components');
const PREFIX = 'aip';
const P = PREFIX;

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

// 대비 검사. 글자 4.5:1, 아이콘·경계·마커·다이어그램 선 3:1. 새 조합(글자 on 면)을 화면에 만들면 여기에 넣는다.
const hex6 = (v) => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : null);
const STATUS = ['info', 'success', 'warning', 'danger', 'neutral'];
const LIFECYCLE = ['stable', 'beta', 'experimental', 'deprecated'];
const ROLES = ['intent', 'runtime', 'execution', 'permission', 'frontend', 'backend', 'data', 'external', 'note'];
const SYNTAX = ['text', 'comment', 'keyword', 'string', 'function', 'number', 'type', 'punctuation'];
const PAIRS = [
  // 본문 글자 — 문서가 놓이는 모든 면
  ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'link-hover', 'brand', 'success', 'warning', 'danger', 'info']
    .flatMap((t) => ['canvas', 'default', 'subtle', 'raised'].map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
  ...['primary', 'secondary'].map((t) => [`color.text.${t}`, 'color.surface.sunken', 4.5]),
  ['color.text.primary', 'color.surface.brand-subtle', 4.5],
  ['color.text.brand', 'color.surface.brand-subtle', 4.5],
  ['color.text.inverse', 'color.surface.inverse', 4.5],
  ['color.text.on-brand', 'color.surface.brand', 4.5],
  // 버튼 — 모든 상태에서 글자가 유지되는가
  ...['bg', 'bg-hover', 'bg-active'].flatMap((b) => [
    ['color.action.primary.text', `color.action.primary.${b}`, 4.5],
    ['color.action.secondary.text', `color.action.secondary.${b}`, 4.5],
    ['color.action.ghost.text', `color.action.ghost.${b === 'bg' ? 'bg-hover' : b}`, 4.5],
    ['color.action.danger.text', `color.action.danger.${b}`, 4.5],
  ]),
  ['color.action.primary.bg', 'color.surface.canvas', 3],
  // 상태 — 콜아웃 안 본문·링크·아이콘, 배지
  ...STATUS.flatMap((s) => [
    [`color.status.${s}.text`, `color.status.${s}.bg`, 4.5],
    ['color.text.primary', `color.status.${s}.bg`, 4.5],
    ['color.text.link', `color.status.${s}.bg`, 4.5],
    [`color.status.${s}.icon`, `color.status.${s}.bg`, 3],
    [`color.status.${s}.on-solid`, `color.status.${s}.solid`, 4.5],
  ]),
  // 형광펜
  ['color.highlight.mark-text', 'color.highlight.mark', 4.5],
  ['color.highlight.text', 'color.highlight.bg', 4.5],
  ['color.highlight.icon', 'color.highlight.bg', 3],
  ['color.text.primary', 'color.highlight.bg', 4.5],
  ['color.text.link', 'color.highlight.bg', 4.5],
  // 코드 — 구문 강조 전부 코드 면 위 4.5
  ...SYNTAX.map((c) => [`color.code.${c}`, 'color.code.bg', 4.5]),
  ['color.code.text', 'color.code.bg-header', 4.5],
  ['color.code.text-muted', 'color.code.bg-header', 4.5],
  ['color.code.line-number', 'color.code.bg', 3],
  ['color.code.added-sign', 'color.code.bg', 4.5],
  ['color.code.removed-sign', 'color.code.bg', 4.5],
  ['color.code.text-inline', 'color.code.bg-inline', 4.5],
  // 수명 주기 배지
  ...LIFECYCLE.map((l) => [`color.lifecycle.${l}.text`, `color.lifecycle.${l}.bg`, 4.5]),
  // 다이어그램 — 노드 글자는 자기 면 위 4.5, 노드 테두리·선은 캔버스 위 3
  ...ROLES.map((r) => [`color.diagram.${r}.text`, `color.diagram.${r}.fill`, 4.5]),
  ...ROLES.filter((r) => r !== 'note').map((r) => [`color.diagram.${r}.stroke`, 'color.diagram.canvas', 3]),
  ...['default', 'muted', 'emphasis', 'allow', 'reject'].map((e) => [`color.diagram.edge.${e}`, 'color.diagram.canvas', 3]),
  ['color.diagram.edge.label', 'color.diagram.canvas', 4.5],
  // 상호작용·경계
  ['color.interactive.focus-ring', 'color.surface.canvas', 3],
  ['color.interactive.focus-ring', 'color.surface.subtle', 3],
  ['color.interactive.focus-ring', 'color.surface.raised', 3],
  ['color.interactive.selected-text', 'color.interactive.selected-bg', 4.5],
  ['color.border.strong', 'color.surface.default', 3],
  ['color.border.strong', 'color.surface.subtle', 3],
  ['color.border.brand', 'color.surface.default', 3],
  ['color.border.danger', 'color.surface.default', 3],
  ['color.text.primary', 'color.interactive.selection', 4.5],
  // 컴포넌트 고유 조합
  ['component.sidebar.item-active-text', 'component.sidebar.item-active-bg', 4.5],
  ['component.toc.text', 'color.surface.canvas', 4.5],
  ['component.toc.text-active', 'color.surface.canvas', 4.5],
  ['component.kbd.text', 'component.kbd.bg', 4.5],
  ['component.tooltip.text', 'component.tooltip.bg', 4.5],
  ['component.choice.switch-track', 'color.surface.default', 3],
  ['component.choice.bg-checked', 'color.surface.default', 3],
  ['component.example.label-text', 'component.example.label-bg', 4.5],
  ['component.option-card.border-selected', 'component.option-card.bg-selected', 3],
  ['color.text.secondary', 'component.option-card.bg-selected', 4.5],
  ['component.param.type', 'color.surface.canvas', 4.5],
  ['color.chart.axis', 'color.surface.canvas', 3],
];
function checkContrast(map, mode) {
  const get = (k) => hex6(map.get(k)?.resolved);
  const report = [];
  for (const [fg, bg, min] of PAIRS) {
    if (!map.has(fg)) { errors.push(`[${mode}] 대비 검사 대상 없음: ${fg}`); continue; }
    if (!map.has(bg)) { errors.push(`[${mode}] 대비 검사 대상 없음: ${bg}`); continue; }
    const f = get(fg), b = get(bg);
    if (!f || !b) continue; // 투명·알파 값(오버레이)은 합성 결과가 배경에 달려 있어 검사하지 않는다
    const c = contrast(f, b);
    report.push({ mode, fg, bg, ratio: +c.toFixed(2), min, pass: c >= min });
    if (c < min) errors.push(`[${mode}] 대비 미달 ${fg}(${f}) on ${bg}(${b}) = ${c.toFixed(2)} < ${min}`);
  }
  return report;
}
const contrastReport = [...checkContrast(L, 'light'), ...checkContrast(D, 'dark')];

// 컴포넌트 CSS lint — 값은 전부 var(--aip-…) 로만. 미디어 쿼리 폭만 예외(CSS 변수를 못 쓴다)이고 breakpoint 토큰 값과 같아야 한다.
const BREAKPOINTS = new Set([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([, t]) => t.resolved));
const COMPONENT_ORDER = ['base', 'layout', 'button', 'form', 'navigation', 'overlay', 'content', 'docs', 'code', 'diagram', 'app', 'utilities'];
const componentFiles = readdirSync(COMPONENTS).filter((f) => f.endsWith('.css'));
for (const f of componentFiles) if (!COMPONENT_ORDER.includes(f.replace('.css', ''))) errors.push(`components/${f} 가 COMPONENT_ORDER 에 없음`);
const componentSources = COMPONENT_ORDER.filter((n) => componentFiles.includes(`${n}.css`)).map((n) => ({ name: n, css: readFileSync(join(COMPONENTS, `${n}.css`), 'utf8') }));
const LINT = [
  [/#[0-9a-fA-F]{3,8}\b/, 'hex 색'],
  [/\brgba?\(|\bhsla?\(/, 'rgb()/hsl()'],
  [/(?<![\w-])-?\d*\.?\d+px\b/, 'px 직접값'],
  [/(?<![\w-])\d+m?s\b(?!\w)/, '시간 직접값'],
  [/z-index:\s*-?\d/, 'z-index 숫자'],
  [/transition:\s*all\b/, 'transition: all'],
  [/\bease-in-out\b|\bease-in\b|\bease-out\b/, 'easing 키워드'],
  [/!important/, '!important'],
];
// 토큰이 아닌데 컴포넌트가 읽어도 되는 외부 계약 변수(없으면 비워 둔다).
const EXTRA_VARS = new Set();
const knownVars = new Set([...L.keys()].map((k) => `--${P}-${k.replaceAll('.', '-')}`));
for (const { name, css } of componentSources) {
  const lines = css.split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\//g, '').replace(/url\("data:[^"]*"\)/g, 'url()');
    const media = code.match(/@media[^{]*/);
    if (media) {
      for (const px of media[0].match(/\d+px/g) ?? []) {
        const bp = Number(px.replace('px', '')) + (/max-width/.test(media[0]) ? 1 : 0);
        if (!BREAKPOINTS.has(`${bp}px`)) errors.push(`components/${name}.css:${i + 1} 미디어 쿼리 ${px} 가 breakpoint 토큰이 아님`);
      }
    }
    // 미디어 쿼리 조건만 빼고, 같은 줄에 붙은 규칙 본문까지 검사한다
    const body = media ? code.slice(media.index + media[0].length) : code;
    for (const [re, label] of LINT) if (re.test(body)) errors.push(`components/${name}.css:${i + 1} ${label}: ${line.trim()}`);
    if (/(?<![\w-])(?:red|blue|green|white|black|gray|grey|orange|yellow|purple)\b(?![\w-])/.test(body.replace(/--[\w-]+|"[^"]*"/g, ''))) errors.push(`components/${name}.css:${i + 1} 색 이름 직접값: ${line.trim()}`);
    for (const v of code.match(new RegExp(`--${P}-[a-z0-9-]+`, 'g')) ?? []) {
      // 컴포넌트 안에서 정의하는 지역 변수(--aip-_x)는 밑줄로 시작한다. 그 밖의 --aip-* 는 토큰이어야 한다.
      if (v.startsWith(`--${P}-_`)) continue;
      if (!knownVars.has(v) && !EXTRA_VARS.has(v)) errors.push(`components/${name}.css:${i + 1} 없는 토큰 변수 ${v}`);
    }
  });
}

if (errors.length) {
  console.error('토큰 빌드 실패:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---------- 4. 직렬화 ----------
function varName(path) { return `--${P}-${path.join('-')}`; }
const v = (path) => `var(--${P}-${path.replaceAll('.', '-')})`;
const cssValue = (t) => {
  const val = t.resolved;
  switch (t.$type) {
    case 'fontFamily': return Array.isArray(val) ? val.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : val;
    case 'shadow': return (Array.isArray(val) ? val : [val]).map((s) => `${s.inset ? 'inset ' : ''}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ');
    case 'cubicBezier': return `cubic-bezier(${val.join(', ')})`;
    case 'typography': return null; // 복합 — typography.css 클래스로
    default: return String(val);
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
const strip = (obj) => JSON.parse(JSON.stringify(obj));
writeFileSync(join(ROOT, 'tokens.json'), JSON.stringify(strip(light), null, 2) + '\n');
writeFileSync(join(ROOT, 'tokens.dark.json'), JSON.stringify(strip(read('color.dark.json')), null, 2) + '\n');

// 4b. tokens.css — 다크는 '라이트와 값이 다른 색·컴포넌트 토큰' + shadow 교체
const differs = (k) => JSON.stringify(L.get(k)?.resolved) !== JSON.stringify(D.get(k)?.resolved);
const darkShadowLines = [...L.keys()].filter((k) => k.startsWith('shadow.')).map((k) => {
  const dk = k.replace('shadow.', 'shadow-dark.');
  return D.has(dk) ? `  ${varName(L.get(k).path)}: ${cssValue(D.get(dk))};` : null;
}).filter(Boolean);
const darkLines = [...cssVarLines(D, (k) => (k.startsWith('color.') || k.startsWith('component.')) && differs(k)), ...darkShadowLines];
const bp = (name) => L.get(`breakpoint.${name}`).resolved;
const bpMax = (name) => `${parseInt(bp(name), 10) - 1}px`;

const tokensCss = `/* AIP design tokens · 자동 생성 — 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
:root {
  color-scheme: light;
${cssVarLines(L, (k) => !k.startsWith('shadow-dark.')).join('\n')}
}

/* 다크: 시스템 설정을 따르되 data-theme="light" 로 강제 라이트 가능 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${darkLines.map((l) => '  ' + l).join('\n')}
  }
}
/* 다크: data-theme="dark" 로 강제 */
:root[data-theme="dark"] {
  color-scheme: dark;
${darkLines.join('\n')}
}

/* 모션 축소: 움직임의 길이만 0 으로. 확인 상태 유지 시간(feedback·toast·tooltip-delay)은 그대로 둔다 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --${P}-motion-duration-fast: 0ms;
    --${P}-motion-duration-normal: 0ms;
    --${P}-motion-duration-slow: 0ms;
  }
}
`;
writeFileSync(join(DIST, 'tokens.css'), tokensCss);

// 4c. typography.css — 역할 클래스 + 전역 기본값
const typoEntries = [...L].filter(([k, t]) => t.$type === 'typography' && k.startsWith('typography.'));
const typoClass = ([k, t]) => {
  const val = t.resolved;
  const name = k.split('.').pop();
  const fam = Array.isArray(val.fontFamily) ? val.fontFamily.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : val.fontFamily;
  const extra = name === 'numeric' ? '\n  font-variant-numeric: tabular-nums;'
    : name === 'eyebrow' ? '\n  text-transform: uppercase;'
    : ['code', 'code-sm', 'mono-label', 'kbd'].includes(name) ? '\n  font-variant-ligatures: none;' : '';
  return `.${P}-${name} {\n  font-family: ${fam};\n  font-size: ${val.fontSize};\n  font-weight: ${val.fontWeight};\n  line-height: ${val.lineHeight};\n  letter-spacing: ${val.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* AIP typography · 자동 생성 */
/* Pretendard·JetBrains Mono 로드는 소비 앱이 한다(docs/02). 여기는 전역 기본값 + 역할 클래스. 문서 본문은 dist/prose.css. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; }
body { margin: 0; font-family: ${v('font.family.sans')}; font-size: ${v('font.size.md')}; line-height: ${v('font.line-height.relaxed')}; color: ${v('color.text.primary')}; background: ${v('color.surface.canvas')}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
:lang(ko) { word-break: keep-all; overflow-wrap: anywhere; }
code, kbd, pre, samp { font-family: ${v('font.family.mono')}; font-variant-ligatures: none; }
::selection { background: ${v('color.interactive.selection')}; }
:focus-visible { outline: ${v('focus.ring-width')} solid ${v('color.interactive.focus-ring')}; outline-offset: ${v('focus.ring-offset')}; }
:where(a) { color: ${v('color.text.link')}; }
kbd, .${P}-kbd { display: inline-flex; align-items: center; justify-content: center; min-width: ${v('component.kbd.height')}; height: ${v('component.kbd.height')}; padding-inline: ${v('component.kbd.padding-x')}; border-radius: ${v('component.kbd.radius')}; background: ${v('component.kbd.bg')}; border: ${v('border-width.hairline')} solid ${v('component.kbd.border')}; box-shadow: inset 0 calc(-1 * ${v('border-width.hairline')}) 0 ${v('component.kbd.border')}; color: ${v('component.kbd.text')}; font-family: ${v('font.family.mono')}; font-size: ${v('font.size.xs')}; font-weight: ${v('font.weight.medium')}; line-height: 1; box-sizing: border-box; vertical-align: middle; }

${typoEntries.map(typoClass).join('\n\n')}

/* 반응형: 큰 제목은 모바일에서 한두 단계 내린다 */
@media (max-width: ${bpMax('md')}) {
  .${P}-display-xl { font-size: ${v('font.size.4xl')}; }
  .${P}-display-lg { font-size: ${v('font.size.3xl')}; }
  .${P}-display-md { font-size: ${v('font.size.2xl')}; }
  .${P}-lead { font-size: ${v('font.size.lg')}; }
  .${P}-doc-title { font-size: ${v('font.size.3xl')}; }
  .${P}-heading-1 { font-size: ${v('font.size.2xl')}; }
}
`;
writeFileSync(join(DIST, 'typography.css'), typographyCss);

// 4d. prose.css — .aip-doc 안의 문서 본문(Markdown 렌더 결과를 그대로 받는다)
const CALLOUT_KINDS = { note: 'status.info', tip: 'status.success', important: 'highlight', warning: 'status.warning', caution: 'status.danger' };
const calloutVars = (kind) => {
  const g = CALLOUT_KINDS[kind];
  const icon = g === 'highlight' ? 'color.highlight.icon' : `color.${g}.icon`;
  const title = g === 'highlight' ? 'color.highlight.text' : `color.${g}.text`;
  const border = g === 'highlight' ? 'color.highlight.border' : `color.${g}.border`;
  return `--${P}-_callout-bg: ${v(`color.${g}.bg`)}; --${P}-_callout-bar: ${v(border)}; --${P}-_callout-icon: ${v(icon)}; --${P}-_callout-title: ${v(title)};`;
};
// 구문 강조 매핑. prose.css(.aip-doc pre)와 components.css(.aip-code)가 같은 규칙을 다른 범위로 받는다
const syntaxCss = (scope) => `/* 구문 강조 — 외부 테마 CSS 없이 이 매핑만 쓴다. Prism(.token)·highlight.js(.hljs-)·Shiki(css-variables 테마) */
${scope} {
  --shiki-foreground: ${v('color.code.text')}; --shiki-background: ${v('color.code.bg')};
  --shiki-token-keyword: ${v('color.code.keyword')}; --shiki-token-string: ${v('color.code.string')}; --shiki-token-string-expression: ${v('color.code.string')};
  --shiki-token-function: ${v('color.code.function')}; --shiki-token-constant: ${v('color.code.number')}; --shiki-token-comment: ${v('color.code.comment')};
  --shiki-token-parameter: ${v('color.code.text')}; --shiki-token-punctuation: ${v('color.code.punctuation')}; --shiki-token-link: ${v('color.code.keyword')};
}
${scope} :is(.token.comment, .token.prolog, .hljs-comment) { color: ${v('color.code.comment')}; font-style: italic; }
${scope} :is(.token.keyword, .token.atrule, .token.important, .hljs-keyword, .hljs-built_in, .hljs-literal) { color: ${v('color.code.keyword')}; }
${scope} :is(.token.string, .token.char, .token.attr-value, .token.template-string, .hljs-string, .hljs-attr) { color: ${v('color.code.string')}; }
${scope} :is(.token.function, .hljs-title) { color: ${v('color.code.function')}; }
${scope} :is(.token.number, .token.boolean, .token.constant, .hljs-number) { color: ${v('color.code.number')}; }
${scope} :is(.token.class-name, .token.builtin, .hljs-type, .hljs-title.class_) { color: ${v('color.code.type')}; }
${scope} :is(.token.punctuation, .token.operator, .hljs-punctuation, .hljs-operator) { color: ${v('color.code.punctuation')}; }
`;
const proseCss = `/* AIP prose · 자동 생성 — .${P}-doc 안의 문서 본문. Markdown 렌더 결과(h2·p·ul·pre·table·GFM alert)를 클래스 없이 받는다. 값은 전부 토큰(docs/07). */
.${P}-doc { max-width: ${v('size.container.prose')}; color: ${v('color.text.primary')}; font-family: ${v('font.family.sans')}; font-size: ${v('font.size.md')}; line-height: ${v('font.line-height.prose')}; overflow-wrap: break-word; }
.${P}-doc > * { margin-block: 0; }
.${P}-doc > * + * { margin-top: ${v('component.doc.block-gap')}; }
.${P}-doc > :is(pre, figure, table, details, blockquote, .${P}-code, .${P}-code-tabs, .${P}-callout, .markdown-alert, .${P}-spec, .${P}-example, .${P}-params, .${P}-diagram, .${P}-table-wrap, .${P}-signature) { margin-block: ${v('component.doc.figure-gap')}; }
.${P}-doc > :first-child { margin-top: 0; }
.${P}-doc > :last-child { margin-bottom: 0; }

/* 제목. h2 는 위에 hairline 을 둔다 — 명세서의 절 구분처럼 */
.${P}-doc :is(h1, h2, h3, h4) { color: ${v('color.text.primary')}; scroll-margin-top: ${v('size.layout.anchor-offset')}; text-wrap: balance; }
.${P}-doc h1 { font-size: ${v('font.size.4xl')}; font-weight: ${v('font.weight.bold')}; line-height: ${v('font.line-height.snug')}; letter-spacing: ${v('font.letter-spacing.tight')}; }
.${P}-doc h2 { font-size: ${v('font.size.2xl')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.heading')}; letter-spacing: ${v('font.letter-spacing.snug')}; margin-top: ${v('component.doc.h2-gap')}; padding-top: ${v('space.6')}; border-top: ${v('border-width.hairline')} solid ${v('color.border.default')}; }
.${P}-doc h3 { font-size: ${v('font.size.xl')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.heading')}; letter-spacing: ${v('font.letter-spacing.snug')}; margin-top: ${v('component.doc.h3-gap')}; }
.${P}-doc h4 { font-size: ${v('font.size.md')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.normal')}; margin-top: ${v('component.doc.h4-gap')}; }
.${P}-doc > :is(h2, h3, h4) + * { margin-top: ${v('component.doc.heading-after')}; }
.${P}-doc > h2:first-child { border-top: 0; padding-top: 0; }
.${P}-doc :is(h2, h3, h4) code { font-size: 0.9em; }
.${P}-doc :is(h2, h3)[data-section]::before { content: attr(data-section); margin-right: ${v('space.3')}; font-family: ${v('font.family.mono')}; font-size: 0.75em; font-weight: ${v('font.weight.medium')}; color: ${v('color.text.tertiary')}; letter-spacing: ${v('font.letter-spacing.normal')}; }
/* 앵커 링크: 제목 끝의 #. hover·포커스에 보이고, 터치 기기에서는 항상 보인다 */
.${P}-doc .${P}-anchor { display: inline-block; margin-left: ${v('space.2')}; padding-inline: ${v('space.1')}; border-radius: ${v('radius.sm')}; color: ${v('color.text.tertiary')}; font-family: ${v('font.family.mono')}; font-weight: ${v('font.weight.regular')}; text-decoration: none; opacity: 0; transition: opacity ${v('motion.duration.fast')} ${v('motion.easing.standard')}; }
.${P}-doc :is(h2, h3, h4):hover .${P}-anchor, .${P}-doc .${P}-anchor:focus-visible { opacity: 1; }
.${P}-doc .${P}-anchor:hover { color: ${v('color.text.link')}; }
@media (hover: none) { .${P}-doc .${P}-anchor { opacity: 1; } }

/* 문단·목록·강조 */
.${P}-doc strong { font-weight: ${v('font.weight.semibold')}; }
.${P}-doc a { color: ${v('color.text.link')}; text-decoration: underline; text-decoration-thickness: from-font; text-underline-offset: 0.2em; text-decoration-color: color-mix(in srgb, currentColor 40%, transparent); }
.${P}-doc a:hover { color: ${v('color.text.link-hover')}; text-decoration-color: currentColor; }
.${P}-doc :is(ul, ol) { padding-left: ${v('component.doc.list-indent')}; }
.${P}-doc li + li, .${P}-doc li > :is(ul, ol) { margin-top: ${v('component.doc.list-gap')}; }
.${P}-doc li::marker { color: ${v('color.text.tertiary')}; }
.${P}-doc ol > li::marker { font-family: ${v('font.family.mono')}; font-size: 0.875em; }
.${P}-doc blockquote { padding-left: ${v('space.4')}; border-left: ${v('border-width.accent')} solid ${v('color.border.default')}; color: ${v('color.text.secondary')}; }
.${P}-doc hr { border: 0; border-top: ${v('border-width.hairline')} solid ${v('color.border.default')}; margin-block: ${v('space.10')}; }
.${P}-doc mark { background: ${v('color.highlight.mark')}; color: ${v('color.highlight.mark-text')}; padding-inline: 0.15em; border-radius: ${v('radius.xs')}; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.${P}-doc img { max-width: 100%; height: auto; border-radius: ${v('radius.lg')}; }
.${P}-doc figcaption { margin-top: ${v('space.2')}; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.normal')}; color: ${v('color.text.secondary')}; }
.${P}-doc dl > dt { font-weight: ${v('font.weight.semibold')}; }
.${P}-doc dl > dd { margin: ${v('space.1')} 0 ${v('space.3')} ${v('space.4')}; color: ${v('color.text.secondary')}; }

/* 인라인 코드 */
.${P}-doc :not(pre) > code:not([class]), .${P}-code-inline { font-family: ${v('font.family.mono')}; font-size: ${v('component.inline-code.size')}; padding: 0.15em ${v('component.inline-code.padding-x')}; border-radius: ${v('component.inline-code.radius')}; background: ${v('component.inline-code.bg')}; color: ${v('component.inline-code.text')}; font-variant-ligatures: none; overflow-wrap: anywhere; }
.${P}-doc a > code { color: inherit; }

/* 코드 블록(Markdown 의 맨 pre). 컴포넌트 .${P}-code 를 쓰면 헤더·복사·줄 번호가 붙는다 */
.${P}-doc pre { padding: ${v('component.code-block.padding-y')} ${v('component.code-block.padding-x')}; border-radius: ${v('component.code-block.radius')}; background: ${v('component.code-block.bg')}; border: ${v('border-width.hairline')} solid ${v('component.code-block.border')}; color: ${v('color.code.text')}; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.relaxed')}; overflow-x: auto; tab-size: 2; }
.${P}-doc pre code { font-size: inherit; padding: 0; background: none; color: inherit; border-radius: 0; }
.${P}-doc pre ::selection, .${P}-code ::selection { background: ${v('color.code.selection')}; }

${syntaxCss(`.${P}-doc pre`)}
/* 표 */
.${P}-doc table { width: 100%; border-collapse: collapse; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.relaxed')}; }
.${P}-doc th, .${P}-doc td { padding: ${v('space.2')} ${v('space.3')}; border-bottom: ${v('border-width.hairline')} solid ${v('color.border.subtle')}; text-align: left; vertical-align: top; }
.${P}-doc th { font-weight: ${v('font.weight.medium')}; color: ${v('color.text.secondary')}; border-bottom-color: ${v('color.border.default')}; white-space: nowrap; }
.${P}-doc td > code { white-space: nowrap; }

/* 접힘(FAQ·긴 예시) */
.${P}-doc details { border: ${v('border-width.hairline')} solid ${v('color.border.default')}; border-radius: ${v('radius.lg')}; padding: ${v('space.3')} ${v('space.4')}; }
.${P}-doc details > summary { cursor: pointer; font-weight: ${v('font.weight.medium')}; }
.${P}-doc details[open] > summary { margin-bottom: ${v('space.3')}; }

/* GFM alert(> [!NOTE] 등) — 렌더러가 내는 .markdown-alert 를 AIP 콜아웃과 같은 모양으로 받는다(docs/07 §3) */
${Object.keys(CALLOUT_KINDS).map((k) => `.${P}-doc .markdown-alert-${k} { ${calloutVars(k)} }`).join('\n')}
.${P}-doc .markdown-alert { padding: ${v('component.callout.padding')}; border-radius: ${v('component.callout.radius')}; background: var(--${P}-_callout-bg, ${v('color.status.info.bg')}); box-shadow: inset ${v('component.callout.bar')} 0 0 var(--${P}-_callout-bar, ${v('color.status.info.border')}); }
.${P}-doc .markdown-alert > * + * { margin-top: ${v('space.2')}; }
.${P}-doc .markdown-alert > :first-child { margin-top: 0; }
.${P}-doc .markdown-alert-title { display: flex; align-items: center; gap: ${v('space.2')}; font-weight: ${v('font.weight.semibold')}; color: var(--${P}-_callout-title); }
.${P}-doc .markdown-alert-title svg { width: ${v('size.icon.sm')}; height: ${v('size.icon.sm')}; fill: var(--${P}-_callout-icon); }

@media (max-width: ${bpMax('md')}) {
  .${P}-doc h1 { font-size: ${v('font.size.3xl')}; }
  .${P}-doc h3 { font-size: ${v('font.size.lg')}; }
}
`;
writeFileSync(join(DIST, 'prose.css'), proseCss);

// 4e. components.css — components/*.css 를 순서대로 묶는다(lint 는 3 에서 끝났다)
writeFileSync(join(DIST, 'components.css'), `/* AIP components · 자동 생성 — components/*.css 를 고친 뒤 node tokens/build.mjs. 순서: ${COMPONENT_ORDER.join(' → ')} */\n` +
  componentSources.map(({ name, css }) => `\n/* ===== ${name}.css ===== */\n${css.trim()}\n`).join('') + `\n/* ===== 생성: 구문 강조(.${P}-code) ===== */\n${syntaxCss(`.${P}-code`)}`);
copyFileSync(join(COMPONENTS, 'aip.js'), join(DIST, 'aip.js'));

// 4f. tokens.js / tokens.d.ts
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
writeFileSync(join(DIST, 'tokens.js'), `// AIP tokens · 자동 생성\n// 각 leaf: { var: 'var(--aip-…)', value: 라이트 raw 값, dark?: 다크 raw 값 }\n// 스타일에는 .var 를 쓰고(다크 자동), 계산이 필요할 때만 .value 를 쓴다.\nexport const tokens = ${JSON.stringify(jsTree, null, 2)};\nexport default tokens;\n`);
function dts(node, indent = '  ') {
  if ('var' in node && 'value' in node) return `{ var: string; value: ${typeof node.value === 'number' ? 'number' : typeof node.value === 'string' ? 'string' : 'unknown'}; dark?: unknown }`;
  return `{\n${Object.entries(node).map(([k, val]) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${dts(val, indent + '  ')};`).join('\n')}\n${indent.slice(2)}}`;
}
// 모듈 없이 <script> 로 읽는 판(file:// 미리보기·CDN). window.AIP_TOKENS 에 같은 트리를 단다.
writeFileSync(join(DIST, 'tokens.global.js'), `// AIP tokens · 자동 생성 — <script src="tokens.global.js"> 용. 내용은 tokens.js 와 같다.\nwindow.AIP_TOKENS = ${JSON.stringify(jsTree)};\n`);
writeFileSync(join(DIST, 'tokens.d.ts'), `// AIP tokens · 자동 생성\nexport declare const tokens: ${dts(jsTree)};\nexport default tokens;\n`);

// 4g. tailwind.preset.cjs
const twColors = {};
for (const [k, t] of L) {
  if (!k.startsWith('color.')) continue;
  let node = twColors;
  for (const p of t.path.slice(1, -1)) node = node[p] ??= {};
  node[t.path.at(-1)] = `var(${varName(t.path)})`;
}
const twScale = (prefix) => Object.fromEntries([...L].filter(([k]) => k.startsWith(prefix + '.')).map(([, t]) => [t.path.slice(prefix.split('.').length).join('-'), `var(${varName(t.path)})`]));
const preset = {
  theme: {
    extend: {
      colors: twColors,
      spacing: Object.fromEntries(Object.entries(twScale('space')).map(([k, val]) => [k.replace('-', '.'), val])),
      borderRadius: twScale('radius'),
      borderWidth: twScale('border-width'),
      boxShadow: twScale('shadow'),
      fontFamily: { sans: `var(${varName(['font', 'family', 'sans'])})`, mono: `var(${varName(['font', 'family', 'mono'])})` },
      fontSize: twScale('font.size'),
      lineHeight: twScale('font.line-height'),
      letterSpacing: twScale('font.letter-spacing'),
      fontWeight: twScale('font.weight'),
      zIndex: twScale('z-index'),
      transitionDuration: twScale('motion.duration'),
      transitionTimingFunction: twScale('motion.easing'),
      maxWidth: Object.fromEntries(Object.entries(twScale('size.container')).map(([k, val]) => [`container-${k}`, val])),
      height: Object.fromEntries(Object.entries(twScale('size.control')).map(([k, val]) => [`control-${k}`, val])),
      width: Object.fromEntries(Object.entries(twScale('size.icon')).map(([k, val]) => [`icon-${k}`, val])),
    },
    screens: Object.fromEntries([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([, t]) => [t.path.at(-1), t.resolved])),
  },
};
writeFileSync(join(DIST, 'tailwind.preset.cjs'), `// AIP Tailwind preset · 자동 생성\n// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드한다. 다크는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// 4h. tokens.scss
writeFileSync(join(DIST, 'tokens.scss'), `// AIP tokens · 자동 생성 — 라이트 raw 값. 다크가 필요하면 CSS 변수(dist/tokens.css)를 쓴다.\n` +
  [...L].filter(([, t]) => cssValue(t) != null).map(([, t]) => `$${P}-${t.path.join('-')}: ${cssValue(t)};`).join('\n') + '\n');

// 4i. Figma Tokens Studio(라이트·다크 두 세트)
writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify({ 'aip/light': strip(light), 'aip/dark': strip(read('color.dark.json')), $metadata: { tokenSetOrder: ['aip/light', 'aip/dark'] } }, null, 2) + '\n');

// 4j. Mermaid 테마 — CSS 변수를 못 읽는 렌더러용. 개념 classDef 를 그대로 붙여 쓰면 docs/12 의 색 문법이 지켜진다.
const mermaidFor = (map) => {
  const c = (k) => map.get(k).resolved;
  const font = L.get('font.family.sans').resolved.slice(0, 3).map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  const dashed = new Set(['external']);
  return {
    theme: 'base',
    themeVariables: {
      fontFamily: font, fontSize: '14px',
      background: c('color.diagram.canvas'), primaryColor: c('color.diagram.runtime.fill'), primaryBorderColor: c('color.diagram.runtime.stroke'),
      primaryTextColor: c('color.diagram.runtime.text'), lineColor: c('color.diagram.edge.default'), textColor: c('color.text.primary'),
      secondaryColor: c('color.diagram.backend.fill'), tertiaryColor: c('color.diagram.frontend.fill'),
      clusterBkg: c('color.diagram.canvas'), clusterBorder: c('color.diagram.zone-border'), edgeLabelBackground: c('color.diagram.canvas'),
      noteBkgColor: c('color.diagram.note.fill'), noteBorderColor: c('color.diagram.note.stroke'), noteTextColor: c('color.diagram.note.text'),
    },
    classDefs: Object.fromEntries(ROLES.map((r) => [r, `fill:${c(`color.diagram.${r}.fill`)},stroke:${c(`color.diagram.${r}.stroke`)},color:${c(`color.diagram.${r}.text`)},stroke-width:1px${dashed.has(r) ? ',stroke-dasharray:6 4' : ''}`])),
    linkStyles: Object.fromEntries(['default', 'muted', 'emphasis', 'allow', 'reject'].map((e) => [e, `stroke:${c(`color.diagram.edge.${e}`)},stroke-width:${e === 'emphasis' ? 2 : 1.5}px${['muted', 'reject'].includes(e) ? ',stroke-dasharray:6 4' : ''}`])),
  };
};
const mermaid = { light: mermaidFor(L), dark: mermaidFor(D) };
mermaid.usage = 'flowchart 맨 아래에 classDef 를 붙인다: ' + ROLES.map((r) => `classDef ${r} ${mermaid.light.classDefs[r]}`).slice(0, 1)[0] + ' … 그리고 class A intent';
writeFileSync(join(DIST, 'diagram.mermaid.json'), JSON.stringify(mermaid, null, 2) + '\n');

// 4k. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');

const distFiles = readdirSync(DIST).length;
console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · components ${componentSources.length} files lint clean · dist/ ${distFiles} files`);
