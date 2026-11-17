// 공개 데모 에셋 생성기. 이 저장소가 직접 그린 단순 SVG(CC0)라 라이선스가 깨끗하다. 서비스용 일러스트가 아니다.
// 사용: node assets/demo/build-demo.mjs  → assets/demo/*.svg, assets/demo/catalog.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCatalog } from '../../engine/index.mjs';

const OUT = dirname(fileURLToPath(import.meta.url));
const write = (name, text) => writeFileSync(join(OUT, name), text);
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;

// ---- 배경 ----
const bg = (id, top, mid, ground) => svg(540, 960, `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${mid}"/></linearGradient></defs><rect width="540" height="960" fill="url(#s)"/><ellipse cx="120" cy="620" rx="300" ry="70" fill="${ground}" opacity=".7"/><ellipse cx="460" cy="630" rx="280" ry="60" fill="${ground}" opacity=".8"/><rect y="595" width="540" height="365" fill="${ground}"/><ellipse cx="270" cy="790" rx="190" ry="34" fill="#ffffff" opacity=".35"/>`);
write('demo-meadow.svg', bg('meadow', '#F7D9B8', '#FBEBD3', '#E7EEF6'));
write('demo-night.svg', bg('night', '#1D2347', '#3B4478', '#CBD6EA'));

// ---- 트리: 다각형 목록으로 그리고, 같은 다각형으로 마스크를 계산한다 ----
const COLS = 48;
const trees = {
  'demo-pine': { w: 400, h: 500, fill: '#3F5B3A', tags: ['classic', 'conifer'], polys: [
    [[200, 10], [290, 150], [110, 150]], [[200, 90], [330, 270], [70, 270]], [[200, 190], [370, 390], [30, 390]], [[185, 380], [215, 380], [215, 470], [185, 470]]], trunk: 3 },
  'demo-round': { w: 400, h: 460, fill: '#5E7C4F', tags: ['organic'], polys: [circle(200, 190, 175, 28), [[185, 360], [215, 360], [215, 450], [185, 450]]], trunk: 1 },
  'demo-stack': { w: 400, h: 440, fill: '#B8863B', tags: ['absurd', 'stack'], polys: [[[170, 10], [230, 10], [230, 70], [170, 70]], [[120, 70], [280, 70], [280, 150], [120, 150]], [[70, 150], [330, 150], [330, 250], [70, 250]], [[20, 250], [380, 250], [380, 400], [20, 400]]], trunk: -1 },
};
function circle(cx, cy, r, n) { return Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI)]); }
function inPoly(x, y, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; }
const treeMeta = [];
for (const [id, t] of Object.entries(trees)) {
  write(`${id}.svg`, svg(t.w, t.h, t.polys.map((p, i) => `<polygon points="${p.map((q) => q.join(',')).join(' ')}" fill="${i === t.trunk ? '#6B4A2B' : t.fill}"/>`).join('')));
  const rows = Math.round((COLS * t.h) / t.w);
  const data = Array.from({ length: rows }, (_, y) => Array.from({ length: COLS }, (_, x) => {
    const px = ((x + 0.5) / COLS) * t.w, py = ((y + 0.5) / rows) * t.h;
    return t.polys.some((p, i) => i !== t.trunk && inPoly(px, py, p)) ? '1' : '0';
  }).join(''));
  data[rows - 1] = '0'.repeat(COLS); data[rows - 2] = '0'.repeat(COLS);
  treeMeta.push({ id, name: id, version: '1.0.0', file: `${id}.svg`, width: t.w, height: t.h, aspect: +(t.w / t.h).toFixed(4), heightFrac: 0.46, baseAnchor: { x: 0.5, y: 1 }, topAnchor: { x: 0.5, y: 0.03 }, mask: { cols: COLS, rows, data }, tags: t.tags, compat: { worlds: { 'demo-meadow': 'native', 'demo-night': id === 'demo-stack' ? 'allowed' : 'native' } }, license: 'CC0-1.0' });
}

