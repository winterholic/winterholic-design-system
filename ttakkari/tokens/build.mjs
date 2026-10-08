// 토큰 빌드(Ttakkari): tokens/src/*.json(DTCG) 과 components/*.css 를 합쳐 tokens.json 과 dist/* 를 만든다.
// aip 빌드와 같은 골격이다. Ttakkari 에서 더한 것:
//   · 다크 진입 경로가 셋이다: prefers-color-scheme · data-theme="dark" · .dark 클래스(시드가 .dark 를 썼다). 강제 라이트는 data-theme="light" 또는 .light.
//   · dist/monaco-theme.json: 코드 뷰어(Monaco)는 CSS 변수를 못 읽는다. 잉크 면 토큰에서 hex 테마 두 벌(tk-ink-light·tk-ink-dark)을 만든다.
//   · dist/pwa.json: manifest·<meta name="theme-color"> 에 넣을 색. 앱 코드에 hex 를 쓰지 않게 한다.
//   · dist/aliases.css: 시드 변수 이름(--background·--primary·--surface-muted …)을 토큰에 잇는다. 시드로 짠 코드가 그대로 돈다.
//   · dist/prose.css: .tk-prose(문서 뷰어)·.tk-prose--compact(에이전트 메시지 안 Markdown). react-markdown 출력을 클래스 없이 받는다.
// 사용: node tokens/build.mjs   (ttakkari 디렉터리 기준 어디서 실행해도 된다) · 의존성 없음 · Node 18+

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast } from './scripts/ramp.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const SYSTEM = join(ROOT, '..');
const DIST = join(SYSTEM, 'dist');
const COMPONENTS = join(SYSTEM, 'components');
const PREFIX = 'tk';
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

