// 장식 배치. 궁합 점수 → 트리 위 위치. 같은 입력·seed 면 같은 결과.
// 좌표계: 트리 정규화 (u,v). u 는 트리 폭, v 는 트리 높이 기준 0~1. 장식 폭 w 는 "트리 폭의 비율".
import { decodeMask, maskAt, rowSpans, spanAt, insideFraction } from './mask.mjs';
import { mulberry32, hashString } from './prng.mjs';

export const PLACEMENT_DEFAULTS = {
  treePx: 260,          // 화면에서 트리가 차지하는 CSS px 폭. 장식 최소 크기 판정 기준
  minRenderPx: 18,      // 장식이 이보다 작아지면 줄이지 않고 overflow 로 넘긴다
  maxOverlap: 0.1,      // 장식 상자 겹침 허용 비율(작은 쪽 면적 기준)
  relaxedOverlap: 0.2,  // 최소 크기에서도 안 들어갈 때만 쓰는 완화 값
  minInside: 0.62,      // 장식 상자의 몇 %가 트리 실루엣 안에 있어야 하는가
  seed: 'merrivoo',
  baseWidth: 0.13,      // ornament.baseWidth 가 없을 때 트리 폭 대비 기본 폭
  densityStep: 0.93,
  gridU: 56,
};

const maskCache = new WeakMap();
function treeGeom(tree) {
  let g = maskCache.get(tree);
  if (!g) {
    const mask = decodeMask(tree.mask);
    const spans = rowSpans(mask);
    const rows = spans.map((sp, i) => (sp ? i : -1)).filter((i) => i >= 0);
    g = { mask, spans, TA: tree.height / tree.width, vTop: rows[0] / mask.rows, vBot: (rows[rows.length - 1] + 1) / mask.rows };
    // 높이 정규화 범위: 실루엣이 있는 첫 행~마지막 행
    g.vSpan = Math.max(1e-3, g.vBot - g.vTop);
    maskCache.set(tree, g);
  }
  return g;
}

/** 슬롯의 중요도 P(0~1): 높이가 72%, 가운데 여부가 28%. "점수가 높을수록 위쪽" 이 먼저 읽히고, 같은 높이에서는 가운데가 더 좋은 자리다 */
export function prominence(g, u, v) {
  const span = spanAt(g.spans, g.mask.rows, v);
  if (!span) return 0;
  const half = Math.max((span[1] - span[0]) / 2, 1e-3);
  const cx = (span[0] + span[1]) / 2;
  const rel = Math.min(1, Math.abs(u - cx) / half);
  const h = Math.min(1, Math.max(0, (v - g.vTop) / g.vSpan));
  return 0.72 * (1 - h) + 0.28 * (1 - rel);
}
export const targetProminence = (score) => 0.06 + 0.9 * Math.pow(Math.min(100, Math.max(0, score)) / 100, 1.15);
export const sizeMultiplier = (score) => 0.92 + 0.3 * (Math.min(100, Math.max(0, score)) / 100);

export function footprint(orn, u, v, w, TA, anchor) {
  const a = anchor ?? orn.anchor ?? { x: 0.5, y: 0.04 };
  const dh = w / orn.aspect / TA;
  const x0 = u - a.x * w, y0 = v - a.y * dh;
  return { x0, y0, x1: x0 + w, y1: y0 + dh };
}
function overlapRatio(a, b) {
  const ix = Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0));
  const iy = Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const inter = ix * iy;
  if (inter <= 0) return 0;
  return inter / Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
}

const GROUND_SLOTS = [
  [0.14, 1.03], [0.86, 1.03], [0.3, 1.05], [0.7, 1.05], [0.04, 1.06], [0.96, 1.06], [0.22, 1.1], [0.78, 1.1],
];

/**
 * @param tree  트리 manifest (mask 필수)
 * @param items [{id, ornament, score(0~100)}]
 * @returns {{placements, overflow, densityFactor, diagnostics}}
 */
