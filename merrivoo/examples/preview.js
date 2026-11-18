// 미리보기 스크립트. 엔진(composeScene·renderSceneDOM·drawScene)과 토큰·컴포넌트 클래스만 쓴다.
import * as E from '../engine/index.mjs';

const BASE = '../assets/showcase/';
const cat = await (await fetch(`${BASE}catalog.json`)).json();
cat.assetBase = BASE;
const $ = (id) => document.getElementById(id);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const W = 390, H = 844;
const fit = E.fitScene(W, H);
const worldById = (id) => cat.worlds.find((w) => w.id === id);
const treeById = (id) => cat.trees.find((t) => t.id === id);
const ornById = (id) => cat.ornaments.find((o) => o.id === id);
const OWNER_STAR = { id: 'owner-star', ornamentId: 'star', score: 100 };

const COPY = {
  village: { body: '창문마다 불이 켜진 마을 한가운데, 눈을 이고 선 나무예요. 멀리서 종소리가 울려요.', q: ['따뜻한 난롯가에서 보내는 이브', '눈길을 걸어 도착한 종탑 앞', '창밖 눈을 보며 마시는 코코아'] },
  pantry: { body: '선반 가장 아래부터 쌓아 올린, 달콤한 향이 나는 나무예요. 문이 열릴 때마다 설탕 향이 퍼져요.', q: ['거대한 찬장 속 비밀 파티', '식탁 위를 걸어 다니는 모험', '한밤의 쿠키 굽는 소리'] },
  cosmos: { body: '떠다니는 수정 섬 사이에서 빛나는 나무예요. 오로라가 가지 사이로 흘러요.', q: ['별빛이 쏟아지는 수정 정원', '혜성을 타고 건너는 밤하늘', '오로라 아래 조용한 호숫가'] },
};
const state = { world: 'village', tree: 'fir', n: 21 };

const demoOrnaments = (world, tree, n, { star = true } = {}) => {
  const pool = E.availableOrnaments(cat, world, tree).filter((o) => o.id !== 'star');
  const list = Array.from({ length: n }, (_, i) => ({ id: `f${i}`, ornamentId: pool[(i * 5 + 3) % pool.length].id, score: Math.max(8, 99 - Math.round((i * 91) / Math.max(1, n - 1))) }));
  return star ? [OWNER_STAR, ...list] : list;
};
function sceneFor({ worldId, treeId, n = 0, star = true, ornaments, treeScale, treeLift, lights, effectIds }) {
  const world = worldById(worldId), tree = treeById(treeId);
  const treePx = Math.round(fit.stageW * E.treeSize(world, tree, treeScale).w);
  return E.composeScene(cat, { worldId, treeId, ornaments: ornaments ?? demoOrnaments(world, tree, n, { star }), treePx, treeScale, treeLift, lights, effectIds, seed: 'preview' });
}
/** 390×844 장치 크기로 장면과 UI 를 조립하고 배율만 줄인다 */
function phone({ scale = 0.6, fitWidth = false, ui = '', onScene, ...spec }) {
  const scene = sceneFor(spec);
  const root = el(`<div class="pv-phone" style="--s:${scale}"><div class="pv-device" data-world="${scene.theme}"><div class="pv-box"></div></div></div>`);
  const box = root.querySelector('.pv-box');
  box.style.cssText = `position:absolute;top:0;left:${fit.offsetX}px;width:${fit.stageW}px;height:${fit.stageH}px`;
  E.renderSceneDOM(box, scene);
  if (ui) root.querySelector('.pv-device').insertAdjacentHTML('beforeend', ui);
  onScene?.(scene, root);
  if (fitWidth) root.dataset.fit = '';
  return root;
}
const fitAll = () => document.querySelectorAll('.pv-phone[data-fit]').forEach((p) => { const w = p.parentElement.clientWidth; if (w) p.style.setProperty('--s', ((w - 6) / W).toFixed(4)); });
addEventListener('resize', fitAll);

