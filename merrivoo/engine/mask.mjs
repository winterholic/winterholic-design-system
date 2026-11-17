// 트리 알파 마스크. 좌표는 트리 정규화 (u,v) ∈ [0,1]², u 는 트리 폭, v 는 트리 높이 기준.
export function decodeMask(mask) {
  const { cols, rows, data } = mask;
  const cells = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cells[y * cols + x] = data[y].charCodeAt(x) === 49 ? 1 : 0;
  return { cols, rows, cells };
}
export function maskAt(m, u, v) {
  if (u < 0 || v < 0 || u >= 1 || v >= 1) return false;
  const x = Math.floor(u * m.cols), y = Math.floor(v * m.rows);
  return m.cells[y * m.cols + x] === 1;
}
/** 행별 [왼쪽 끝, 오른쪽 끝] (u). 비어 있는 행은 null */
export function rowSpans(m) {
  const spans = [];
  for (let y = 0; y < m.rows; y++) {
    let l = -1, r = -1;
    for (let x = 0; x < m.cols; x++) if (m.cells[y * m.cols + x]) { if (l < 0) l = x; r = x; }
    spans.push(l < 0 ? null : [l / m.cols, (r + 1) / m.cols]);
  }
  return spans;
}
export function spanAt(spans, rows, v) {
  const y = Math.min(rows - 1, Math.max(0, Math.floor(v * rows)));
  return spans[y];
}
/** 직사각형 안쪽 표본 중 마스크 안에 있는 비율 */
export function insideFraction(m, x0, y0, x1, y1, n = 5) {
  let hit = 0, tot = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const u = x0 + ((x1 - x0) * (i + 0.5)) / n, v = y0 + ((y1 - y0) * (j + 0.5)) / n;
    tot++; if (maskAt(m, u, v)) hit++;
  }
  return hit / tot;
}