export function placeOrnaments(tree, items, options = {}) {
  const o = { ...PLACEMENT_DEFAULTS, ...options };
  const g = treeGeom(tree);
  const { mask, spans, TA } = g;
  const sorted = [...items].sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
  const rngBase = hashString(`${o.seed}:${tree.id}:${sorted.map((i) => `${i.id}:${i.score}`).join(',')}`);

  // 후보 격자: 트리 안쪽 점. 물리 간격이 u,v 에서 같도록 격자 높이를 TA 로 맞춘다
  const GU = o.gridU, GV = Math.round(GU * TA);
  const cands = [];
  for (let gy = 0; gy < GV; gy++) for (let gx = 0; gx < GU; gx++) {
    const u = (gx + 0.5) / GU, v = (gy + 0.5) / GV;
    if (!maskAt(mask, u, v)) continue;
    cands.push({ u, v, P: prominence(g, u, v) });
  }
  const treeTopV = tree.topAnchor?.y ?? 0.03;
  const minW = o.minRenderPx / o.treePx;

  function attempt(f, maxOverlap) {
    const rng = mulberry32(rngBase);
    const placed = [];
    const left = [];
    const groundUsed = new Set();
    // 1) 토퍼: 점수 85 이상 중 토퍼를 허용하는 장식 하나. 다른 장식보다 먼저 자리를 잡아 겹침을 피한다
    const topperItem = sorted.find((it) => it.score >= 85 && it.ornament.placements?.includes('topper'));
    if (topperItem) {
      const orn = topperItem.ornament;
      const w = (orn.baseWidth ?? o.baseWidth) * f * sizeMultiplier(topperItem.score) * 1.45, a = { x: 0.5, y: 1 };
      const v = treeTopV + 0.02;
      placed.push({ it: topperItem, u: 0.5, v, w, anchor: a, zone: 'topper', P: 1, fp: footprint(orn, 0.5, v, w, TA, a) });
    }
    for (const it of sorted) {
      if (it === topperItem) continue;
      const orn = it.ornament;
      const base = (orn.baseWidth ?? o.baseWidth) * f * sizeMultiplier(it.score);
      let best = null;
      // 2) 바닥(구석): 낮은 점수이면서 바닥 배치를 허용하는 장식
      if (!best && it.score < 35 && orn.placements?.includes('ground')) {
        for (let gi = 0; gi < GROUND_SLOTS.length; gi++) {
          if (groundUsed.has(gi)) continue;
          const [u, v] = GROUND_SLOTS[gi];
          const w = base * 1.05, a = orn.groundAnchor ?? { x: 0.5, y: 1 };
          const fp = footprint(orn, u, v, w, TA, a);
          if (placed.some((p) => overlapRatio(fp, p.fp) > maxOverlap)) continue;
          groundUsed.add(gi);
          best = { u, v, w, anchor: a, zone: 'ground', P: 0, fp };
          break;
        }
      }
      // 3) 트리 걸이
      if (!best) {
        const Pt = targetProminence(it.score);
        let bestCost = Infinity;
        for (const c of cands) {
          const fp = footprint(orn, c.u, c.v, base, TA);
          if (fp.x0 < -0.06 || fp.x1 > 1.06) continue;
          if (insideFraction(mask, fp.x0, fp.y0, fp.x1, fp.y1, 7) < o.minInside) continue;
          let ov = 0;
          for (const p of placed) { const r = overlapRatio(fp, p.fp); if (r > ov) ov = r; if (ov > maxOverlap) break; }
          if (ov > maxOverlap) continue;
          const cost = Math.abs(c.P - Pt) * 3 + ov * 4 + rng() * 0.07;
          if (cost < bestCost) { bestCost = cost; best = { u: c.u, v: c.v, w: base, anchor: orn.anchor ?? { x: 0.5, y: 0.04 }, zone: 'hang', P: c.P, fp }; }
        }
      }
      if (!best) { left.push(it); continue; }
      placed.push({ it, ...best });
    }
    return { placed, left };
  }

  // 밀도 단계: 장식이 적으면 크게 시작하고, 전부 들어갈 때까지 줄여 간다.
  // 최소 크기는 가늘고 긴 장식(고드름·열쇠)을 위해 폭이 아니라 긴 변으로 잰다. 최소 크기에서도 안 들어가면 겹침 완화 → 그래도 안 되면 overflow
  const longSide = (orn) => Math.max(1, 1 / orn.aspect);
  const fLimit = Math.min(1, Math.max(0.3, ...items.map((i) => minW / ((i.ornament.baseWidth ?? o.baseWidth) * sizeMultiplier(i.score) * longSide(i.ornament)))));
  const f0 = Math.min(1.5, Math.max(1, 1.7 - 0.04 * items.length));
  let f = f0, res = attempt(f, o.maxOverlap);
  while (res.left.length && f * o.densityStep >= fLimit) { f *= o.densityStep; res = attempt(f, o.maxOverlap); }
  if (res.left.length) res = attempt(f, o.relaxedOverlap);

  const placements = res.placed.map((p) => {
    const rng = mulberry32(hashString(`${rngBase}:${p.it.id}`));
    return {
      id: p.it.id, ornamentId: p.it.ornament.id, u: round(p.u), v: round(p.v), w: round(p.w), anchor: p.anchor,
      rotate: p.zone === 'hang' ? round((rng() - 0.5) * 12, 1) : 0,
      z: p.zone === 'topper' ? 9999 : Math.round(p.v * 1000), zone: p.zone, P: round(p.P), score: p.it.score, hero: p.it.score >= 90,
    };
  });
  const overflow = res.left.map((i) => ({ id: i.id, ornamentId: i.ornament.id, score: i.score }));
  const out = { placements, overflow, densityFactor: round(f, 3) };
  out.diagnostics = diagnose(tree, items, out, o);
  return out;
}
const round = (x, d = 4) => Math.round(x * 10 ** d) / 10 ** d;