// ---------- 화면 UI ----------
const ICON = { back: '‹', tool: '✦', share: '↗' };
const sharedTop = (title) => `<header class="pv-top"><span class="pv-icon-btn" aria-hidden="true">${ICON.back}</span><span class="pv-chip-title">${title}</span><span class="pv-icon-btn" aria-hidden="true">${ICON.tool}</span></header>`;
const UI = {
  landing: (w) => `<div class="pv-scrim pv-scrim--top"></div><div class="pv-ui"><div class="pv-top pv-top--center"><p class="pv-brand">Merrivoo</p></div>
    <h2 class="mv-display-md pv-hero-title">나만의 크리스마스<br>평행우주</h2>
    <p class="pv-lead">질문 몇 개에 답하면 나만의 트리가 열려요. 친구가 남긴 장식이 궁합대로 자리를 잡아요.</p>
    <div class="pv-bottom"><p class="pv-caption">평행우주 No.1 · ${w.name}</p><button class="mv-btn mv-btn--xl mv-btn--block" type="button">내 우주 만들기</button></div></div>`,
  question: (w) => `<div class="pv-scrim pv-scrim--bottom pv-scrim--tall"></div><div class="pv-ui">
    <div class="pv-top"><span class="pv-icon-btn" aria-hidden="true">${ICON.back}</span><div class="pv-pill"><div class="mv-progress" role="img" aria-label="3 / 7"><span class="mv-progress__dot" data-state="done"></span><span class="mv-progress__dot" data-state="done"></span><span class="mv-progress__dot" data-state="current"></span><span class="mv-progress__dot"></span><span class="mv-progress__dot"></span><span class="mv-progress__dot"></span><span class="mv-progress__dot"></span></div></div><span class="pv-icon-btn" aria-hidden="true"></span></div>
    <div class="pv-bottom"><div class="mv-question"><span class="mv-question__index">QUESTION 3 / 7</span><h2 class="mv-question__text">크리스마스 이브 저녁, 가장 가고 싶은 곳은?</h2></div>
    <div class="mv-choice-list">${COPY[w.id].q.map((t, i) => `<label class="mv-choice"><input class="mv-choice__input" type="radio" name="q-${w.id}" ${i === 0 ? 'checked' : ''} tabindex="-1"><span class="mv-choice__body"><span class="mv-choice__title">${t}</span></span><span class="mv-choice__check" aria-hidden="true">✓</span></label>`).join('')}</div></div></div>`,
  reveal: (w, t) => `<div class="pv-ui"><div class="pv-bottom"><article class="mv-universe-card"><span class="mv-universe-card__eyebrow">평행우주가 열렸어요</span><h3 class="mv-universe-card__title">${w.name}의 ${t.name}</h3><p class="mv-universe-card__body">${COPY[w.id].body}</p><div class="mv-universe-card__meta"><span class="mv-chip">${w.name}</span><span class="mv-chip">${t.name}</span></div></article><button class="mv-btn mv-btn--xl mv-btn--block" type="button">내 트리 보러 가기</button></div></div>`,
  myTree: (w, t, n) => `<div class="pv-ui">${sharedTop(`${w.name}의 ${t.name}`)}<p class="pv-statline">친구 ${n}명이 장식을 달았어요 · 궁합 1위 눈사람 99점</p>
    <div class="pv-bottom"><button class="mv-btn mv-btn--lg mv-btn--block" type="button">친구에게 공유하기</button><div class="pv-row2"><button class="mv-btn mv-btn--secondary mv-btn--block" type="button">친구로 방문</button><button class="mv-btn mv-btn--secondary mv-btn--block" type="button">포스터 만들기</button></div></div></div>`,
  pick: (w, t) => {
    const items = E.availableOrnaments(cat, w, t).filter((o) => o.id !== 'star').slice(0, 8);
    return `<div class="pv-ui"><header class="pv-top"><span class="pv-icon-btn" aria-hidden="true">${ICON.back}</span><span class="pv-chip-title">장식과 한마디</span><span class="pv-icon-btn" aria-hidden="true"></span></header>
    <div class="pv-bottom"><div class="pv-panel"><h3 class="pv-panel__title">트리에 걸 장식을 골라요</h3>
    <ul class="mv-orn-picker">${items.map((o, i) => `<li><label class="mv-orn-item" ${i === 2 ? 'data-selected' : ''}><input class="mv-orn-item__input" type="radio" name="o-${w.id}" ${i === 2 ? 'checked' : ''} tabindex="-1"><img class="mv-orn-item__img" src="${BASE}${o.file}" alt=""><span class="mv-orn-item__label">${o.name}</span></label></li>`).join('')}</ul>
    <div class="mv-field"><label class="mv-field__label">한마디 (선택)</label><input class="mv-field__input" value="메리 크리스마스! 트리가 너무 예뻐요" tabindex="-1" readonly></div>
    <button class="mv-btn mv-btn--lg mv-btn--block" type="button">트리에 달기</button></div></div></div>`;
  },
  result: (w) => `<div class="pv-ui"><div class="pv-bottom"><div class="pv-panel"><p class="pv-panel__eyebrow">붕어빵님의 ${ornById(w.id === 'cosmos' ? 'comet' : w.id === 'pantry' ? 'macaron' : 'snowman').name}</p>
    <div class="mv-score" role="img" aria-label="궁합 점수 93점"><div class="mv-score__ring" style="--mv-score:93"><span class="mv-score__value">93</span></div><span class="mv-score__label">궁합 점수</span></div>
    <p class="pv-result-line"><strong>트리 꼭대기에 가까운 가장 빛나는 자리에 걸렸어요.</strong>운명이 이 자리를 마련했어요.</p>
    <button class="mv-btn mv-btn--lg mv-btn--block" type="button">내 트리에서 확인하기</button></div></div></div>`,
};

