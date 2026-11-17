// Merrivoo 조립 엔진 테스트. merrivoo 디렉터리에서 실행: cd merrivoo && node --test ../scripts/merrivoo-engine.test.mjs
// 공개 데모 카탈로그(assets/demo, CC0)만 쓴다. 서비스 에셋에 의존하지 않는다.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import test from 'node:test';
import * as E from '../merrivoo/engine/index.mjs';

const root = process.cwd();
assert.equal(basename(root), 'merrivoo', 'merrivoo 디렉터리에서 실행해야 한다');
const cat = JSON.parse(readFileSync(join(root, 'assets/demo/catalog.json'), 'utf8'));
const world = (id) => cat.worlds.find((w) => w.id === id);
const tree = (id) => cat.trees.find((t) => t.id === id);
const items = (n, pool = cat.ornaments) => Array.from({ length: n }, (_, i) => ({ id: `i${i}`, ornament: pool[(i * 3 + 1) % pool.length], score: Math.max(5, 98 - Math.round((i * 93) / Math.max(1, n - 1))) }));

test('데모 카탈로그가 스키마 규칙과 교차 참조 검증을 통과한다', () => {
  assert.deepEqual(E.validateCatalog(cat, { fileExists: (f) => readFileSync(join(root, 'assets/demo', f)).length > 0 }), []);
});
test('검증기는 잘못된 매니페스트를 잡아낸다', () => {
  const bad = structuredClone(cat);
  bad.ornaments[0].baseWidth = 0.9;
  bad.trees[0].compat.worlds.ghost = 'native';
  bad.worlds[0].compat.trees['no-such'] = 'native';
  const errs = E.validateCatalog(bad);
  assert.ok(errs.some((e) => e.includes('baseWidth')));
  assert.ok(errs.some((e) => e.includes('ghost')));
  assert.ok(errs.some((e) => e.includes('no-such')));
});
test('호환성: 목록에 없는 조합은 forbidden 이고 composeScene 이 거부한다', () => {
  const w = structuredClone(world('demo-meadow')); delete w.compat.trees['demo-round'];
  const t = structuredClone(tree('demo-round')); delete t.compat.worlds['demo-meadow'];
  assert.equal(E.treeCompat(w, t), 'forbidden');
  const c2 = { ...cat, worlds: [w, ...cat.worlds.slice(1)], trees: cat.trees.map((x) => (x.id === t.id ? t : x)) };
  assert.throws(() => E.composeScene(c2, { worldId: w.id, treeId: t.id, ornaments: [] }), /호환되지 않는/);
});
test('장식 호환: 세계관 전용 장식은 다른 세계관에서 걸러진다', () => {
  const c = structuredClone(cat); c.ornaments.push({ ...c.ornaments[0], id: 'only-night', worlds: ['demo-night'], tier: 'world' });
  const s = E.composeScene(c, { worldId: 'demo-meadow', treeId: 'demo-pine', ornaments: [{ id: 'a', ornamentId: 'only-night', score: 50 }, { id: 'b', ornamentId: 'heart', score: 50 }] });
  assert.deepEqual(s.rejected, [{ id: 'a', why: 'world' }]);
  assert.equal(s.layers.filter((l) => l.type === 'ornament').length, 1);
});