// 대비 검사. 글자 4.5:1, 아이콘·경계·점·코드 줄 번호 3:1. 새 조합(글자 on 면)을 화면에 만들면 여기에 넣는다.
const hex6 = (v) => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : null);
const STATUS = ['info', 'success', 'warning', 'danger', 'neutral'];
const RUN = ['queued', 'running', 'waiting', 'succeeded', 'failed', 'cancelled'];
const POLICY = ['allowed', 'approval', 'blocked', 'restricted'];
const FILETYPE = ['doc', 'pdf', 'slide', 'sheet', 'image', 'code', 'other'];
const SYNTAX = ['text', 'comment', 'keyword', 'string', 'function', 'number', 'type', 'punctuation'];
const LOG = ['log-time', 'log-info', 'log-debug', 'log-tool', 'log-ok', 'log-warn', 'log-error'];
const SURFACES = ['canvas', 'default', 'subtle', 'raised'];
const PAIRS = [
  // 글자: 화면에 놓이는 모든 면
  ...['primary', 'secondary', 'tertiary', 'placeholder', 'link', 'link-hover', 'brand', 'agent', 'success', 'warning', 'danger', 'info']
    .flatMap((t) => SURFACES.map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
  ...['primary', 'secondary', 'tertiary'].flatMap((t) => ['sunken', 'muted'].map((s) => [`color.text.${t}`, `color.surface.${s}`, 4.5])),
  ...['primary', 'secondary', 'tertiary', 'brand', 'link'].map((t) => [`color.text.${t}`, 'color.surface.brand-subtle', 4.5]),
  ...['primary', 'secondary', 'tertiary', 'agent'].map((t) => [`color.text.${t}`, 'color.surface.agent-subtle', 4.5]),
  ['color.text.inverse', 'color.surface.inverse', 4.5],
  ['color.text.on-brand', 'color.surface.brand', 4.5],
  // 버튼: 모든 상태에서 글자가 유지되는가
  ...['bg', 'bg-hover', 'bg-active'].flatMap((b) => [
    ['color.action.primary.text', `color.action.primary.${b}`, 4.5],
    ['color.action.secondary.text', `color.action.secondary.${b}`, 4.5],
    ['color.action.ghost.text', `color.action.ghost.${b === 'bg' ? 'bg-hover' : b}`, 4.5],
    ['color.action.danger.text', `color.action.danger.${b}`, 4.5],
  ]),
  ['color.action.primary.bg', 'color.surface.canvas', 3],
  ['color.action.primary.bg', 'color.surface.default', 3],
  // 상태: 콜아웃 안 본문·링크·아이콘, 배지
  ...STATUS.flatMap((s) => [
    [`color.status.${s}.text`, `color.status.${s}.bg`, 4.5],
    ['color.text.primary', `color.status.${s}.bg`, 4.5],
    ['color.text.secondary', `color.status.${s}.bg`, 4.5],
    ['color.text.link', `color.status.${s}.bg`, 4.5],
    [`color.status.${s}.icon`, `color.status.${s}.bg`, 3],
    [`color.status.${s}.on-solid`, `color.status.${s}.solid`, 4.5],
  ]),
  // 작업 상태: 배지(bg 위 글자), 카드 위 상태 단어·아이콘, 카드 레일
  ...RUN.flatMap((r) => [
    [`color.run.${r}.text`, `color.run.${r}.bg`, 4.5],
    [`color.run.${r}.icon`, `color.run.${r}.bg`, 3],
    [`color.run.${r}.text`, 'color.surface.default', 4.5],
    [`color.run.${r}.icon`, 'color.surface.default', 3],
    ['color.text.primary', `color.run.${r}.bg`, 4.5],
    ['color.text.secondary', `color.run.${r}.bg`, 4.5],
  ]),
  // 정책
  ...POLICY.flatMap((p) => [
    [`color.policy.${p}.text`, `color.policy.${p}.bg`, 4.5],
    [`color.policy.${p}.icon`, `color.policy.${p}.bg`, 3],
    [`color.policy.${p}.text`, 'color.surface.default', 4.5],
    [`color.policy.${p}.icon`, 'color.surface.default', 3],
  ]),
  // 파일 계열: 타일 위 글리프·확장자, 카드 위 확장자 글자
  ...FILETYPE.flatMap((f) => [
    [`color.filetype.${f}.fg`, `color.filetype.${f}.bg`, 4.5],
    [`color.filetype.${f}.fg`, 'color.surface.default', 4.5],
  ]),
  // 에이전트
  ...['canvas', 'default', 'subtle'].flatMap((s) => [
    ['color.agent.text', `color.surface.${s}`, 4.5],
    ['color.agent.live', `color.surface.${s}`, 3],
  ]),
  ['color.agent.text', 'color.agent.bg', 4.5],
  ['color.agent.live', 'color.agent.bg', 3],
  ['color.agent.border', 'color.surface.default', 3],
  ['color.agent.on-ink', 'color.ink.bg', 4.5],
  ['color.agent.avatar-dot', 'color.agent.avatar-bg', 3],
  ['color.agent.avatar-fg', 'color.agent.avatar-bg', 4.5],
  // 연결 상태 점: 헤더(캔버스)·카드·연결 알약(muted) 위
  ...['online', 'connecting', 'offline'].flatMap((p) => ['canvas', 'default', 'muted'].map((s) => [`color.presence.${p}`, `color.surface.${s}`, 3])),
  // 형광펜
  ['color.highlight.mark-text', 'color.highlight.mark', 4.5],
  ['color.highlight.mark-active-text', 'color.highlight.mark-active', 4.5],
  // 잉크 면: 구문 강조·로그 전부 4.5
  ...SYNTAX.map((c) => [`color.ink.${c}`, 'color.ink.bg', 4.5]),
  ...LOG.map((c) => [`color.ink.${c}`, 'color.ink.bg', 4.5]),
  ['color.ink.text', 'color.ink.bg-header', 4.5],
  ['color.ink.text-muted', 'color.ink.bg-header', 4.5],
  ['color.ink.text-muted', 'color.ink.bg', 4.5],
  ['color.ink.line-number', 'color.ink.bg', 3],
  ['color.ink.added-sign', 'color.ink.bg', 4.5],
  ['color.ink.removed-sign', 'color.ink.bg', 4.5],
  ['color.ink.caret', 'color.ink.bg', 3],
  ['color.ink.text-inline', 'color.ink.bg-inline', 4.5],
  // 뷰어
  ['color.viewer.grid-head-text', 'color.viewer.grid-head', 4.5],
  ['color.text.primary', 'color.viewer.grid-head', 4.5],
  // 상호작용·경계
  ...SURFACES.map((s) => ['color.interactive.focus-ring', `color.surface.${s}`, 3]),
  ['color.interactive.selected-text', 'color.interactive.selected-bg', 4.5],
  ...['default', 'subtle', 'canvas', 'raised'].map((s) => ['color.border.strong', `color.surface.${s}`, 3]),
  ['color.border.brand', 'color.surface.default', 3],
  ['color.border.danger', 'color.surface.default', 3],
  ['color.text.primary', 'color.interactive.selection', 4.5],
  // 컴포넌트 고유 조합
  ['component.sidebar.item-active-text', 'component.sidebar.item-active-bg', 4.5],
  ['component.tabbar.text', 'component.tabbar.bg', 4.5],
  ['component.tabbar.text-active', 'component.tabbar.bg', 4.5],
  ['component.tooltip.text', 'component.tooltip.bg', 4.5],
  ['component.toast.text', 'component.toast.bg', 4.5],
  ...['log-ok', 'log-warn', 'log-error'].map((c) => [`color.ink.${c}`, 'component.toast.bg', 3]),
  ['color.ink.text-muted', 'component.toast.bg', 4.5],
  ['component.kbd.text', 'component.kbd.bg', 4.5],
  ['component.choice.switch-track', 'color.surface.default', 3],
  ['component.choice.bg-checked', 'color.surface.default', 3],
  ['component.message.user-text', 'component.message.user-bg', 4.5],
  ['component.chip.text-selected', 'component.chip.bg-selected', 4.5],
  ['component.chip.border-selected', 'color.surface.default', 3],
  ['component.run.progress-fill', 'component.run.progress-track', 3],
  ['component.progress.fill', 'component.progress.track', 3],
  ['component.sheet.handle-color', 'component.sheet.bg', 3],
  ['color.chart.axis', 'color.surface.canvas', 3],
  ['color.chart.label', 'color.surface.canvas', 4.5],
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

// 컴포넌트 CSS lint: 값은 전부 var(--tk-…) 로만. 미디어 쿼리 폭만 예외(CSS 변수를 못 쓴다)이고 breakpoint 토큰 값과 같아야 한다.
const BREAKPOINTS = new Set([...L].filter(([k]) => k.startsWith('breakpoint.')).map(([, t]) => t.resolved));
const COMPONENT_ORDER = ['base', 'layout', 'button', 'form', 'navigation', 'overlay', 'content', 'chat', 'run', 'artifact', 'viewer', 'code', 'app', 'utilities'];
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
// 토큰이 아닌데 컴포넌트가 읽어도 되는 외부 계약 변수. --tk-zoom 은 뷰어 배율(JS·React 가 쓴다).
const EXTRA_VARS = new Set(['--tk-zoom', '--tk-progress']);
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
    const body = media ? code.slice(media.index + media[0].length) : code;
    for (const [re, label] of LINT) if (re.test(body)) errors.push(`components/${name}.css:${i + 1} ${label}: ${line.trim()}`);
    if (/(?<![\w-])(?:red|blue|green|white|black|gray|grey|orange|yellow|purple)\b(?![\w-])/.test(body.replace(/--[\w-]+|"[^"]*"/g, ''))) errors.push(`components/${name}.css:${i + 1} 색 이름 직접값: ${line.trim()}`);
    for (const v of code.match(new RegExp(`--${P}-[a-z0-9-]+`, 'g')) ?? []) {
      // 컴포넌트 안에서 정의하는 지역 변수(--tk-_x)는 밑줄로 시작한다. 그 밖의 --tk-* 는 토큰이어야 한다.
      if (v.startsWith(`--${P}-_`)) continue;
      if (!knownVars.has(v) && !EXTRA_VARS.has(v)) errors.push(`components/${name}.css:${i + 1} 없는 토큰 변수 ${v}`);
    }
  });
}

// 이름 충돌 검사: (1) 글자 역할 클래스(.tk-<typography>)가 컴포넌트 블록과 같은 이름이면 안 된다(.tk-code 가 코드 블록과 글자 스타일 둘을 뜻하던 문제).
// (2) 한 블록을 두 파일이 '선택자 맨 앞'에서 정의하면 안 된다(레이아웃 .tk-grid 와 뷰어 표 .tk-grid 가 겹쳐 표가 CSS grid 로 깨지던 문제).
const SHARED_NAMES = new Set(['kbd']); // typography.css 가 kbd 상자와 글자를 함께 정의한다(의도)
const blockOwners = new Map();
const splitTop = (text, seps) => { const out = []; let depth = 0, cur = ''; for (const ch of text) { if (ch === '(') depth++; if (ch === ')') depth--; if (depth === 0 && seps.includes(ch)) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map((x) => x.trim()).filter(Boolean); };
const blockOf = (compound) => compound.match(/^\.tk-([a-z0-9]+(?:-[a-z0-9]+)*)/)?.[1];
for (const { name, css } of componentSources) {
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)) {
    const selectorText = m[1].trim();
    if (selectorText.startsWith('@') || /^(from|to|\d+%)/.test(selectorText)) continue;
    for (const sel of splitTop(selectorText, [','])) {
      const parts = splitTop(sel, [' ', '>', '+', '~']);
      const first = blockOf(parts[0]), last = blockOf(parts.at(-1));
      // 블록 자신(또는 부위·변형)을 꾸미는 규칙만 소유로 센다. 다른 블록 안의 문맥 규칙(.tk-app:has(…) .tk-toast-region)은 세지 않는다
      if (!first || first !== last) continue;
      if (!blockOwners.has(first)) blockOwners.set(first, new Set());
      blockOwners.get(first).add(name);
    }
  }
}
for (const [block, files] of blockOwners) if (files.size > 1) errors.push(`블록 .tk-${block} 를 여러 파일이 정의함: ${[...files].join(', ')}`);
for (const [k, t] of L) {
  if (t.$type !== 'typography' || !k.startsWith('typography.')) continue;
  const n = k.split('.').pop();
  if (blockOwners.has(n) && !SHARED_NAMES.has(n)) errors.push(`글자 역할 .tk-${n} 가 컴포넌트 블록 이름과 겹침(${[...blockOwners.get(n)].join(', ')})`);
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
    case 'typography': return null; // 복합: typography.css 클래스로
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

// 4b. tokens.css: 다크는 '라이트와 값이 다른 색·컴포넌트 토큰' + shadow 교체
const differs = (k) => JSON.stringify(L.get(k)?.resolved) !== JSON.stringify(D.get(k)?.resolved);
const darkShadowLines = [...L.keys()].filter((k) => k.startsWith('shadow.')).map((k) => {
  const dk = k.replace('shadow.', 'shadow-dark.');
  return D.has(dk) ? `  ${varName(L.get(k).path)}: ${cssValue(D.get(dk))};` : null;
}).filter(Boolean);
const darkLines = [...cssVarLines(D, (k) => (k.startsWith('color.') || k.startsWith('component.')) && differs(k)), ...darkShadowLines];
const bp = (name) => L.get(`breakpoint.${name}`).resolved;
const bpMax = (name) => `${parseInt(bp(name), 10) - 1}px`;

const tokensCss = `/* Ttakkari design tokens · 자동 생성. 손으로 고치지 말고 tokens/src 를 고친 뒤 node tokens/build.mjs */
:root {
  color-scheme: light;
${cssVarLines(L, (k) => !k.startsWith('shadow-dark.')).join('\n')}
}

/* 다크: 시스템 설정을 따르되 data-theme="light" 또는 .light 로 강제 라이트 가능 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    color-scheme: dark;
${darkLines.map((l) => '  ' + l).join('\n')}
  }
}
/* 다크: data-theme="dark" 또는 .dark(시드 규약) 로 강제 */
:root[data-theme="dark"], :root.dark {
  color-scheme: dark;
${darkLines.join('\n')}
}

/* 모션 축소: 움직임의 길이만 0 으로. 확인 상태 유지 시간(feedback·toast·tooltip-delay)은 그대로 둔다. live 맥박은 components.css 가 멈춘다 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --${P}-motion-duration-fast: 0ms;
    --${P}-motion-duration-normal: 0ms;
    --${P}-motion-duration-slow: 0ms;
  }
}
`;
writeFileSync(join(DIST, 'tokens.css'), tokensCss);

// 4c. typography.css: 역할 클래스 + 전역 기본값
const typoEntries = [...L].filter(([k, t]) => t.$type === 'typography' && k.startsWith('typography.'));
const MONO_STYLES = ['source', 'log-line', 'mono-label', 'kbd', 'eyebrow'];
const typoClass = ([k, t]) => {
  const val = t.resolved;
  const name = k.split('.').pop();
  const fam = Array.isArray(val.fontFamily) ? val.fontFamily.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ') : val.fontFamily;
  const extra = name === 'numeric' ? '\n  font-variant-numeric: tabular-nums;'
    : name === 'eyebrow' ? '\n  text-transform: uppercase;\n  font-variant-ligatures: none;'
    : MONO_STYLES.includes(name) ? '\n  font-variant-ligatures: none;' : '';
  return `.${P}-${name} {\n  font-family: ${fam};\n  font-size: ${val.fontSize};\n  font-weight: ${val.fontWeight};\n  line-height: ${val.lineHeight};\n  letter-spacing: ${val.letterSpacing};${extra}\n}`;
};
const typographyCss = `/* Ttakkari typography · 자동 생성 */
/* Pretendard·JetBrains Mono 로드는 소비 앱이 한다(docs/02). 여기는 전역 기본값 + 역할 클래스. 문서 본문은 dist/prose.css. */
html { -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: ${v('font.family.sans')}; font-size: ${v('font.size.md')}; line-height: ${v('font.line-height.relaxed')}; color: ${v('color.text.primary')}; background: ${v('color.surface.canvas')}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
:lang(ko) { word-break: keep-all; overflow-wrap: anywhere; }
code, kbd, pre, samp { font-family: ${v('font.family.mono')}; font-variant-ligatures: none; }
::selection { background: ${v('color.interactive.selection')}; }
:focus-visible { outline: ${v('focus.ring-width')} solid ${v('color.interactive.focus-ring')}; outline-offset: ${v('focus.ring-offset')}; }
:where(a) { color: ${v('color.text.link')}; }
kbd, .${P}-kbd { display: inline-flex; align-items: center; justify-content: center; min-width: ${v('component.kbd.height')}; height: ${v('component.kbd.height')}; padding-inline: ${v('component.kbd.padding-x')}; border-radius: ${v('component.kbd.radius')}; background: ${v('component.kbd.bg')}; border: ${v('border-width.hairline')} solid ${v('component.kbd.border')}; box-shadow: inset 0 calc(-1 * ${v('border-width.hairline')}) 0 ${v('component.kbd.border')}; color: ${v('component.kbd.text')}; font-family: ${v('font.family.mono')}; font-size: ${v('font.size.xs')}; font-weight: ${v('font.weight.medium')}; line-height: 1; box-sizing: border-box; vertical-align: middle; }

${typoEntries.map(typoClass).join('\n\n')}

/* 반응형: 제목은 모바일에서 한두 단계 내린다(모바일 퍼스트라 기본값이 데스크톱이 아니다. 360 폭 기준으로 정했다) */
@media (max-width: ${bpMax('md')}) {
  .${P}-display { font-size: ${v('font.size.3xl')}; }
  .${P}-heading-1 { font-size: ${v('font.size.xl')}; }
  .${P}-heading-2 { font-size: ${v('font.size.lg')}; }
  .${P}-doc-title { font-size: ${v('font.size.2xl')}; }
}
`;
writeFileSync(join(DIST, 'typography.css'), typographyCss);

// 4d. prose.css: .tk-prose 안의 문서 본문(react-markdown·DOCX→HTML 변환 결과를 그대로 받는다)
const CALLOUT_KINDS = { note: 'status.info', tip: 'status.success', important: 'highlight', warning: 'status.warning', caution: 'status.danger' };
const calloutVars = (kind) => {
  const g = CALLOUT_KINDS[kind];
  if (g === 'highlight') return `--${P}-_callout-bg: ${v('color.agent.bg')}; --${P}-_callout-bar: ${v('color.border.agent')}; --${P}-_callout-icon: ${v('color.agent.text')}; --${P}-_callout-title: ${v('color.agent.text')};`;
  return `--${P}-_callout-bg: ${v(`color.${g}.bg`)}; --${P}-_callout-bar: ${v(`color.${g}.border`)}; --${P}-_callout-icon: ${v(`color.${g}.icon`)}; --${P}-_callout-title: ${v(`color.${g}.text`)};`;
};
// 구문 강조 매핑. prose.css(.tk-prose pre)와 components.css(.tk-code)가 같은 규칙을 다른 범위로 받는다
const syntaxCss = (scope) => `/* 구문 강조: 외부 테마 CSS 없이 이 매핑만 쓴다. Prism(.token)·highlight.js(.hljs-)·Shiki(css-variables 테마) */
${scope} {
  --shiki-foreground: ${v('color.ink.text')}; --shiki-background: ${v('color.ink.bg')};
  --shiki-token-keyword: ${v('color.ink.keyword')}; --shiki-token-string: ${v('color.ink.string')}; --shiki-token-string-expression: ${v('color.ink.string')};
  --shiki-token-function: ${v('color.ink.function')}; --shiki-token-constant: ${v('color.ink.number')}; --shiki-token-comment: ${v('color.ink.comment')};
  --shiki-token-parameter: ${v('color.ink.text')}; --shiki-token-punctuation: ${v('color.ink.punctuation')}; --shiki-token-link: ${v('color.ink.keyword')};
}
${scope} :is(.token.comment, .token.prolog, .hljs-comment) { color: ${v('color.ink.comment')}; font-style: italic; }
${scope} :is(.token.keyword, .token.atrule, .token.important, .hljs-keyword, .hljs-built_in, .hljs-literal) { color: ${v('color.ink.keyword')}; }
${scope} :is(.token.string, .token.char, .token.attr-value, .token.template-string, .hljs-string, .hljs-attr) { color: ${v('color.ink.string')}; }
${scope} :is(.token.function, .hljs-title) { color: ${v('color.ink.function')}; }
${scope} :is(.token.number, .token.boolean, .token.constant, .hljs-number) { color: ${v('color.ink.number')}; }
${scope} :is(.token.class-name, .token.builtin, .hljs-type, .hljs-title.class_) { color: ${v('color.ink.type')}; }
${scope} :is(.token.punctuation, .token.operator, .hljs-punctuation, .hljs-operator) { color: ${v('color.ink.punctuation')}; }
`;
const proseCss = `/* Ttakkari prose · 자동 생성. .${P}-prose 안의 문서 본문. Markdown 렌더 결과(h1~h4·p·ul·pre·table·GFM alert)를 클래스 없이 받는다(docs/08 §3).
   .${P}-prose--compact 는 에이전트 메시지 안 Markdown: 같은 규칙을 메시지 밀도(문단 12·제목 축소)로 받는다. */
.${P}-prose { --${P}-_gap: ${v('component.prose.block-gap')}; --${P}-_figure: ${v('component.prose.figure-gap')}; max-width: ${v('size.container.prose')}; color: ${v('color.text.primary')}; font-family: ${v('font.family.sans')}; font-size: ${v('font.size.md')}; line-height: ${v('font.line-height.prose')}; overflow-wrap: break-word; }
.${P}-prose--compact { --${P}-_gap: ${v('component.prose.block-gap-compact')}; --${P}-_figure: ${v('component.prose.block-gap')}; max-width: none; line-height: ${v('font.line-height.relaxed')}; }
.${P}-prose > * { margin-block: 0; }
.${P}-prose > * + * { margin-top: var(--${P}-_gap); }
.${P}-prose > :is(pre, figure, table, details, blockquote, .${P}-code, .${P}-callout, .markdown-alert, .${P}-table-wrap) { margin-block: var(--${P}-_figure); }
.${P}-prose > :first-child { margin-top: 0; }
.${P}-prose > :last-child { margin-bottom: 0; }

/* 제목 */
.${P}-prose :is(h1, h2, h3, h4) { color: ${v('color.text.primary')}; scroll-margin-top: ${v('size.layout.anchor-offset')}; text-wrap: balance; }
.${P}-prose h1 { font-size: ${v('font.size.3xl')}; font-weight: ${v('font.weight.bold')}; line-height: ${v('font.line-height.snug')}; letter-spacing: ${v('font.letter-spacing.tight')}; }
.${P}-prose h2 { font-size: ${v('font.size.2xl')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.heading')}; letter-spacing: ${v('font.letter-spacing.snug')}; margin-top: ${v('component.prose.h2-gap')}; }
.${P}-prose h3 { font-size: ${v('font.size.xl')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.heading')}; letter-spacing: ${v('font.letter-spacing.snug')}; margin-top: ${v('component.prose.h3-gap')}; }
.${P}-prose h4 { font-size: ${v('font.size.md')}; font-weight: ${v('font.weight.semibold')}; line-height: ${v('font.line-height.normal')}; margin-top: ${v('component.prose.h4-gap')}; }
.${P}-prose > :is(h1, h2, h3, h4) + * { margin-top: ${v('component.prose.heading-after')}; }
.${P}-prose :is(h1, h2, h3, h4) code { font-size: 0.9em; }
/* 메시지 안 제목은 메시지보다 한 단계만 크다. 채팅이 문서처럼 보이지 않게 */
.${P}-prose--compact :is(h1, h2) { font-size: ${v('font.size.lg')}; margin-top: ${v('space.5')}; }
.${P}-prose--compact :is(h3, h4) { font-size: ${v('font.size.md')}; margin-top: ${v('space.4')}; }
.${P}-prose--compact > :is(h1, h2, h3, h4) + * { margin-top: ${v('space.2')}; }

/* 문단·목록·강조 */
.${P}-prose strong { font-weight: ${v('font.weight.semibold')}; }
.${P}-prose a { color: ${v('color.text.link')}; text-decoration: underline; text-decoration-thickness: from-font; text-underline-offset: 0.2em; text-decoration-color: color-mix(in srgb, currentColor 40%, transparent); }
.${P}-prose a:hover { color: ${v('color.text.link-hover')}; text-decoration-color: currentColor; }
.${P}-prose :is(ul, ol) { padding-left: ${v('component.prose.list-indent')}; }
.${P}-prose li + li, .${P}-prose li > :is(ul, ol) { margin-top: ${v('component.prose.list-gap')}; }
.${P}-prose li::marker { color: ${v('color.text.tertiary')}; }
.${P}-prose ol > li::marker { font-family: ${v('font.family.mono')}; font-size: 0.875em; }
.${P}-prose li > input[type="checkbox"] { margin: 0 ${v('space.2')} 0 0; accent-color: ${v('color.action.primary.bg')}; }
.${P}-prose blockquote { padding-left: ${v('space.4')}; border-left: ${v('border-width.accent')} solid ${v('color.border.default')}; color: ${v('color.text.secondary')}; }
.${P}-prose hr { border: 0; border-top: ${v('border-width.hairline')} solid ${v('color.border.default')}; margin-block: ${v('space.8')}; }
.${P}-prose mark { background: ${v('color.highlight.mark')}; color: ${v('color.highlight.mark-text')}; padding-inline: 0.15em; border-radius: ${v('radius.xs')}; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.${P}-prose img { max-width: 100%; height: auto; border-radius: ${v('radius.lg')}; }
.${P}-prose figcaption { margin-top: ${v('space.2')}; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.normal')}; color: ${v('color.text.secondary')}; }
.${P}-prose dl > dt { font-weight: ${v('font.weight.semibold')}; }
.${P}-prose dl > dd { margin: ${v('space.1')} 0 ${v('space.3')} ${v('space.4')}; color: ${v('color.text.secondary')}; }

/* 인라인 코드 */
.${P}-prose :not(pre) > code:not([class]), .${P}-code-inline { font-family: ${v('font.family.mono')}; font-size: ${v('component.inline-code.size')}; padding: 0.15em ${v('component.inline-code.padding-x')}; border-radius: ${v('component.inline-code.radius')}; background: ${v('component.inline-code.bg')}; color: ${v('component.inline-code.text')}; font-variant-ligatures: none; overflow-wrap: anywhere; }
.${P}-prose a > code { color: inherit; }

/* 코드 블록(Markdown 의 맨 pre). 컴포넌트 .${P}-code 를 쓰면 헤더·복사·줄 번호가 붙는다 */
.${P}-prose pre { padding: ${v('component.code-block.padding-y')} ${v('component.code-block.padding-x')}; border-radius: ${v('component.code-block.radius')}; background: ${v('component.code-block.bg')}; border: ${v('border-width.hairline')} solid ${v('component.code-block.border')}; color: ${v('color.ink.text')}; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.relaxed')}; overflow-x: auto; tab-size: 2; }
.${P}-prose pre code { font-size: inherit; padding: 0; background: none; color: inherit; border-radius: 0; }
.${P}-prose pre ::selection, .${P}-code ::selection { background: ${v('color.ink.selection')}; }

${syntaxCss(`.${P}-prose pre`)}
/* 표 */
.${P}-prose table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; font-size: ${v('font.size.sm')}; line-height: ${v('font.line-height.relaxed')}; }
.${P}-prose th, .${P}-prose td { padding: ${v('space.2')} ${v('space.3')}; border-bottom: ${v('border-width.hairline')} solid ${v('color.border.subtle')}; text-align: left; vertical-align: top; }
.${P}-prose th { font-weight: ${v('font.weight.medium')}; color: ${v('color.text.secondary')}; border-bottom-color: ${v('color.border.default')}; white-space: nowrap; }
.${P}-prose td > code { white-space: nowrap; }

/* 접힘 */
.${P}-prose details { border: ${v('border-width.hairline')} solid ${v('color.border.default')}; border-radius: ${v('radius.lg')}; padding: ${v('space.3')} ${v('space.4')}; }
.${P}-prose details > summary { cursor: pointer; font-weight: ${v('font.weight.medium')}; }
.${P}-prose details[open] > summary { margin-bottom: ${v('space.3')}; }

/* GFM alert(> [!NOTE] 등): 렌더러가 내는 .markdown-alert 를 콜아웃과 같은 모양으로 받는다(docs/06 §11) */
${Object.keys(CALLOUT_KINDS).map((k) => `.${P}-prose .markdown-alert-${k} { ${calloutVars(k)} }`).join('\n')}
.${P}-prose .markdown-alert { padding: ${v('component.callout.padding')}; border-radius: ${v('component.callout.radius')}; background: var(--${P}-_callout-bg, ${v('color.status.info.bg')}); box-shadow: inset ${v('component.callout.bar')} 0 0 var(--${P}-_callout-bar, ${v('color.status.info.border')}); }
.${P}-prose .markdown-alert > * + * { margin-top: ${v('space.2')}; }
.${P}-prose .markdown-alert > :first-child { margin-top: 0; }
.${P}-prose .markdown-alert-title { display: flex; align-items: center; gap: ${v('space.2')}; font-weight: ${v('font.weight.semibold')}; color: var(--${P}-_callout-title); }
.${P}-prose .markdown-alert-title svg { width: ${v('size.icon.sm')}; height: ${v('size.icon.sm')}; fill: var(--${P}-_callout-icon); }

@media (max-width: ${bpMax('md')}) {
  .${P}-prose h1 { font-size: ${v('font.size.2xl')}; }
  .${P}-prose h2 { font-size: ${v('font.size.xl')}; }
  .${P}-prose h3 { font-size: ${v('font.size.lg')}; }
}
`;
writeFileSync(join(DIST, 'prose.css'), proseCss);

// 4e. components.css: components/*.css 를 순서대로 묶는다(lint 는 3 에서 끝났다)
writeFileSync(join(DIST, 'components.css'), `/* Ttakkari components · 자동 생성. components/*.css 를 고친 뒤 node tokens/build.mjs. 순서: ${COMPONENT_ORDER.join(' → ')} */\n` +
  componentSources.map(({ name, css }) => `\n/* ===== ${name}.css ===== */\n${css.trim()}\n`).join('') + `\n/* ===== 생성: 구문 강조(.${P}-code) ===== */\n${syntaxCss(`.${P}-code`)}`);
copyFileSync(join(COMPONENTS, 'tk.js'), join(DIST, 'tk.js'));

// 4f. tokens.js / tokens.d.ts / tokens.global.js
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
writeFileSync(join(DIST, 'tokens.js'), `// Ttakkari tokens · 자동 생성\n// 각 leaf: { var: 'var(--tk-…)', value: 라이트 raw 값, dark?: 다크 raw 값 }\n// 스타일에는 .var 를 쓰고(다크 자동), 계산이 필요할 때만 .value 를 쓴다.\nexport const tokens = ${JSON.stringify(jsTree, null, 2)};\nexport default tokens;\n`);
function dts(node, indent = '  ') {
  if ('var' in node && 'value' in node) return `{ var: string; value: ${typeof node.value === 'number' ? 'number' : typeof node.value === 'string' ? 'string' : 'unknown'}; dark?: unknown }`;
  return `{\n${Object.entries(node).map(([k, val]) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${dts(val, indent + '  ')};`).join('\n')}\n${indent.slice(2)}}`;
}
writeFileSync(join(DIST, 'tokens.global.js'), `// Ttakkari tokens · 자동 생성. <script src="tokens.global.js"> 용. 내용은 tokens.js 와 같다.\nwindow.TK_TOKENS = ${JSON.stringify(jsTree)};\n`);
writeFileSync(join(DIST, 'tokens.d.ts'), `// Ttakkari tokens · 자동 생성\nexport declare const tokens: ${dts(jsTree)};\nexport default tokens;\n`);

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
writeFileSync(join(DIST, 'tailwind.preset.cjs'), `// Ttakkari Tailwind preset · 자동 생성\n// 색은 CSS 변수를 가리키므로 dist/tokens.css 를 함께 로드한다. 다크는 변수 쪽에서 처리되니 dark: 접두사가 필요 없다.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// 4h. tokens.scss
writeFileSync(join(DIST, 'tokens.scss'), `// Ttakkari tokens · 자동 생성. 라이트 raw 값. 다크가 필요하면 CSS 변수(dist/tokens.css)를 쓴다.\n` +
  [...L].filter(([, t]) => cssValue(t) != null).map(([, t]) => `$${P}-${t.path.join('-')}: ${cssValue(t)};`).join('\n') + '\n');