// ---------- 라이브 ----------
function renderLive() {
  const w = worldById(state.world), t = treeById(state.tree);
  const host = $('livePhone'); host.replaceChildren(phone({ worldId: w.id, treeId: t.id, n: state.n, treeLift: 0.07, scale: 0.9, ui: UI.myTree(w, t, state.n),
    onScene: (s) => { const d = s.diagnostics; $('diag').textContent = `배치 ${d.placed}/${d.requested} · 초과 ${d.overflow} · 최대 겹침 ${Math.round(d.maxOverlap * 100)}% · 실루엣 이탈 ${d.outsideSilhouette} · 최소 ${d.minOrnamentPx}px · ${d.pass ? 'PASS' : 'FAIL'}`; } }));
  host.firstElementChild.style.setProperty('--s', matchMedia('(max-width: 860px)').matches ? 0.8 : 0.9);
}
function renderFlow() {
  const w = worldById(state.world), t = treeById(state.tree), grid = $('flow-grid');
  const item = (label, sub, node) => { const d = el(`<div class="pv-item"></div>`); d.append(node, el(`<p class="pv-label">${label}<small>${sub}</small></p>`)); return d; };
  const ownerPick = (n) => demoOrnaments(w, t, n);
  grid.replaceChildren(
    item('1 랜딩', '타이틀·한 줄 설명·시작', phone({ worldId: w.id, treeId: t.id, treeScale: 0.84, ornaments: demoOrnaments(w, t, 6, { star: true }), lights: 'soft', ui: UI.landing(w), scale: 0.72 })),
    item('2 질문', '질문 카드 + 선택지 3장', phone({ worldId: w.id, treeId: t.id, treeScale: 0.7, treeLift: 0.1, ornaments: [], lights: 'off', ui: UI.question(w), scale: 0.72 })),
    item('3 세계관 공개', '카드 위에 트리 전체', phone({ worldId: w.id, treeId: t.id, treeScale: 0.62, treeLift: 0.28, ornaments: [OWNER_STAR], ui: UI.reveal(w, t), scale: 0.72 })),
    item('4 내 트리', '친구 장식 21개', phone({ worldId: w.id, treeId: t.id, treeLift: 0.07, ornaments: ownerPick(21), ui: UI.myTree(w, t, 21), scale: 0.72 })),
    item('5 장식 선택', '장식 고르기 + 한마디', phone({ worldId: w.id, treeId: t.id, treeScale: 0.42, treeLift: 0.3, ornaments: ownerPick(9), ui: UI.pick(w, t), scale: 0.72 })),
    item('6 궁합 결과', '점수·자리 안내', phone({ worldId: w.id, treeId: t.id, treeScale: 0.62, treeLift: 0.28, ornaments: ownerPick(9), ui: UI.result(w), scale: 0.72 })),
  );
}
function renderAfter() { const w = worldById('village'), t = treeById('fir'); $('afterPhone').replaceChildren(phone({ worldId: w.id, treeId: t.id, treeLift: 0.07, ornaments: demoOrnaments(w, t, 12), ui: UI.myTree(w, t, 12), scale: 0.6 })); }

