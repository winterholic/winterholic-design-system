// Ttakkari 디자인 시스템 정적 검사. ttakkari 디렉터리에서 실행한다: cd ttakkari && node --test ../scripts/ttakkari-design-system.test.mjs
// 빌드(node tokens/build.mjs)가 먼저 돌아 있어야 한다(npm test 가 그 순서로 부른다).
// 무엇을 막나: 시드 색이 바뀌는 것, 예제가 없는 클래스·토큰을 쓰는 것, aria 참조 끊김, 문서 지도 누락, 예제 CSS 하드코딩, 접근성 이름 누락, 한글 조합 중 Enter 전송.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import test from 'node:test';

const root = process.cwd();
assert.equal(basename(root), 'ttakkari', 'ttakkari 디렉터리에서 실행해야 한다');
const read = (p) => readFileSync(join(root, p), 'utf8');
const dist = (f) => read(join('dist', f));
const examples = readdirSync(join(root, 'examples')).filter((f) => f.endsWith('.html'));
const docs = readdirSync(join(root, 'docs')).filter((f) => f.endsWith('.md'));
const allCss = ['tokens.css', 'typography.css', 'prose.css', 'components.css'].map(dist).join('\n') + read('examples/examples.css');
const tokenVars = new Set(dist('tokens.css').match(/--tk-[a-z0-9-]+(?=:)/g));
const tokensCss = dist('tokens.css');
const lightBlock = tokensCss.slice(0, tokensCss.indexOf('@media (prefers-color-scheme: dark)'));
const darkBlock = tokensCss.slice(tokensCss.indexOf(':root[data-theme="dark"]'));
const valueIn = (block, name) => block.match(new RegExp(`${name}: ([^;]+);`))?.[1];

test('빌드 산출물이 전부 있고 대비 검사가 전부 통과했다', () => {
  for (const f of ['tokens.css', 'typography.css', 'prose.css', 'components.css', 'tk.js', 'tokens.js', 'tokens.d.ts', 'tokens.global.js', 'tailwind.preset.cjs', 'tokens.scss', 'tokens.figma.json', 'monaco-theme.json', 'pwa.json', 'aliases.css', 'contrast-report.json']) {
    assert.ok(existsSync(join(root, 'dist', f)), `dist/${f} 없음`);
  }
  const report = JSON.parse(dist('contrast-report.json'));
  assert.ok(report.length >= 500, `대비 검사 쌍이 적다: ${report.length}`);
  assert.deepEqual(report.filter((r) => !r.pass), []);
  assert.ok(report.some((r) => r.mode === 'dark') && report.some((r) => r.mode === 'light'));
});

test('사용자가 준 시드 13색이 그대로다(브랜드 5색 + 중립 시드 8색)', () => {
  const b = JSON.parse(read('tokens/src/brand.json'));
  const expected = {
    brand: { paper: '#F4F4ED', ink: '#080705', blue: '#296EB4', mint: '#00F0B5', 'mint-soft': '#6DECAF' },
    seed: { surface: '#FFFFFF', 'surface-muted': '#E9ECE8', border: '#D6DCD7', 'text-muted': '#59645F', 'dark-surface': '#171B1C', 'dark-surface-muted': '#22292A', 'dark-border': '#30383A', 'dark-text-muted': '#A6B0B8' },
  };
  for (const [group, values] of Object.entries(expected)) {
    for (const [name, hex] of Object.entries(values)) assert.equal(b[group][name].$value, hex, `${group}.${name}`);
  }
  const palette = JSON.parse(read('tokens/src/palette.json'));
  for (const [ramp, step, hex] of [['blue', 600, '#296EB4'], ['mint', 300, '#00F0B5'], ['sage', 700, '#59645F'], ['graphite', 900, '#30383A']]) {
    assert.equal(palette[ramp][step].$value, hex, `${ramp}.${step} 앵커`);
  }
});

test('시드 변수가 원래 자리에 그대로 앉는다(라이트·다크)', () => {
  const map = [
    ['--tk-color-surface-canvas', '#F4F4ED', '#080705'],
    ['--tk-color-text-primary', '#080705', '#F4F4ED'],
    ['--tk-color-action-primary-bg', '#296EB4', null],
    ['--tk-color-surface-default', '#FFFFFF', '#171B1C'],
    ['--tk-color-surface-muted', '#E9ECE8', '#22292A'],
    ['--tk-color-border-default', '#D6DCD7', '#30383A'],
    ['--tk-color-text-tertiary', '#59645F', '#A6B0B8'],
    ['--tk-color-highlight-mark', '#6DECAF', null],
  ];
  for (const [name, l, d] of map) {
    assert.equal(valueIn(lightBlock, name), l, `${name} 라이트`);
    if (d) assert.equal(valueIn(darkBlock, name), d, `${name} 다크`);
    else assert.ok(!new RegExp(`${name}:`).test(darkBlock), `${name} 는 두 테마에서 같은 값이어야 한다`);
  }
});