// ---- 장식(걸이 고리 포함) ----
const hook = (cx) => `<circle cx="${cx}" cy="7" r="5" fill="none" stroke="#C9A24B" stroke-width="3"/>`;
const orn = {
  ball: ['#B3263A', (c) => `${hook(c)}<circle cx="${c}" cy="48" r="38" fill="#B3263A"/><ellipse cx="${c - 12}" cy="34" rx="9" ry="6" fill="#fff" opacity=".4"/>`, 80, 90, ['hang']],
  'ball-gold': ['#D9B36A', (c) => `${hook(c)}<circle cx="${c}" cy="48" r="38" fill="#D9B36A"/><ellipse cx="${c - 12}" cy="34" rx="9" ry="6" fill="#fff" opacity=".45"/>`, 80, 90, ['hang']],
  star: ['#E8C14F', (c) => `${hook(c)}<polygon points="${starPts(c, 52, 42, 20)}" fill="#E8C14F"/>`, 100, 100, ['hang', 'topper']],
  heart: ['#C2334F', (c) => `${hook(c)}<path d="M${c} 82 C${c - 48} 44 ${c - 34} 14 ${c} 36 C${c + 34} 14 ${c + 48} 44 ${c} 82Z" fill="#C2334F"/>`, 100, 96, ['hang']],
  gift: ['#2F6B4A', (c) => `${hook(c)}<rect x="${c - 34}" y="30" width="68" height="56" rx="4" fill="#2F6B4A"/><rect x="${c - 6}" y="30" width="12" height="56" fill="#F6EBD6"/><rect x="${c - 34}" y="50" width="68" height="10" fill="#F6EBD6"/>`, 80, 96, ['hang', 'ground']],
  diamond: ['#5C7FA8', (c) => `${hook(c)}<polygon points="${c},22 ${c + 28},56 ${c},96 ${c - 28},56" fill="#5C7FA8"/>`, 70, 100, ['hang']],
  bell: ['#D9B36A', (c) => `${hook(c)}<path d="M${c - 32} 80 C${c - 30} 36 ${c - 14} 20 ${c} 20 C${c + 14} 20 ${c + 30} 36 ${c + 32} 80Z" fill="#D9B36A"/><circle cx="${c}" cy="86" r="7" fill="#8A6A2A"/>`, 80, 96, ['hang']],
  candle: ['#F6EBD6', (c) => `${hook(c)}<rect x="${c - 12}" y="40" width="24" height="52" rx="3" fill="#F6EBD6"/><ellipse cx="${c}" cy="30" rx="7" ry="11" fill="#F29A2E"/>`, 60, 100, ['hang']],
  snow: ['#DCE6F2', (c) => `${hook(c)}<g stroke="#9FB6D6" stroke-width="5" stroke-linecap="round">${[0, 60, 120].map((a) => `<line x1="${c}" y1="52" x2="${c}" y2="52" transform="rotate(${a} ${c} 52)" stroke-width="0"/><line x1="${c - 34}" y1="52" x2="${c + 34}" y2="52" transform="rotate(${a} ${c} 52)"/>`).join('')}</g>`, 90, 100, ['hang']],
  cane: ['#C2334F', (c) => `${hook(c)}<path d="M${c + 18} 90 L${c + 18} 36 C${c + 18} 20 ${c - 18} 20 ${c - 18} 36" fill="none" stroke="#C2334F" stroke-width="12" stroke-linecap="round"/><path d="M${c + 18} 70 L${c + 18} 60 M${c + 18} 46 L${c + 18} 40" stroke="#fff" stroke-width="12"/>`, 70, 100, ['hang']],
};
function starPts(c, cy, R, r) { return Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r : R; return `${(c + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`; }).join(' '); }
const ornMeta = [];
for (const [id, [, draw, w, h, placements]] of Object.entries(orn)) {
  write(`orn-${id}.svg`, svg(w, h, draw(w / 2)));
  ornMeta.push({ id, name: id, version: '1.0.0', kind: 'hang', tier: 'common', worlds: ['*'], file: `orn-${id}.svg`, width: w, height: h, aspect: +(w / h).toFixed(4), anchor: { x: 0.5, y: 0.07 }, baseWidth: 0.12, placements, layer: 'ornaments', tags: ['demo'], license: 'CC0-1.0' });
}

const worlds = ['demo-meadow', 'demo-night'].map((id) => ({
  id, name: id, version: '1.0.0', style: 'demo', background: { file: `${id}.svg`, width: 540, height: 960 }, treeAnchor: { x: 0.5, y: 0.82 }, treeWidth: 0.7,
  groundShadow: { rx: 0.5, ry: 0.05, opacity: 1 }, light: { color: '#FFE2A8' }, grade: { tint: '#FFE9C61A', blend: 'multiply' }, effects: [], theme: id === 'demo-meadow' ? 'snow-village' : 'star-colony',
  compat: { trees: { 'demo-pine': 'native', 'demo-round': id === 'demo-meadow' ? 'allowed' : 'native', 'demo-stack': id === 'demo-meadow' ? 'native' : 'allowed' } }, environment: [], foreground: [], license: 'CC0-1.0',
}));
const catalog = { version: '1.0.0', assetBase: '', worlds, trees: treeMeta, ornaments: ornMeta, effects: [], props: [] };
const errs = validateCatalog(catalog);
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
writeFileSync(join(OUT, 'catalog.json'), JSON.stringify(catalog));
writeFileSync(join(OUT, 'LICENSE.txt'), 'CC0 1.0 Universal. 이 디렉터리의 SVG·catalog.json 은 이 저장소가 직접 작성한 데모 에셋이며 저작권을 포기(공공 영역 헌정)한다.\n');
console.log(`demo assets · worlds ${worlds.length} · trees ${treeMeta.length} · ornaments ${ornMeta.length}`);
