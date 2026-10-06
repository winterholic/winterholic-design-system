// AIP 디자인 시스템 정적 검사. aip 디렉터리에서 실행한다: cd aip && node --test ../scripts/aip-design-system.test.mjs
// 빌드(node tokens/build.mjs)가 먼저 돌아 있어야 한다(npm test 가 그 순서로 부른다).
// 무엇을 막나: 예제가 존재하지 않는 클래스·토큰을 쓰는 것, aria 참조가 끊기는 것, 문서 링크·문서 지도 누락, 예제 CSS 하드코딩, 접근성 이름 누락.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import test from 'node:test';

const root = process.cwd();
assert.equal(basename(root), 'aip', 'aip 디렉터리에서 실행해야 한다');
const read = (p) => readFileSync(join(root, p), 'utf8');
const dist = (f) => read(join('dist', f));
const examples = readdirSync(join(root, 'examples')).filter((f) => f.endsWith('.html'));
const docs = readdirSync(join(root, 'docs')).filter((f) => f.endsWith('.md'));
const allCss = ['tokens.css', 'typography.css', 'prose.css', 'components.css'].map(dist).join('\n') + read('examples/examples.css');
const tokenVars = new Set(dist('tokens.css').match(/--aip-[a-z0-9-]+(?=:)/g));

test('빌드 산출물이 전부 있고 대비 검사가 전부 통과했다', () => {
  for (const f of ['tokens.css', 'typography.css', 'prose.css', 'components.css', 'aip.js', 'tokens.js', 'tokens.d.ts', 'tokens.global.js', 'tailwind.preset.cjs', 'tokens.scss', 'tokens.figma.json', 'diagram.mermaid.json', 'contrast-report.json']) {
    assert.ok(existsSync(join(root, 'dist', f)), `dist/${f} 없음`);
  }
  const report = JSON.parse(dist('contrast-report.json'));
  assert.ok(report.length >= 300, `대비 검사 쌍이 적다: ${report.length}`);
  assert.deepEqual(report.filter((r) => !r.pass), []);
  assert.ok(report.some((r) => r.mode === 'dark') && report.some((r) => r.mode === 'light'));
});

test('브랜드 5색이 지정 값 그대로 램프 안에 있다', () => {
  const brand = JSON.parse(read('tokens/src/brand.json')).brand;
  const palette = JSON.parse(read('tokens/src/palette.json'));
  const expected = { blue: ['#1C77C3', 'blue', 600], tangerine: ['#FAA381', 'tangerine', 300], yellow: ['#F5E663', 'yellow', 200], charcoal: ['#3D3B30', 'neutral', 800], slate: ['#4D5061', 'slate', 700] };
  for (const [name, [hex, ramp, step]] of Object.entries(expected)) {
    assert.equal(brand[name].$value, hex, `brand.${name}`);
    assert.equal(palette[ramp][step].$value, hex, `${ramp}.${step}`);
  }
});

test('AIP Blue·Yellow 는 두 테마에서 같은 값이다(브랜드 일관성)', () => {
  const css = dist('tokens.css');
  const darkBlock = css.slice(css.indexOf(':root[data-theme="dark"]'));
  for (const v of ['--aip-color-action-primary-bg', '--aip-color-highlight-mark', '--aip-color-surface-brand']) {
    assert.ok(!new RegExp(`${v}:`).test(darkBlock), `${v} 가 다크에서 바뀐다`);
  }
});

