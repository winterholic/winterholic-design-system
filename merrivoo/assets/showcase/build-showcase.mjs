// 쇼케이스 에셋 가공 + 카탈로그 생성. 이미지 생성 원본(마젠타 키 시트)을 tools/process_assets.py 로 가공한다.
// 사용: node assets/showcase/build-showcase.mjs <원본 디렉터리> [--python <python 경로>]
//   원본 디렉터리 구조: bg/ tree/ orn-common/ orn-world/ fx/ (각 PNG, 저장소에 올리지 않음)
// 이 에셋은 이 저장소 용도로 새로 생성한 범용 일러스트다. 서비스 전용 세계관·콘텐츠·상용 에셋은 비공개 서비스 저장소에서 관리하며 여기에 없다.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCatalog } from '../../engine/index.mjs';

const OUT = dirname(fileURLToPath(import.meta.url));
const TOOL = resolve(OUT, '../../tools/process_assets.py');
const args = process.argv.slice(2);
const RAW = resolve(args[0] ?? '');
const py = args.includes('--python') ? args[args.indexOf('--python') + 1] : 'python3';
if (!args[0] || !existsSync(RAW)) { console.error('원본 디렉터리를 지정하세요'); process.exit(1); }
const run = (...a) => execFileSync(py, [TOOL, ...a], { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const size = (f) => execFileSync(py, ['-c', `from PIL import Image;im=Image.open(r"${f}");print(im.size[0],im.size[1])`]).toString().trim().split(' ').map(Number);

// theme 은 토큰의 data-world 테마(색 시스템)다
const WORLDS = [
  { id: 'village', name: '눈 덮인 마을', theme: 'snow-village', bg: 'bg/bg-village.png', light: '#FFE2A8', tint: '#FFEFD81A', effects: ['snow', 'sparkle', 'mist'], trees: { fir: 'native', teacups: 'allowed', crystal: 'allowed' } },
  { id: 'pantry', name: '거대한 찬장', theme: 'night-office', bg: 'bg/bg-pantry.png', light: '#FFD9A0', tint: '#FFE6C01A', effects: ['bokeh', 'sparkle'], trees: { fir: 'allowed', teacups: 'native', crystal: 'allowed' } },
  { id: 'cosmos', name: '수정 우주', theme: 'star-colony', bg: 'bg/bg-cosmos.png', light: '#CFE3FF', tint: '#DCE6FF1A', effects: ['sparkle', 'rays', 'bokeh'], trees: { fir: 'allowed', teacups: 'allowed', crystal: 'native' } },
];
const TREES = [
  { id: 'fir', name: '전나무', src: 'tree/tree-fir.png', tags: ['classic', 'conifer'] },
  { id: 'teacups', name: '찻잔 탑', src: 'tree/tree-teacups.png', tags: ['absurd', 'stack'] },
  { id: 'crystal', name: '수정 소나무', src: 'tree/tree-crystal.png', tags: ['crystal', 'magic'] },
];
const COMMON = ['star', 'heart', 'bell', 'gift', 'snowflake', 'bow', 'bauble-burgundy', 'bauble-gold', 'candy-cane', 'jewel', 'crescent-moon', 'key'];
const NAMES = { star: '금빛 별', heart: '버건디 하트', bell: '금빛 종', gift: '선물 상자', snowflake: '눈송이', bow: '비단 리본', 'bauble-burgundy': '버건디 공', 'bauble-gold': '샴페인 공', 'candy-cane': '지팡이 사탕', jewel: '에메랄드', 'crescent-moon': '초승달', key: '황동 열쇠',
  'gingerbread-house': '진저브레드 집', mitten: '벙어리장갑', songbird: '방울새', snowman: '눈사람', 'bell-tower': '종탑', pinecone: '솔방울', macaron: '마카롱', teapot: '찻주전자', 'jam-jar': '잼 병', croissant: '크루아상', 'sugar-tower': '각설탕 탑', whisk: '거품기',
  'ringed-planet': '고리 행성', comet: '혜성', 'crystal-shard': '수정 조각', constellation: '별자리', lantern: '랜턴', rocket: '작은 로켓' };
const WORLD_ORN = [
  { world: 'village', sheet: 'orn-world/orn-village.png', ids: ['gingerbread-house', 'mitten', 'songbird', 'snowman', 'bell-tower', 'pinecone'], ground: ['snowman', 'gingerbread-house'] },
  { world: 'pantry', sheet: 'orn-world/orn-pantry.png', ids: ['macaron', 'teapot', 'jam-jar', 'croissant', 'sugar-tower', 'whisk'], ground: ['teapot', 'sugar-tower'] },
  { world: 'cosmos', sheet: 'orn-world/orn-cosmos.png', ids: ['ringed-planet', 'comet', 'crystal-shard', 'constellation', 'lantern', 'rocket'], ground: ['rocket'] },
];
const BASE_W = { star: 0.15, gift: 0.12, 'gingerbread-house': 0.13, snowman: 0.11, teapot: 0.12, 'sugar-tower': 0.1, rocket: 0.1, key: 0.08, 'candy-cane': 0.09, jewel: 0.09 };
const FX = [
  { id: 'bokeh', name: '보케', type: 'image', src: 'fx/fx-bokeh.png', blend: 'screen', opacity: 0.7, layer: 'fx-top' },
  { id: 'mist', name: '안개', type: 'image', src: 'fx/fx-mist.png', blend: 'screen', opacity: 0.75, layer: 'fx-top' },
  { id: 'rays', name: '빛줄기', type: 'image', src: 'fx/fx-rays.png', blend: 'screen', opacity: 0.65, layer: 'atmosphere' },
  { id: 'snow', name: '눈', type: 'particles', kind: 'snow', count: 44, opacity: 0.9, layer: 'fx-top' },
  { id: 'sparkle', name: '반짝임', type: 'particles', kind: 'sparkle', count: 26, opacity: 0.9, layer: 'fx-top' },
];

const TMP = join(OUT, '.proc');
rmSync(TMP, { recursive: true, force: true });
for (const d of ['worlds', 'trees', 'ornaments', 'fx']) { rmSync(join(OUT, d), { recursive: true, force: true }); mkdirSync(join(OUT, d), { recursive: true }); }

for (const w of WORLDS) run('bg', join(RAW, w.bg), join(OUT, 'worlds', `${w.id}.webp`), '--quality', '80', '--width', '1024');
for (const t of TREES) run('tree', join(RAW, t.src), join(OUT, 'trees', `${t.id}.webp`), '--width', '900', '--quality', '82');
for (const f of FX.filter((f) => f.type === 'image')) run('bg', join(RAW, f.src), join(OUT, 'fx', `${f.id}.webp`), '--width', '720', '--quality', '68');
run('slice', join(RAW, 'orn-common/orn-common.png'), '--cols', '4', '--rows', '3', '--names', COMMON.join(','), '--out', join(TMP, 'common'), '--size', '256');
for (const s of WORLD_ORN) run('slice', join(RAW, s.sheet), '--cols', '3', '--rows', '2', '--names', s.ids.join(','), '--out', join(TMP, s.world), '--size', '256');

const LICENSE = 'generated:winterholic-design-system';
const VERSION = '1.0.0';
const meta = (dir) => JSON.parse(readFileSync(join(TMP, dir, '_slice.json'), 'utf8'));
const ornaments = [];
const add = (dir, tier, worlds) => {
  for (const m of meta(dir)) {
    cpSync(join(TMP, dir, m.file), join(OUT, 'ornaments', m.file));
    const ground = tier === 'world' && WORLD_ORN.find((s) => s.world === worlds[0]).ground.includes(m.id);
    ornaments.push({ id: m.id, name: NAMES[m.id], version: VERSION, kind: 'hang', tier, worlds, file: `ornaments/${m.file}`, width: m.width, height: m.height, aspect: m.aspect,
      anchor: { x: m.anchorTop.x, y: 0.04 }, baseWidth: BASE_W[m.id] ?? 0.11, placements: m.id === 'star' ? ['hang', 'topper'] : m.id === 'gift' || ground ? ['hang', 'ground'] : ['hang'], layer: 'ornaments', tags: [tier], license: LICENSE });
  }
};
add('common', 'common', ['*']);
for (const s of WORLD_ORN) add(s.world, 'world', [s.world]);

const trees = TREES.map((t) => {
  const m = JSON.parse(readFileSync(join(OUT, 'trees', `${t.id}.mask.json`), 'utf8'));
  return { id: t.id, name: t.name, version: VERSION, style: 'storybook', file: `trees/${t.id}.webp`, width: m.width, height: m.height, aspect: m.aspect, heightFrac: 0.54,
    baseAnchor: { x: 0.5, y: 1 }, topAnchor: { x: 0.5, y: 0.03 }, mask: m.mask, tags: t.tags, compat: { worlds: Object.fromEntries(WORLDS.map((w) => [w.id, w.trees[t.id]])) }, license: LICENSE };
});
const worlds = WORLDS.map((w) => {
  const [bw, bh] = size(join(OUT, 'worlds', `${w.id}.webp`));
  return { id: w.id, name: w.name, version: VERSION, style: 'storybook', background: { file: `worlds/${w.id}.webp`, width: bw, height: bh }, treeAnchor: { x: 0.5, y: 0.82 }, treeWidth: 0.87,
    groundShadow: { rx: 0.5, ry: 0.05, opacity: 1 }, light: { color: w.light }, grade: { tint: w.tint, blend: 'multiply' }, effects: w.effects, theme: w.theme, compat: { trees: w.trees }, environment: [], foreground: [], license: LICENSE };
});
const effects = FX.map((f) => (f.type === 'image' ? { id: f.id, name: f.name, type: 'image', file: `fx/${f.id}.webp`, blend: f.blend, opacity: f.opacity, layer: f.layer } : { id: f.id, name: f.name, type: 'particles', kind: f.kind, count: f.count, opacity: f.opacity, layer: f.layer }));
for (const t of TREES) rmSync(join(OUT, 'trees', `${t.id}.mask.json`));
rmSync(TMP, { recursive: true, force: true });

const catalog = { version: VERSION, assetBase: '', worlds, trees, ornaments, effects, props: [] };
const errs = validateCatalog(catalog, { fileExists: (f) => existsSync(join(OUT, f)) });
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
writeFileSync(join(OUT, 'catalog.json'), JSON.stringify(catalog));
writeFileSync(join(OUT, 'LICENSE.txt'), '이 디렉터리의 이미지·catalog.json 은 winterholic-design-system 용도로 생성한 범용 일러스트다. 이 저장소 안에서의 사용·재배포를 허용한다. 서비스 전용 에셋이 아니다.\n');
console.log(`showcase · worlds ${worlds.length} · trees ${trees.length} · ornaments ${ornaments.length} · fx ${effects.length}`);
