// Scene Composition: 카탈로그 + 상태 → 순수 데이터(레이어 목록). DOM·React·Canvas 렌더러가 같은 결과를 그린다.
import { treeCompat, ornamentCompat } from './compat.mjs';
import { placeOrnaments } from './placement.mjs';
import { decodeMask, maskAt, rowSpans } from './mask.mjs';
import { mulberry32, hashString } from './prng.mjs';

export const SCENE_SIZE = { w: 1080, h: 1920 };
// z-index 토큰(--mv-z-index-scene-*)과 같은 값. 렌더러는 sort 용으로만 쓴다
export const LAYER_Z = { background: 0, environment: 10, atmosphere: 20, shadow: 29, tree: 30, lighting: 40, ornaments: 50, foreground: 60, grade: 65, 'fx-top': 70 };
export const LAYER_ORDER = Object.keys(LAYER_Z);

function url(catalog, file) { return `${catalog.assetBase ?? ''}${file}`; }

/** 트리 실루엣을 따라 전구 위치를 만든다(Tree Lighting). u,v 는 트리 정규화 좌표 */
export function generateLights(tree, density = 'full', seed = 'lights') {
  if (density === 'off') return [];
  const m = decodeMask(tree.mask);
  const spans = rowSpans(m);
  const TA = tree.height / tree.width;
  const rng = mulberry32(hashString(`${seed}:${tree.id}`));
  const tiers = density === 'soft' ? 3 : 6;
  const pts = [];
  for (let t = 0; t < tiers; t++) {
    const vBase = 0.16 + (t * 0.66) / tiers;
    const row = spans[Math.min(m.rows - 1, Math.floor(vBase * m.rows))];
    if (!row) continue;
    const [l, r] = [row[0] + 0.05, row[1] - 0.05];
    const n = Math.max(3, Math.round((r - l) / (density === 'soft' ? 0.15 : 0.09)));
    for (let i = 0; i < n; i++) {
      const u = l + ((r - l) * (i + 0.5)) / n;
      const v = vBase + 0.03 * Math.sin((Math.PI * (u - l)) / (r - l));
      if (!maskAt(m, u, v)) continue;
      pts.push({ u: +u.toFixed(4), v: +v.toFixed(4), phase: +rng().toFixed(3), tone: i % 3 });
    }
  }
  return pts;
}

/** 장면 폭·높이 대비 트리 크기(0~1). composeScene 과 화면 쪽 px 계산이 같은 값을 쓴다 */
export function treeSize(world, tree) {
  const { w: W, h: H } = SCENE_SIZE;
  const wPx = Math.min((tree.heightFrac ?? 0.46) * H * tree.aspect, world.treeWidth * W);
  return { w: wPx / W, h: wPx / tree.aspect / H };
}

/**
 * @param catalog {assetBase, worlds, trees, ornaments, effects?, props?}
 * @param state   {worldId, treeId, ornaments:[{id, ornamentId, score}], effectIds?, lights?, seed?, treePx?}
 */
