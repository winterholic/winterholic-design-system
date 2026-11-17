// 매니페스트 검증. 의존성 없이 사람이 읽을 수 있는 오류 목록을 낸다. JSON Schema(../schema)와 같은 규칙.
const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
const isStr = (x) => typeof x === 'string' && x.length > 0;
const frac = (x) => isNum(x) && x >= 0 && x <= 1;
const SEMVER = /^\d+\.\d+\.\d+$/;
const need = (errs, cond, msg) => { if (!cond) errs.push(msg); };

export function validateOrnament(o) {
  const e = [], id = `ornament ${o?.id}`;
  need(e, isStr(o?.id) && /^[a-z0-9-]+$/.test(o.id), `${id}: id 는 소문자-숫자-하이픈`);
  need(e, ['hang', 'perch', 'ground', 'topper'].includes(o.kind), `${id}: kind`);
  need(e, isStr(o.file), `${id}: file`);
  need(e, isNum(o.aspect) && o.aspect > 0.2 && o.aspect < 5, `${id}: aspect`);
  need(e, isNum(o.baseWidth) && o.baseWidth > 0.03 && o.baseWidth < 0.4, `${id}: baseWidth(트리 폭 대비 0.03~0.4)`);
  need(e, o.anchor && frac(o.anchor.x) && frac(o.anchor.y), `${id}: anchor 0~1`);
  need(e, Array.isArray(o.worlds) && o.worlds.length > 0, `${id}: worlds`);
  need(e, ['common', 'world'].includes(o.tier), `${id}: tier`);
  need(e, Array.isArray(o.placements) && o.placements.every((p) => ['hang', 'ground', 'topper'].includes(p)), `${id}: placements`);
  need(e, ['ornaments'].includes(o.layer ?? 'ornaments'), `${id}: layer 는 ornaments`);
  need(e, SEMVER.test(o.version ?? ''), `${id}: version`);
  need(e, isStr(o.license), `${id}: license`);
  return e;
}
export function validateTree(t) {
  const e = [], id = `tree ${t?.id}`;
  need(e, isStr(t?.id), `${id}: id`);
  need(e, isStr(t.file), `${id}: file`);
  need(e, isNum(t.width) && isNum(t.height) && t.width > 0, `${id}: width/height`);
  need(e, isNum(t.aspect) && Math.abs(t.aspect - t.width / t.height) < 0.01, `${id}: aspect 는 width/height 와 같아야 한다`);
  const m = t.mask;
  need(e, m && m.cols > 8 && m.rows > 8 && Array.isArray(m.data) && m.data.length === m.rows && m.data.every((r) => typeof r === 'string' && r.length === m.cols), `${id}: mask 크기`);
  need(e, Array.isArray(t.tags), `${id}: tags`);
  need(e, t.compat && typeof t.compat.worlds === 'object', `${id}: compat.worlds`);
  need(e, t.heightFrac == null || (isNum(t.heightFrac) && t.heightFrac > 0.15 && t.heightFrac < 0.7), `${id}: heightFrac(0.15~0.7)`);
  need(e, SEMVER.test(t.version ?? ''), `${id}: version`);
  return e;
}
export function validateWorld(w) {
  const e = [], id = `world ${w?.id}`;
  need(e, isStr(w?.id), `${id}: id`);
  need(e, w.background && isStr(w.background.file), `${id}: background.file`);
  need(e, w.treeAnchor && frac(w.treeAnchor.x) && frac(w.treeAnchor.y), `${id}: treeAnchor`);
  need(e, isNum(w.treeWidth) && w.treeWidth > 0.3 && w.treeWidth < 0.95, `${id}: treeWidth(트리 최대 폭, 장면 폭 대비 0.3~0.95)`);
  need(e, w.compat && typeof w.compat.trees === 'object', `${id}: compat.trees`);
  need(e, SEMVER.test(w.version ?? ''), `${id}: version`);
  return e;
}
export function validateCatalog(cat, { fileExists } = {}) {
  const e = [];
  const ids = (arr) => new Set(arr.map((x) => x.id));
  for (const [k, arr] of Object.entries({ worlds: cat.worlds, trees: cat.trees, ornaments: cat.ornaments })) {
    need(e, Array.isArray(arr) && arr.length > 0, `catalog.${k} 비어 있음`);
    const seen = new Set();
    for (const x of arr ?? []) { if (seen.has(x.id)) e.push(`${k}: 중복 id ${x.id}`); seen.add(x.id); }
  }
  cat.worlds.forEach((w) => e.push(...validateWorld(w)));
  cat.trees.forEach((t) => e.push(...validateTree(t)));
  cat.ornaments.forEach((o) => e.push(...validateOrnament(o)));
  const treeIds = ids(cat.trees), worldIds = ids(cat.worlds);
  for (const w of cat.worlds) for (const t of Object.keys(w.compat?.trees ?? {})) need(e, treeIds.has(t), `world ${w.id}: compat 의 트리 ${t} 가 카탈로그에 없다`);
  for (const t of cat.trees) for (const w of Object.keys(t.compat?.worlds ?? {})) need(e, worldIds.has(w), `tree ${t.id}: compat 의 세계관 ${w} 가 카탈로그에 없다`);
  for (const o of cat.ornaments) for (const w of o.worlds ?? []) need(e, w === '*' || worldIds.has(w), `ornament ${o.id}: 알 수 없는 세계관 ${w}`);
  // 세계관마다 트리 2종 이상, 장식 8종 이상이 있어야 "조합" 이 의미 있다
  for (const w of cat.worlds) {
    const nt = cat.trees.filter((t) => (w.compat?.trees?.[t.id] ?? t.compat?.worlds?.[w.id]) && (w.compat?.trees?.[t.id] ?? t.compat?.worlds?.[w.id]) !== 'forbidden').length;
    need(e, nt >= 2, `world ${w.id}: 호환 트리가 ${nt}종(최소 2)`);
    const no = cat.ornaments.filter((o) => o.worlds.includes('*') || o.worlds.includes(w.id)).length;
    need(e, no >= 8, `world ${w.id}: 사용 가능한 장식이 ${no}종(최소 8)`);
  }
  if (fileExists) {
    const files = [...cat.worlds.map((w) => w.background.file), ...cat.trees.map((t) => t.file), ...cat.ornaments.map((o) => o.file), ...(cat.effects ?? []).filter((f) => f.file).map((f) => f.file), ...(cat.props ?? []).map((p) => p.file)];
    for (const f of files) need(e, fileExists(f), `파일 없음: ${f}`);
  }
  return e;
}