/** 배치 품질 측정: 겹침·실루엣 이탈·최소 크기. 테스트와 검증 화면이 같이 쓴다 */
export function diagnose(tree, items, result, options = {}) {
  const o = { ...PLACEMENT_DEFAULTS, ...options };
  const g = treeGeom(tree);
  const byId = new Map(items.map((i) => [i.id, i.ornament]));
  const fps = result.placements.map((p) => ({ p, fp: footprint(byId.get(p.id), p.u, p.v, p.w, g.TA, p.anchor) }));
  let maxOverlap = 0, overlaps = 0, outside = 0, worstInside = 1, outOfBox = 0;
  for (let i = 0; i < fps.length; i++) {
    const a = fps[i];
    if (a.p.zone === 'hang') {
      const ins = insideFraction(g.mask, a.fp.x0, a.fp.y0, a.fp.x1, a.fp.y1, 7);
      worstInside = Math.min(worstInside, ins);
      if (ins < o.minInside - 0.05) outside++;
      if (a.fp.x0 < -0.08 || a.fp.x1 > 1.08 || a.fp.y0 < -0.02) outOfBox++;
    }
    for (let j = i + 1; j < fps.length; j++) {
      const r = overlapRatio(a.fp, fps[j].fp);
      if (r > maxOverlap) maxOverlap = r;
      if (r > 0.25) overlaps++;
    }
  }
  const minPxSide = fps.length ? Math.min(...fps.map((x) => Math.max(x.p.w, x.p.w / byId.get(x.p.id).aspect) * o.treePx)) : Infinity;
  return {
    requested: items.length, placed: result.placements.length, overflow: result.overflow.length,
    maxOverlap: round(maxOverlap, 3), overlapPairsOver25pct: overlaps, outsideSilhouette: outside, worstInsideFraction: round(worstInside, 3), outOfTreeBox: outOfBox,
    minOrnamentPx: fps.length ? round(minPxSide, 1) : 0, minRenderPx: o.minRenderPx,
    pass: outside === 0 && outOfBox === 0 && overlaps === 0 && (!fps.length || minPxSide >= o.minRenderPx - 0.5),
  };
}