// ---------- 포스터 ----------
function wrap(ctx, text, maxW, maxLines) { // 공백 기준 줄바꿈, 넘치면 글자 단위
  const lines = []; let cur = '';
  for (const word of text.split(' ')) { const t = cur ? `${cur} ${word}` : word; if (ctx.measureText(t).width <= maxW) cur = t; else { if (cur) lines.push(cur); cur = word; } }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}
const cssVar = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
async function drawPoster() {
  const w = worldById(state.world), t = treeById(state.tree);
  const treeScale = 0.82, treeLift = 0.11;
  const treePx = Math.round(1080 * E.treeSize(w, t, treeScale).w);
  const scene = E.composeScene(cat, { worldId: w.id, treeId: t.id, ornaments: demoOrnaments(w, t, 36), treePx, treeScale, treeLift, seed: 'poster' });
  const cv = $('posterCv'), ctx = cv.getContext('2d'), Wd = 1080, Hd = 1920;
  const display = cssVar('--mv-font-family-display', 'serif'), sans = cssVar('--mv-font-family-sans', 'sans-serif');
  const ink = cssVar('--mv-color-text-primary', '#241E17'), brand = cssVar('--mv-color-text-brand', '#7A1F2B'), sub = cssVar('--mv-color-text-secondary', '#49423A');
  const title = `${w.name}의 ${t.name}`;
  await Promise.all([document.fonts.load(`700 80px ${display}`, title), document.fonts.load(`600 36px ${sans}`, '친구 36명이 장식을 달았어요'), document.fonts.load(`700 60px ${display}`, 'Merrivoo')]).catch(() => undefined);
  const images = await E.loadImages(E.collectImageSrcs(scene));
  ctx.clearRect(0, 0, Wd, Hd);
  E.drawScene(ctx, scene, images, { width: Wd, height: Hd, time: 1.2 });
  const paper = '251,245,232'; // 포스터 종이 색(캔버스는 rgba 문자열이 필요해 토큰 대신 상수)
  const top = ctx.createLinearGradient(0, 0, 0, 620); top.addColorStop(0, `rgba(${paper},0.94)`); top.addColorStop(0.7, `rgba(${paper},0.7)`); top.addColorStop(1, `rgba(${paper},0)`);
  ctx.fillStyle = top; ctx.fillRect(0, 0, Wd, 620);
  const bot = ctx.createLinearGradient(0, Hd - 640, 0, Hd); bot.addColorStop(0, `rgba(${paper},0)`); bot.addColorStop(0.45, `rgba(${paper},0.86)`); bot.addColorStop(1, `rgba(${paper},0.97)`);
  ctx.fillStyle = bot; ctx.fillRect(0, Hd - 640, Wd, 640);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  let y = Math.round(Hd * 0.12) + 70;
  ctx.fillStyle = brand; ctx.font = `600 34px ${sans}`; ctx.fillText('나의 크리스마스 평행우주', Wd / 2, y);
  ctx.fillStyle = ink; ctx.font = `700 92px ${display}`; for (const l of wrap(ctx, title, Wd - 200, 2)) { y += y < 340 ? 140 : 104; ctx.fillText(l, Wd / 2, y); }
  const by = Hd - Math.round(Hd * 0.18) - 150;
  ctx.fillStyle = sub; ctx.font = `600 38px ${sans}`; ctx.fillText('친구 36명이 장식을 달았어요', Wd / 2, by);
  ctx.fillStyle = ink; ctx.font = `700 44px ${sans}`; ctx.fillText('궁합 1위 눈사람 99점', Wd / 2, by + 66);
  ctx.fillStyle = brand; ctx.font = `700 64px ${display}`; ctx.fillText('Merrivoo', Wd / 2, by + 160);
}
$('posterSave').onclick = () => $('posterCv').toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'merrivoo-poster.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });

