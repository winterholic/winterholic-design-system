// Merrivoo 디자인 시스템 정적 검사. merrivoo 디렉터리에서: cd merrivoo && node --test ../scripts/merrivoo-design-system.test.mjs (npm test 가 빌드 후 호출)
// 막는 것: 산출물 누락, 대비 실패, 예제가 없는 클래스·토큰을 쓰는 것, 문서 링크 끊김, 공개 저장소에 개인 경로·폰트 파일·서비스 참조가 섞이는 것.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
assert.equal(basename(root), 'merrivoo', 'merrivoo 디렉터리에서 실행해야 한다');
const read = (p) => readFileSync(join(root, p), 'utf8');
const walk = (d) => readdirSync(join(root, d)).flatMap((n) => { const p = join(d, n); return statSync(join(root, p)).isDirectory() ? (n === 'node_modules' ? [] : walk(p)) : [p]; });
const tokensCss = read('dist/tokens.css');
const tokenVars = new Set(tokensCss.match(/--mv-[a-z0-9-]+(?=:)/g));

test('빌드 산출물이 있고 대비 검사가 전부 통과했다', () => {
  for (const f of ['tokens.css', 'typography.css', 'components.css', 'tokens.js', 'tokens.d.ts', 'tailwind.preset.cjs', 'tokens.scss', 'tokens.figma.json', 'contrast-report.json', 'design-system.config.json']) assert.ok(existsSync(join(root, 'dist', f)), `dist/${f} 없음`);
  const rep = JSON.parse(read('dist/contrast-report.json'));
  assert.ok(rep.length >= 80);
  assert.deepEqual(rep.filter((r) => !r.pass), []);
  assert.ok(rep.some((r) => r.mode === 'dark') && rep.some((r) => r.mode === 'light'));
});
test('세계관 테마가 tokens.css 에 있고 허용 토큰만 바꾼다', () => {
  for (const w of ['snow-village', 'star-colony', 'night-office']) {
    const m = tokensCss.match(new RegExp(`\\[data-world="${w}"\\] \\{([^}]*)\\}`));
    assert.ok(m, `${w} 블록`);
    for (const v of m[1].match(/--mv-[a-z0-9-]+(?=:)/g)) assert.ok(['--mv-color-scene-glow', '--mv-color-scene-ground-shadow', '--mv-color-scene-tint', '--mv-color-border-gold'].includes(v), `${w}: 허용되지 않은 ${v}`);
  }
});
test('기계 판독 설정이 레지스트리·테마·레이아웃을 담는다', () => {
  const c = JSON.parse(read('dist/design-system.config.json'));
  assert.equal(c.prefix, 'mv');
  assert.ok(c.components.length >= 14);
  assert.deepEqual(c.themes.worlds.sort(), ['night-office', 'snow-village', 'star-colony']);
  assert.deepEqual(c.layout.verifiedViewports, ['360x800', '390x844', '430x932', '768x1024', '820x1180']);
  assert.ok(c.tokens.semantic.scene.length >= 5 && c.rules.length >= 10);
});
test('컴포넌트 CSS 에는 hex·임의 px·z-index 숫자가 없다', () => {
  const css = read('dist/components.css').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).length, 0);
  assert.equal((css.match(/z-index:\s*-?\d/g) ?? []).length, 0);
});
test('예제가 쓰는 mv-* 클래스와 --mv-* 변수가 실제로 있다', () => {
  const css = read('dist/components.css') + read('dist/typography.css');
  const classes = new Set(css.match(/\.mv-[a-z0-9_-]+/g).map((c) => c.slice(1)));
  const html = read('examples/preview.html');
  for (const c of new Set((html.match(/\bmv-[a-z0-9_-]+/g) ?? []).filter((c) => !c.startsWith('mv-color') && !c.startsWith('mv-score)')))) assert.ok(classes.has(c), `클래스 ${c} 없음`);
  for (const v of new Set([...html.matchAll(/var\((--mv-[a-z0-9-]+)/g), ...read('examples/preview.css').matchAll(/var\((--mv-[a-z0-9-]+)/g)].map((m) => m[1]).filter((v) => !v.endsWith('-')))) assert.ok(tokenVars.has(v), `변수 ${v} 없음`);
});
test('문서 링크가 끊기지 않았고 문서 지도에 전부 있다', () => {
  const docs = walk('docs').filter((f) => f.endsWith('.md'));
  assert.ok(docs.length >= 9);
  for (const f of [...docs, 'README.md']) {
    for (const m of read(f).matchAll(/\]\((?!https?:)([^)#]+)(?:#[^)]*)?\)/g)) {
      const target = join(f.startsWith('docs') ? 'docs' : '.', m[1]);
      assert.ok(existsSync(join(root, target)), `${f}: 링크 대상 없음 ${m[1]}`);
    }
  }
  const readme = read('README.md');
  for (const f of docs) assert.ok(readme.includes(basename(f)), `README 문서 지도에 ${basename(f)} 없음`);
});
test('공개 저장소 위생: 개인 경로·폰트 파일·비밀·서비스 파일 참조가 없다', () => {
  const files = walk('.').filter((f) => !f.startsWith('dist/') || f.endsWith('.css') || f.endsWith('.json'));
  assert.equal(files.filter((f) => /\.(woff2?|ttf|otf|eot)$/i.test(f)).length, 0, '폰트 파일 금지');
  for (const f of files.filter((f) => /\.(md|mjs|js|json|css|html|svg|py|ts)$/.test(f))) {
    const t = read(f);
    assert.ok(!/\/Users\/[a-z]/i.test(t), `${f}: 개인 경로`);
    assert.ok(!/(api[_-]?key|secret|password)\s*[:=]\s*['"][^'"]{8,}/i.test(t), `${f}: 비밀 의심`);
    assert.ok(!/\.\.\/\.\.\/Merrivoo|Projects\/Merrivoo|vendor\/merrivoo/i.test(t) || f.startsWith('docs/'), `${f}: 서비스 저장소 참조`);
  }
});
test('package.json exports 가 실제 파일을 가리킨다', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const [k, v] of Object.entries(pkg.exports)) if (!v.includes('*')) assert.ok(existsSync(join(root, v)), `${k} → ${v}`);
});