test('시드 이름 별칭(aliases.css)이 9개 전부 토큰을 가리킨다', () => {
  const css = dist('aliases.css');
  for (const n of ['--background', '--foreground', '--primary', '--accent', '--accent-soft', '--surface', '--surface-muted', '--border', '--text-muted']) {
    const m = css.match(new RegExp(`${n}: var\\((--tk-[a-z0-9-]+)\\);`));
    assert.ok(m, `${n} 별칭 없음`);
    assert.ok(tokenVars.has(m[1]), `${n} → ${m[1]} 없는 토큰`);
  }
});

test('다크 진입 경로 셋(시스템·data-theme·.dark)과 강제 라이트가 tokens.css 에 있다', () => {
  assert.match(tokensCss, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\):not\(\.light\)/);
  assert.match(tokensCss, /:root\[data-theme="dark"\], :root\.dark \{/);
  assert.match(tokensCss, /prefers-reduced-motion: reduce/);
});

test('예제가 쓰는 tk- 클래스는 전부 CSS 에 정의돼 있다', () => {
  const defined = new Set([...allCss.matchAll(/\.(tk-[a-z0-9_-]+)/g)].map((m) => m[1]));
  const missing = [];
  for (const f of examples) {
    const html = read(join('examples', f));
    for (const m of html.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c.startsWith('tk-') && !defined.has(c)) missing.push(`${f}: ${c}`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('예제·인라인 스타일의 var(--tk-*) 는 실제 토큰이다', () => {
  const missing = [];
  const extra = new Set(['--tk-zoom', '--tk-progress']);
  const sources = [['examples/examples.css', read('examples/examples.css')], ...examples.map((f) => [f, read(join('examples', f))])];
  for (const [name, text] of sources) {
    for (const m of text.matchAll(/var\((--tk-[a-z0-9-]+)/g)) if (!tokenVars.has(m[1]) && !extra.has(m[1])) missing.push(`${name}: ${m[1]}`);
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('예제 CSS 도 하드코딩 값이 없다(components 와 같은 기준)', () => {
  const css = read('examples/examples.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const bad = css.split('\n').map((line, i) => [i + 1, line.replace(/@media[^{]*/, '')])
    .filter(([, l]) => /#[0-9a-fA-F]{3,8}\b|\brgba?\(|(?<![\w-])\d*\.?\d+px\b|(?<![\w-])\d+m?s\b|z-index:\s*\d/.test(l));
  assert.deepEqual(bad, []);
});

test('aria 참조(aria-controls·labelledby·describedby·for·dialog-open·href#)가 끊기지 않고 id 가 유일하다', () => {
  const sprite = new Set([...read('examples/icons.js').matchAll(/^\s+'?([a-z-]+)'?:/gm)].map((m) => `i-${m[1]}`));
  for (const f of examples) {
    const html = read(join('examples', f));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids.filter((x, i) => ids.indexOf(x) !== i), [], `${f} 중복 id`);
    const idSet = new Set(ids);
    const refs = [
      ...[...html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)),
      ...[...html.matchAll(/\sfor="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/data-tk-dialog-open="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]),
    ];
    assert.deepEqual([...new Set(refs.filter((r) => !idSet.has(r) && !sprite.has(r)))], [], `${f} 끊긴 참조`);
    for (const m of html.matchAll(/<use href="#(i-[a-z-]+)"/g)) assert.ok(sprite.has(m[1]), `${f}: 아이콘 ${m[1]} 이 icons.js 에 없음`);
  }
});

test('접근성 이름: 아이콘 버튼 aria-label, 이미지 alt, 탭은 패널과 연결, skip link·main', () => {
  for (const f of examples) {
    const html = read(join('examples', f));
    for (const m of html.matchAll(/<(button|a)\b[^>]*class="[^"]*\btk-icon-button\b[^"]*"[^>]*>/g)) assert.match(m[0], /aria-label="[^"]+"/, `${f}: ${m[0].slice(0, 90)}`);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) assert.match(m[0], /\balt="/, `${f}: alt 없음 ${m[0].slice(0, 80)}`);
    for (const m of html.matchAll(/<[^>]+role="tab"[^>]*>/g)) assert.match(m[0], /aria-controls="/, `${f}: 탭에 aria-controls 없음`);
    for (const m of html.matchAll(/<iframe\b[^>]*>/g)) { assert.match(m[0], /\bsandbox=/, `${f}: iframe 에 sandbox 없음`); assert.match(m[0], /\btitle="/, `${f}: iframe 에 title 없음`); }
    assert.match(html, /class="tk-skip-link"/, `${f}: skip link 없음`);
    assert.match(html, /<main\b/, `${f}: main 없음`);
    assert.match(html, /viewport-fit=cover/, `${f}: 노치 안전 영역을 쓰려면 viewport-fit=cover`);
  }
});

test('앱 템플릿은 모바일 탭바와 데스크톱 사이드바를 함께 가진다(같은 영역 이름)', () => {
  for (const f of ['chat.html', 'workspace.html', 'library.html', 'files.html']) {
    const html = read(join('examples', f));
    assert.match(html, /class="tk-tabbar"/, `${f}: 탭바 없음`);
    assert.match(html, /class="tk-app__sidebar"/, `${f}: 사이드바 없음`);
    for (const area of ['chat.html', 'workspace.html', 'library.html', 'files.html']) assert.ok(html.includes(`href="${area}"`), `${f}: ${area} 로 가는 길 없음`);
  }
});

test('문서 지도: docs 의 모든 파일이 README 에 연결되고, 문서 사이 상대 링크가 살아 있다', () => {
  const readme = read('README.md');
  for (const d of docs) assert.ok(readme.includes(`docs/${d}`), `README 에 docs/${d} 없음`);
  for (const d of docs) {
    const text = read(join('docs', d));
    for (const m of text.matchAll(/\]\((?!https?:|#)([^)#]+)(?:#[^)]*)?\)/g)) assert.ok(existsSync(join(root, 'docs', m[1])), `docs/${d} → ${m[1]} 링크 끊김`);
  }
});

test('컴포넌트 블록마다 문서에 마크업 계약이 있다', () => {
  const src = readdirSync(join(root, 'components')).filter((f) => f.endsWith('.css')).map((f) => read(join('components', f))).join('\n');
  const blocks = new Set([...src.matchAll(/\.(tk-[a-z0-9-]+?)(?=[\s.:,{>[)])/g)].map((m) => m[1]).filter((c) => !c.includes('__') && !c.includes('--')));
  const docText = docs.map((d) => read(join('docs', d))).join('\n');
  assert.deepEqual([...blocks].filter((c) => !docText.includes(c)), []);
});

test('Monaco 테마·PWA 색은 토큰에서 나온 hex 다', () => {
  const monaco = JSON.parse(dist('monaco-theme.json'));
  for (const name of ['tk-ink-light', 'tk-ink-dark']) {
    assert.equal(monaco[name].base, 'vs-dark');
    assert.match(monaco[name].colors['editor.background'], /^#[0-9A-F]{6}$/);
    assert.equal(monaco[name].colors['editorCursor.foreground'], '#00F0B5', '커서는 민트(에이전트가 쓰는 자리)');
  }
  assert.equal(monaco['tk-ink-light'].colors['editor.background'], '#171B1C');
  const pwa = JSON.parse(dist('pwa.json'));
  assert.equal(pwa.theme_color, '#F4F4ED');
  assert.equal(pwa.theme_color_dark, '#080705');
  assert.ok(pwa.icons.some((i) => i.purpose === 'maskable'));
});

test('tk.js: 한글 조합 중 Enter 는 보내지 않는다 · 터치 Enter 는 줄바꿈 · 토스트는 행동이 있으면 자동으로 닫지 않는다', () => {
  const js = read('components/tk.js');
  assert.match(js, /e\.isComposing \|\| e\.keyCode === 229/);
  assert.match(js, /!e\.shiftKey && !coarse\(\)/);
  assert.match(js, /if \(!action\) setTimeout\(dismiss/);
  assert.equal(read('dist/tk.js'), js, 'dist/tk.js 가 components/tk.js 와 다르다(빌드를 다시 돌려라)');
});

test('라이선스·외부 서비스 결정을 이 시스템이 대신하지 않는다', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.license, undefined);
  assert.equal(pkg.name, 'ttakkari-design-system');
});