// 4i. Figma Tokens Studio(라이트·다크 두 세트)
writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify({ 'ttakkari/light': strip(light), 'ttakkari/dark': strip(read('color.dark.json')), $metadata: { tokenSetOrder: ['ttakkari/light', 'ttakkari/dark'] } }, null, 2) + '\n');

// 4j. Monaco 테마: 코드 뷰어는 CSS 변수를 못 읽는다. 잉크 면은 두 테마 모두 어두우니 base 는 vs-dark.
//     앱 테마가 바뀌면 monaco.editor.setTheme('tk-ink-dark') 처럼 이름만 바꾼다(docs/19 §4).
const monacoFor = (map) => {
  const c = (k) => map.get(k).resolved;
  const bare = (k) => c(k).replace('#', '');
  return {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: bare('color.ink.text'), background: bare('color.ink.bg') },
      { token: 'comment', foreground: bare('color.ink.comment'), fontStyle: 'italic' },
      { token: 'keyword', foreground: bare('color.ink.keyword') },
      { token: 'string', foreground: bare('color.ink.string') },
      { token: 'number', foreground: bare('color.ink.number') },
      { token: 'type', foreground: bare('color.ink.type') },
      { token: 'type.identifier', foreground: bare('color.ink.type') },
      { token: 'function', foreground: bare('color.ink.function') },
      { token: 'delimiter', foreground: bare('color.ink.punctuation') },
      { token: 'tag', foreground: bare('color.ink.keyword') },
      { token: 'attribute.name', foreground: bare('color.ink.function') },
      { token: 'attribute.value', foreground: bare('color.ink.string') },
    ],
    colors: {
      'editor.background': c('color.ink.bg'),
      'editor.foreground': c('color.ink.text'),
      'editorLineNumber.foreground': c('color.ink.line-number'),
      'editorLineNumber.activeForeground': c('color.ink.text-muted'),
      'editorCursor.foreground': c('color.ink.caret'),
      'editor.selectionBackground': c('color.ink.selection'),
      'editor.lineHighlightBackground': c('color.ink.hover'),
      'editor.findMatchBackground': `${c('color.highlight.mark-active')}80`,
      'editor.findMatchHighlightBackground': `${c('color.highlight.mark')}40`,
      'editorIndentGuide.background1': c('color.ink.bg-header'),
      'editorWidget.background': c('color.ink.bg-header'),
      'editorWidget.border': c('color.ink.border'),
      'editorGutter.background': c('color.ink.bg'),
      'diffEditor.insertedLineBackground': c('color.ink.added-bg'),
      'diffEditor.removedLineBackground': c('color.ink.removed-bg'),
      focusBorder: c('color.interactive.focus-ring'),
    },
  };
};
writeFileSync(join(DIST, 'monaco-theme.json'), JSON.stringify({
  'tk-ink-light': monacoFor(L),
  'tk-ink-dark': monacoFor(D),
  usage: "monaco.editor.defineTheme('tk-ink-light', theme['tk-ink-light']); monaco.editor.defineTheme('tk-ink-dark', theme['tk-ink-dark']); 앱 테마가 다크면 tk-ink-dark",
}, null, 2) + '\n');