test('예제가 쓰는 aip- 클래스는 전부 CSS 에 정의돼 있다(오타·없는 컴포넌트 방지)', () => {
  const defined = new Set([...allCss.matchAll(/\.(aip-[a-z0-9_-]+)/g)].map((m) => m[1]));
  const missing = [];
  for (const f of examples) {
    const html = read(join('examples', f));
    for (const m of html.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c.startsWith('aip-') && !c.includes('${') && !defined.has(c)) missing.push(`${f}: ${c}`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('예제·인라인 스타일의 var(--aip-*) 는 실제 토큰이다', () => {
  const missing = [];
  const sources = [['examples/examples.css', read('examples/examples.css')], ...examples.map((f) => [f, read(join('examples', f))])];
  for (const [name, text] of sources) {
    for (const m of text.matchAll(/var\((--aip-[a-z0-9-]+)/g)) if (!tokenVars.has(m[1])) missing.push(`${name}: ${m[1]}`);
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('예제 CSS 도 하드코딩 값이 없다(components 와 같은 기준)', () => {
  const css = read('examples/examples.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const bad = css.split('\n').map((line, i) => [i + 1, line.replace(/@media[^{]*/, '')])
    .filter(([, l]) => /#[0-9a-fA-F]{3,8}\b|\brgba?\(|(?<![\w-])\d*\.?\d+px\b|(?<![\w-])\d+m?s\b|z-index:\s*\d/.test(l));
  assert.deepEqual(bad, []);
});

test('aria 참조(aria-controls·labelledby·describedby·for·href#)가 끊기지 않고 id 가 유일하다', () => {
  for (const f of examples) {
    const html = read(join('examples', f));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    assert.deepEqual(dup, [], `${f} 중복 id`);
    const idSet = new Set(ids);
    // icons.js 가 런타임에 넣는 스프라이트 심볼
    const sprite = new Set([...read('examples/icons.js').matchAll(/^\s+'?([a-z-]+)'?:/gm)].map((m) => `i-${m[1]}`));
    const refs = [
      ...[...html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)),
      ...[...html.matchAll(/\sfor="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/data-aip-dialog-open="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]).filter((h) => !sprite.has(h)),
    ];
    const broken = refs.filter((r) => !idSet.has(r) && !sprite.has(r));
    assert.deepEqual([...new Set(broken)], [], `${f} 끊긴 참조`);
  }
});

test('접근성 이름: 아이콘 버튼 aria-label, 이미지 alt, 탭은 패널과 연결', () => {
  for (const f of examples) {
    const html = read(join('examples', f));
    for (const m of html.matchAll(/<(button|a)\b[^>]*class="[^"]*\baip-icon-button\b[^"]*"[^>]*>/g)) assert.match(m[0], /aria-label="[^"]+"/, `${f}: ${m[0].slice(0, 80)}`);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) assert.match(m[0], /\balt="/, `${f}: alt 없음 ${m[0].slice(0, 80)}`);
    for (const m of html.matchAll(/<[^>]+role="tab"[^>]*>/g)) assert.match(m[0], /aria-controls="/, `${f}: 탭에 aria-controls 없음`);
    assert.match(html, /class="aip-skip-link"/, `${f}: skip link 없음`);
    assert.match(html, /<main\b/, `${f}: main 없음`);
  }
});

test('예제 코드에 AIP 문법을 정본처럼 쓰지 않는다(illustrative 표시)', () => {
  for (const f of ['docs.html', 'home.html', 'playground.html']) {
    assert.match(read(join('examples', f)), /illustrative/i, `${f} 에 illustrative 표시가 없다`);
  }
});

test('문서 지도: docs 의 모든 파일이 README 에 연결되고, 문서 사이 상대 링크가 살아 있다', () => {
  const readme = read('README.md');
  for (const d of docs) assert.ok(readme.includes(`docs/${d}`), `README 에 docs/${d} 없음`);
  for (const d of docs) {
    const text = read(join('docs', d));
    for (const m of text.matchAll(/\]\((?!https?:|#)([^)#]+)(?:#[^)]*)?\)/g)) {
      assert.ok(existsSync(join(root, 'docs', m[1])), `docs/${d} → ${m[1]} 링크 끊김`);
    }
  }
});

test('컴포넌트 블록마다 문서에 마크업 계약이 있다', () => {
  const src = readdirSync(join(root, 'components')).filter((f) => f.endsWith('.css')).map((f) => read(join('components', f))).join('\n');
  const blocks = new Set([...src.matchAll(/\.(aip-[a-z0-9-]+?)(?=[\s.:,{>[)])/g)].map((m) => m[1]).filter((c) => !c.includes('__') && !c.includes('--')));
  const docText = docs.map((d) => read(join('docs', d))).join('\n');
  const undocumented = [...blocks].filter((c) => !docText.includes(c));
  assert.deepEqual(undocumented, []);
});

test('다이어그램 개념 9종이 토큰·CSS·Mermaid 에 모두 있다', () => {
  const roles = ['intent', 'runtime', 'execution', 'permission', 'frontend', 'backend', 'data', 'external', 'note'];
  const mermaid = JSON.parse(dist('diagram.mermaid.json'));
  const css = dist('components.css');
  for (const r of roles) {
    assert.ok(tokenVars.has(`--aip-color-diagram-${r}-fill`), `토큰 diagram.${r}`);
    assert.ok(css.includes(`[data-role="${r}"]`), `CSS [data-role="${r}"]`);
    assert.match(mermaid.light.classDefs[r], /^fill:#[0-9A-F]{6},stroke:#[0-9A-F]{6},color:#[0-9A-F]{6}/);
    assert.ok(mermaid.dark.classDefs[r]);
  }
});

test('AIP 가 정하지 않은 라이선스를 이 시스템이 정하지 않는다', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.license, undefined, 'package.json 에 license 를 적지 않는다(AIP 라이선스 미정)');
});