for (const t of cat.trees) {
  test(`배치(${t.id}): 장식 0·5·20·50개에서 겹침·실루엣 이탈 없이 최소 크기를 지킨다`, () => {
    for (const n of [0, 5, 20, 50]) {
      const r = E.placeOrnaments(t, items(n), { treePx: 260 });
      const d = r.diagnostics;
      assert.equal(d.placed + d.overflow, n, `${t.id} n=${n} 총합`);
      assert.equal(d.overlapPairsOver25pct, 0, `${t.id} n=${n} 겹침`);
      assert.equal(d.outsideSilhouette, 0, `${t.id} n=${n} 이탈`);
      assert.equal(d.outOfTreeBox, 0);
      assert.ok(n === 0 || d.minOrnamentPx >= 17.5, `${t.id} n=${n} 최소 ${d.minOrnamentPx}px`);
      if (n <= 20) assert.equal(d.overflow, 0, `${t.id} n=${n} 은 전부 들어가야 한다`);
    }
  });
}
test('배치는 결정적이다: 같은 입력·seed 는 같은 결과, seed 가 다르면 달라진다', () => {
  const t = tree('demo-pine');
  const a = E.placeOrnaments(t, items(20), { seed: 'x' }), b = E.placeOrnaments(t, items(20), { seed: 'x' }), c = E.placeOrnaments(t, items(20), { seed: 'y' });
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.placements, c.placements);
});
test('궁합 점수가 높을수록 위쪽에 놓인다(점수 상관이 음수, 최고점은 가장 높은 자리군)', () => {
  const t = tree('demo-pine');
  const list = [95, 80, 60, 40, 15].map((score, i) => ({ id: `p${i}`, ornament: cat.ornaments[i + 1], score }));
  const r = E.placeOrnaments(t, list);
  const v = Object.fromEntries(r.placements.map((p) => [p.score, p.v]));
  for (const [hi, lo] of [[95, 80], [80, 60], [60, 40], [40, 15]]) assert.ok(v[hi] < v[lo], `${hi}점(${v[hi]})이 ${lo}점(${v[lo]})보다 위여야 한다`);
});
test('토퍼는 점수 85 이상 중 허용하는 장식 하나만 차지하고 트리 꼭대기에 놓인다', () => {
  const t = tree('demo-pine');
  const star = cat.ornaments.find((o) => o.id === 'star');
  const r = E.placeOrnaments(t, [{ id: 's1', ornament: star, score: 99 }, { id: 's2', ornament: star, score: 97 }, ...items(6)]);
  const toppers = r.placements.filter((p) => p.zone === 'topper');
  assert.equal(toppers.length, 1);
  assert.equal(toppers[0].id, 's1');
  assert.ok(toppers[0].v < 0.12);
});
test('용량을 넘으면 장식을 지우지 않고 overflow 로 돌려준다', () => {
  const t = tree('demo-pine');
  const r = E.placeOrnaments(t, items(400), { treePx: 260 });
  assert.equal(r.diagnostics.placed + r.diagnostics.overflow, 400);
  assert.ok(r.diagnostics.overflow > 0);
  assert.equal(r.diagnostics.overlapPairsOver25pct, 0);
});
test('트리 정규화 좌표가 장면 좌표로 올바르게 변환된다(밑동 중앙 = treeAnchor)', () => {
  const s = E.composeScene(cat, { worldId: 'demo-meadow', treeId: 'demo-pine', ornaments: items(5), lights: 'off' });
  const t = s.layers.find((l) => l.key === 'tree');
  assert.ok(Math.abs(t.x + t.w / 2 - 0.5) < 1e-6);
  assert.ok(Math.abs(t.y + t.h - 0.82) < 1e-6);
  const sorted = [...s.layers].map((l) => E.LAYER_Z[l.layer]);
  assert.deepEqual(sorted, [...sorted].sort((a, b) => a - b), '레이어 순서');
  for (const l of s.layers.filter((x) => x.type === 'ornament')) assert.ok(l.ax >= t.x && l.ax <= t.x + t.w, '장식 앵커가 트리 폭 안');
});
test('전구 위치는 트리 실루엣 안에 있다', () => {
  const t = tree('demo-pine'); const m = E.decodeMask(t.mask);
  const lights = E.generateLights(t, 'full');
  assert.ok(lights.length >= 8);
  for (const l of lights) assert.ok(E.maskAt(m, l.u, l.v));
  assert.equal(E.generateLights(t, 'off').length, 0);
});
test('fitScene: 휴대폰은 cover, 넓은 화면은 가운데 9:16 무대', () => {
  const phone = E.fitScene(390, 844);
  assert.equal(phone.mode, 'cover'); assert.ok(phone.stageH >= 844 && phone.offsetX <= 0);
  for (const [w, h] of [[360, 800], [430, 932], [320, 568]]) { const f = E.fitScene(w, h); assert.equal(f.mode, 'cover'); assert.ok(f.stageW >= w - 0.5 && f.stageH >= h - 0.5); }
  for (const [w, h] of [[768, 1024], [820, 1180]]) { const f = E.fitScene(w, h); assert.equal(f.mode, 'stage'); assert.ok(Math.abs(f.stageW / f.stageH - 9 / 16) < 1e-6); assert.ok(f.sideW > 0); }
});
test('캔버스 렌더러는 모든 레이어를 순서대로 그린다(모의 컨텍스트)', () => {
  const calls = [];
  const grad = { addColorStop() {} };
  const ctx = new Proxy({}, { get: (_, k) => (k === 'createRadialGradient' ? () => grad : (...a) => calls.push([k, a.length])), set: () => true });
  const s = E.composeScene(cat, { worldId: 'demo-meadow', treeId: 'demo-pine', ornaments: items(5), effectIds: [] });
  const imgs = new Map(E.collectImageSrcs(s).map((src) => [src, {}]));
  E.drawScene(ctx, s, imgs, { width: 1080, height: 1920 });
  assert.ok(calls.filter(([k]) => k === 'drawImage').length >= 1 + 1 + 5);
});