// ---------- 개수 매트릭스 · 점수 ----------
function renderMatrix() {
  const host = $('matrix'); host.replaceChildren();
  const native = { fir: 'village', teacups: 'pantry', crystal: 'cosmos' };
  for (const t of cat.trees) for (const n of [0, 5, 20, 50]) {
    const cell = el('<div class="pv-item"></div>');
    const p = phone({ worldId: native[t.id], treeId: t.id, n, star: true, fitWidth: true, scale: 0.4, onScene: (s) => { cell.dataset.diag = `${s.diagnostics.placed}/${s.diagnostics.requested} · 최소 ${s.diagnostics.minOrnamentPx}px · ${s.diagnostics.pass ? 'PASS' : 'FAIL'}`; } });
    const sizer = el('<div style="width:100%"></div>'); sizer.append(p);
    cell.append(sizer, el(`<p class="pv-label">${t.name} · ${n}개<small>${n === 0 ? '장식 없음' : cell.dataset.diag}</small></p>`));
    host.append(cell);
  }
}
function renderScores() {
  const w = worldById(state.world), t = treeById(state.tree);
  const scores = [95, 80, 60, 40, 15];
  const pool = E.availableOrnaments(cat, w, t).filter((o) => o.id !== 'star');
  const ornaments = [OWNER_STAR, ...scores.map((s, i) => ({ id: `s${s}`, ornamentId: pool[(i * 3 + 1) % pool.length].id, score: s }))];
  const p = phone({ worldId: w.id, treeId: t.id, ornaments, scale: 0.8, onScene: (scene, root) => {
    const dev = root.querySelector('.pv-device');
    for (const l of scene.layers.filter((x) => x.type === 'ornament' && x.id !== 'owner-star')) {
      const b = el(`<span class="pv-badge">${l.score}점</span>`);
      b.style.left = `${fit.offsetX + l.ax * fit.stageW}px`; b.style.top = `${l.ay * fit.stageH + l.h * fit.stageH * 0.95}px`;
      dev.append(b);
    }
  } });
  const note = el(`<div class="pv-controls"><p class="mv-body-md">점수 95·80·60·40·15 가 위에서 아래로, 가운데에서 가장자리로 내려옵니다.</p><p class="mv-caption">가장 낮은 15점도 최소 ${E.composeScene(cat, { worldId: w.id, treeId: t.id, ornaments, treePx: Math.round(fit.stageW * E.treeSize(w, t).w) }).diagnostics.minOrnamentPx}px 이상으로 그립니다.</p></div>`);
  $('scoreDemo').replaceChildren(p, note);
}

// ---------- 컨트롤 ----------
function renderControls() {
  const w = worldById(state.world);
  $('worldChips').replaceChildren(...cat.worlds.map((x) => { const b = el(`<button class="mv-chip" type="button" role="radio" aria-checked="${x.id === state.world}">${x.name}</button>`); b.onclick = () => { state.world = x.id; if (E.treeCompat(x, treeById(state.tree)) === 'forbidden') state.tree = E.availableTrees(cat, x)[0].id; renderAll(); }; return b; }));
  $('treeChips').replaceChildren(...E.availableTrees(cat, w).map((t) => { const b = el(`<button class="mv-chip" type="button" role="radio" aria-checked="${t.id === state.tree}">${t.name}</button>`); b.onclick = () => { state.tree = t.id; renderAll(); }; return b; }));
  $('presets').replaceChildren(...[0, 5, 20, 50].map((n) => { const b = el(`<button class="mv-chip" type="button" aria-pressed="${n === state.n}">${n}개</button>`); b.onclick = () => { state.n = n; $('count').value = n; renderLive(); renderControls(); }; return b; }));
  $('countOut').textContent = state.n;
}
function renderAll() { document.documentElement.dataset.world = worldById(state.world).theme; renderControls(); renderLive(); renderFlow(); renderScores(); drawPoster(); }
$('count').oninput = (e) => { state.n = +e.target.value; $('countOut').textContent = state.n; renderLive(); renderControls(); };
$('theme').onclick = (e) => { const dark = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', dark); e.currentTarget.textContent = dark ? '라이트 모드' : '다크 모드'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; drawPoster(); };

const names = ['surface-canvas', 'surface-default', 'surface-glass', 'text-primary', 'text-secondary', 'text-brand', 'border-gold', 'action-primary-bg', 'status-success-solid', 'status-danger-solid', 'scene-glow', 'interactive-focus-ring'];
$('swatches').replaceChildren(...names.map((n) => el(`<div class="pv-sw"><i style="background:var(--mv-color-${n})"></i><code>color.${n.replace('-', '.')}</code></div>`)));

renderAll(); renderMatrix(); renderAfter(); fitAll();
await document.fonts.ready; fitAll();
