// 호환성: 세계관×트리, 장식×(세계관·트리). 모든 조합을 허용하지 않는다.
/** @returns {'native'|'allowed'|'forbidden'} */
export function treeCompat(world, tree) {
  const w = world.compat?.trees?.[tree.id];
  const t = tree.compat?.worlds?.[world.id];
  if (w === 'forbidden' || t === 'forbidden') return 'forbidden';
  if (w === 'native' || t === 'native') return 'native';
  if (w === 'allowed' || t === 'allowed') return 'allowed';
  return 'forbidden'; // 명시하지 않은 조합은 허용하지 않는다(목록이 곧 계약)
}
export function ornamentCompat(orn, world, tree) {
  const worlds = orn.worlds ?? ['*'];
  if (!worlds.includes('*') && !worlds.includes(world.id)) return { ok: false, why: 'world' };
  const tags = new Set(tree.tags ?? []);
  if ((orn.excludesTreeTags ?? []).some((t) => tags.has(t))) return { ok: false, why: 'tree-tag-excluded' };
  const req = orn.requiresTreeTags ?? [];
  if (req.length && !req.some((t) => tags.has(t))) return { ok: false, why: 'tree-tag-required' };
  return { ok: true };
}
export function availableTrees(catalog, world) {
  return catalog.trees.filter((t) => treeCompat(world, t) !== 'forbidden');
}
export function availableOrnaments(catalog, world, tree) {
  return catalog.ornaments.filter((o) => ornamentCompat(o, world, tree).ok);
}