export function composeScene(catalog, state, options = {}) {
  const world = catalog.worlds.find((w) => w.id === state.worldId);
  const tree = catalog.trees.find((t) => t.id === state.treeId);
  if (!world) throw new Error(`알 수 없는 세계관: ${state.worldId}`);
  if (!tree) throw new Error(`알 수 없는 트리: ${state.treeId}`);
  const compat = treeCompat(world, tree);
  if (compat === 'forbidden') throw new Error(`호환되지 않는 조합: ${world.id} × ${tree.id}`);

  const { w: W, h: H } = SCENE_SIZE;
  const layers = [];
  const push = (l) => layers.push(l);

  push({ key: 'bg', layer: 'background', type: 'image', src: url(catalog, world.background.file), x: 0, y: 0, w: 1, h: 1, z: 0 });
  for (const [i, p] of (world.environment ?? []).entries()) push(propLayer(catalog, p, 'environment', i, W, H));

  for (const id of state.effectIds ?? world.effects ?? []) {
    const fx = (catalog.effects ?? []).find((e) => e.id === id);
    if (!fx) continue;
    push(fx.type === 'particles'
      ? { key: `fx-${fx.id}`, layer: fx.layer ?? 'atmosphere', type: 'particles', kind: fx.kind, count: fx.count, opacity: fx.opacity ?? 1, z: 0 }
      : { key: `fx-${fx.id}`, layer: fx.layer ?? 'atmosphere', type: 'image', src: url(catalog, fx.file), x: 0, y: 0, w: 1, h: 1, blend: fx.blend ?? 'screen', opacity: fx.opacity ?? 0.8, z: 0 });
  }

  // 트리: 밑동 중앙이 world.treeAnchor
  // 트리 크기: 목표 높이(heightFrac, 장면 높이 대비)를 따르되 폭은 world.treeWidth(장면 폭 대비) 를 넘지 않는다
  const ts = treeSize(world, tree);
  const treeWpx = ts.w * W;
  const treeHpx = ts.h * H;
  const baseY = tree.baseAnchor?.y ?? 1;
  const treeLeft = world.treeAnchor.x * W - treeWpx / 2;
  const treeTop = world.treeAnchor.y * H - treeHpx * baseY;
  const tx = (u) => treeLeft + u * treeWpx, ty = (v) => treeTop + v * treeHpx;
  const sh = world.groundShadow ?? { rx: 0.5, ry: 0.05, opacity: 1 };
  push({ key: 'tree-shadow', layer: 'shadow', type: 'shadow', cx: world.treeAnchor.x, cy: world.treeAnchor.y + 0.004, rx: (treeWpx * sh.rx) / W, ry: (treeWpx * sh.ry) / H, opacity: sh.opacity ?? 1, z: 0 });
  push({ key: 'tree', layer: 'tree', type: 'image', src: url(catalog, tree.file), x: treeLeft / W, y: treeTop / H, w: treeWpx / W, h: treeHpx / H, z: 0 });

  const lightsMode = state.lights ?? 'full';
  const lights = generateLights(tree, lightsMode, state.seed ?? 'lights');
  if (lights.length) {
    push({ key: 'lights', layer: 'lighting', type: 'lights', color: world.light?.color ?? '#FFE2A8',
      points: lights.map((p) => ({ x: tx(p.u) / W, y: ty(p.v) / H, r: (treeWpx * 0.05) / W, phase: p.phase, tone: p.tone })), z: 0 });
  }

  // 장식: 호환되지 않는 것은 걸러서 진단에 남긴다
  const byId = new Map(catalog.ornaments.map((o) => [o.id, o]));
  const items = [], rejected = [];
  for (const it of state.ornaments ?? []) {
    const orn = byId.get(it.ornamentId);
    if (!orn) { rejected.push({ id: it.id, why: 'unknown-ornament' }); continue; }
    const c = ornamentCompat(orn, world, tree);
    if (!c.ok) { rejected.push({ id: it.id, why: c.why }); continue; }
    items.push({ id: it.id, ornament: orn, score: it.score });
  }
  const placement = placeOrnaments(tree, items, { seed: state.seed ?? 'merrivoo', treePx: state.treePx ?? options.treePx ?? 260 });
  for (const p of placement.placements) {
    const orn = byId.get(p.ornamentId);
    const wPx = p.w * treeWpx, hPx = wPx / orn.aspect;
    push({ key: `orn-${p.id}`, layer: 'ornaments', type: 'ornament', id: p.id, ornamentId: p.ornamentId, src: url(catalog, orn.file),
      ax: tx(p.u) / W, ay: ty(p.v) / H, w: wPx / W, h: hPx / H, anchor: p.anchor, rotate: p.rotate, hero: p.hero, zone: p.zone, score: p.score, z: p.z });
  }

  for (const [i, p] of (world.foreground ?? []).entries()) push(propLayer(catalog, p, 'foreground', i, W, H));
  if (world.grade?.tint) push({ key: 'grade', layer: 'grade', type: 'grade', color: world.grade.tint, blend: world.grade.blend ?? 'multiply', z: 0 });

  layers.sort((a, b) => LAYER_Z[a.layer] - LAYER_Z[b.layer] || a.z - b.z);
  return {
    size: SCENE_SIZE, worldId: world.id, treeId: tree.id, compat, theme: world.theme ?? world.id, layers,
    overflow: placement.overflow, rejected, densityFactor: placement.densityFactor, diagnostics: placement.diagnostics,
    tree: { x: treeLeft / W, y: treeTop / H, w: treeWpx / W, h: treeHpx / H, anchorX: world.treeAnchor.x, anchorY: world.treeAnchor.y },
  };
}

function propLayer(catalog, p, layer, i, W, H) {
  const prop = (catalog.props ?? []).find((x) => x.id === p.propId);
  if (!prop) throw new Error(`알 수 없는 소품: ${p.propId}`);
  const wPx = p.w * W, hPx = wPx / prop.aspect;
  return { key: `${layer}-${p.propId}-${i}`, layer, type: 'image', src: url(catalog, prop.file), x: (p.x * W - wPx * (prop.anchor?.x ?? 0.5)) / W, y: (p.y * H - hPx * (prop.anchor?.y ?? 1)) / H, w: wPx / W, h: hPx / H, z: p.z ?? i };
}