// 4k. PWA 색: manifest 와 theme-color meta. 정적 산출물이라 hex 다.
const pwa = {
  name: 'Winterholic Ttakkari',
  short_name: 'Ttakkari',
  theme_color: L.get('color.surface.canvas').resolved,
  background_color: L.get('color.surface.canvas').resolved,
  theme_color_dark: D.get('color.surface.canvas').resolved,
  meta: [
    `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${L.get('color.surface.canvas').resolved}">`,
    `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${D.get('color.surface.canvas').resolved}">`,
  ],
  icons: [
    { src: '/brand/app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/brand/app-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
writeFileSync(join(DIST, 'pwa.json'), JSON.stringify(pwa, null, 2) + '\n');

// 4l. 시드 별칭: 시드 변수 이름 → 토큰. 두 테마 모두 토큰이 바뀌므로 별칭은 한 벌이면 된다.
const ALIASES = {
  '--background': 'color.surface.canvas',
  '--foreground': 'color.text.primary',
  '--primary': 'color.action.primary.bg',
  '--accent': 'color.accent.mint',
  '--accent-soft': 'color.accent.mint-soft',
  '--surface': 'color.surface.default',
  '--surface-muted': 'color.surface.muted',
  '--border': 'color.border.default',
  '--text-muted': 'color.text.tertiary',
};
for (const t of Object.values(ALIASES)) if (!L.has(t)) throw new Error(`별칭 대상 없음: ${t}`);
writeFileSync(join(DIST, 'aliases.css'), `/* Ttakkari seed aliases · 자동 생성. 처음 준 :root·.dark 변수 이름을 토큰에 잇는다(docs/01 §2).
   새 코드는 --${P}-* 를 쓴다. 이 파일은 시드 이름으로 이미 짠 코드를 위한 다리다. tokens.css 다음에 로드한다. */
:root {
${Object.entries(ALIASES).map(([a, t]) => `  ${a}: ${v(t)};`).join('\n')}
}
`);

// 4m. 대비 리포트
writeFileSync(join(DIST, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');

const distFiles = readdirSync(DIST).length;
console.log(`ok · tokens ${L.size} · dark overrides ${darkLines.length} · contrast checks ${contrastReport.length} (all pass) · components ${componentSources.length} files lint clean · dist/ ${distFiles} files`);
