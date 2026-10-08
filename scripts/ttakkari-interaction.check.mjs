// Ttakkari 예제를 실제 Chrome 에서 열어 키보드·포커스 복귀·컴포저·스레드·분할·뷰어·선택·테마·가로 넘침을 검사한다.
// 실행: cd ttakkari && node ../scripts/ttakkari-interaction.check.mjs
// 필요: 설치된 Google Chrome + playwright-core. 저장소는 의존성이 없으므로 위치를 PLAYWRIGHT_CORE 로 넘길 수 있다.
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core/index.mjs node ../scripts/ttakkari-interaction.check.mjs
// TK_SCREENSHOTS=<폴더> 를 주면 템플릿마다 390·1280 × 라이트·다크 스크린샷을 남긴다(렌더 검토용).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
assert.equal(basename(root), 'ttakkari', 'ttakkari 디렉터리에서 실행해야 한다');
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_CORE ?? 'playwright-core'));
} catch {
  console.error('playwright-core 를 찾지 못했다. npm i -g playwright-core 또는 PLAYWRIGHT_CORE=<경로>/index.mjs 로 지정한다.');
  process.exit(2);
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/examples/`;
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
const check = async (name, fn) => {
  try { await fn(); results.push(['ok', name]); } catch (e) { results.push(['FAIL', name, e.message.split('\n')[0]]); }
};
async function open(page, width = 1280, { scheme = 'light', touch = false, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, hasTouch: touch, isMobile: touch, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(base + page, { waitUntil: 'load' });
  await p.waitForTimeout(150);
  return { p, ctx, errors };
}

const templates = ['preview.html', 'chat.html', 'workspace.html', 'library.html', 'files.html', 'auth.html'];
for (const page of templates) {
  for (const width of [360, 390, 768, 1024, 1280, 1440]) {
    await check(`${page} @${width}: 가로 넘침 0 · 스크립트 오류 0`, async () => {
      const { p, ctx, errors } = await open(page, width);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      await ctx.close();
      assert.equal(overflow, 0, `가로 넘침 ${overflow}px`);
      assert.deepEqual(errors, []);
    });
  }
}

await check('앱 셸: lg 미만은 탭바만, lg 이상은 사이드바만 보인다', async () => {
  for (const [width, tabbar, sidebar] of [[390, true, false], [1280, false, true]]) {
    const { p, ctx } = await open('chat.html', width);
    assert.equal(await p.isVisible('.tk-tabbar'), tabbar, `@${width} 탭바`);
    assert.equal(await p.isVisible('.tk-app__sidebar'), sidebar, `@${width} 사이드바`);
    await ctx.close();
  }
});

await check('첫 Tab 은 본문 바로가기 링크다(모든 템플릿)', async () => {
  for (const page of templates) {
    const { p, ctx } = await open(page);
    await p.keyboard.press('Tab');
    assert.equal(await p.evaluate(() => document.activeElement.className), 'tk-skip-link', page);
    await ctx.close();
  }
});

await check('테마 버튼: 다크로 바꾸면 캔버스가 ink 가 되고 aria-pressed·새로고침 뒤에도 유지, Blue 버튼은 그대로', async () => {
  const { p, ctx } = await open('preview.html');
  const blue = () => p.evaluate(() => getComputedStyle(document.querySelector('.tk-button--primary')).backgroundColor);
  const before = await blue();
  await p.click('[data-tk-theme-toggle]');
  assert.equal(await p.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(8, 7, 5)');
  assert.equal(await p.getAttribute('[data-tk-theme-toggle]', 'aria-pressed'), 'true');
  assert.equal(await blue(), before);
  await p.reload(); await p.waitForTimeout(100);
  assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'dark');
  await ctx.close();
});

await check('시드 .dark 클래스만 붙여도 다크 토큰이 적용된다', async () => {
  const { p, ctx } = await open('preview.html');
  await p.evaluate(() => { localStorage.clear(); delete document.documentElement.dataset.theme; document.documentElement.classList.add('dark'); });
  assert.equal(await p.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(8, 7, 5)');
  await ctx.close();
});

await check('탭: 화살표로 선택이 바뀌고 패널이 따라간다', async () => {
  const { p, ctx } = await open('preview.html');
  await p.focus('#pt1');
  await p.keyboard.press('ArrowRight');
  assert.equal(await p.getAttribute('#pt2', 'aria-selected'), 'true');
  assert.equal(await p.isVisible('#pp2'), true);
  assert.equal(await p.isVisible('#pp1'), false);
  await ctx.close();
});

await check('메뉴: ↓ 로 열리고 Esc 로 닫히며 트리거로 포커스가 돌아간다 · 값 고르면 트리거 문구가 바뀐다', async () => {
  const { p, ctx } = await open('preview.html');
  const trigger = p.locator('[aria-controls="pm1"]');
  await trigger.focus();
  await p.keyboard.press('ArrowDown');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  await p.keyboard.press('Escape');
  assert.equal(await p.isVisible('#pm1'), false);
  assert.equal(await p.evaluate(() => document.activeElement.getAttribute('aria-controls')), 'pm1');
  await trigger.click();
  await p.click('#pm1 [role="menuitemradio"]:nth-child(2)');
  assert.equal((await p.textContent('[data-tk-menu-value]')).trim(), '이름 순');
  await ctx.close();
});

await check('다이얼로그·시트: Esc·닫기로 닫히고 연 버튼으로 포커스가 돌아간다', async () => {
  const { p, ctx } = await open('preview.html', 390);
  for (const id of ['ex-dialog', 'ex-sheet']) {
    await p.click(`[data-tk-dialog-open="${id}"]`);
    assert.equal(await p.evaluate((i) => document.getElementById(i).open, id), true, `${id} 열림`);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(50);
    assert.equal(await p.evaluate((i) => document.getElementById(i).open, id), false, `${id} 닫힘`);
    assert.equal(await p.evaluate(() => document.activeElement.dataset.tkDialogOpen), id);
  }
  // 바텀 시트는 화면 아래에 붙는다(모바일)
  await p.click('[data-tk-dialog-open="ex-sheet"]');
  await p.waitForTimeout(400); // 진입 애니메이션(translateY) 이 끝난 뒤에 잰다
  const gap = await p.evaluate(() => innerHeight - document.getElementById('ex-sheet').getBoundingClientRect().bottom);
  assert.ok(Math.abs(gap) <= 1, `시트가 바닥에서 ${gap}px 떠 있다`);
  await ctx.close();
});

await check('모바일 채팅: 메뉴 버튼이 세션 드로어를 열고 Esc 로 닫으면 버튼으로 돌아간다', async () => {
  const { p, ctx } = await open('chat.html', 390);
  await p.click('[data-tk-dialog-open="nav-drawer"]');
  assert.equal(await p.evaluate(() => document.getElementById('nav-drawer').open), true);
  await p.keyboard.press('Escape');
  assert.equal(await p.evaluate(() => document.activeElement.dataset.tkDialogOpen), 'nav-drawer');
  await ctx.close();
});

await check('컴포저: Enter 보내기 · Shift+Enter 줄바꿈 · 한글 조합 중 Enter 는 보내지 않음 · 빈 입력은 보내지 않음', async () => {
  const { p, ctx } = await open('preview.html');
  await p.evaluate(() => { window.__sent = 0; document.querySelector('form[aria-label="빈 컴포저"]').addEventListener('submit', (e) => { e.preventDefault(); window.__sent++; }); });
  const input = p.locator('#pc1');
  await input.focus();
  await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(() => window.__sent), 0, '빈 입력이 보내졌다');
  await input.type('첫 줄');
  await p.keyboard.press('Shift+Enter');
  await input.type('둘째 줄');
  assert.equal(await input.inputValue(), '첫 줄\n둘째 줄');
  await p.evaluate(() => document.getElementById('pc1').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true })));
  assert.equal(await p.evaluate(() => window.__sent), 0, '조합 중 Enter 가 보냈다');
  await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(() => window.__sent), 1);
  await ctx.close();
});

await check('컴포저(터치): Enter 는 줄바꿈이다', async () => {
  const { p, ctx } = await open('preview.html', 390, { touch: true });
  await p.evaluate(() => { window.__sent = 0; document.querySelector('form[aria-label="빈 컴포저"]').addEventListener('submit', (e) => { e.preventDefault(); window.__sent++; }); });
  await p.locator('#pc1').focus();
  await p.keyboard.type('a');
  await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(() => window.__sent), 0);
  await ctx.close();
});

await check('제안 칩: 누르면 컴포저에 채우고 바로 보내지 않는다', async () => {
  const { p, ctx } = await open('chat.html');
  await p.click('[data-tk-suggest^="결정 사항 문서를"]');
  assert.equal(await p.inputValue('#composer-input'), '결정 사항 문서를 팀장님께 메일로 보내줘');
  assert.equal(await p.evaluate(() => document.activeElement.id), 'composer-input');
  await ctx.close();
});

await check('스레드: 위로 올려 읽는 중 새 메시지가 오면 끌어내리지 않고 "새 메시지" 버튼을 띄운다', async () => {
  const { p, ctx } = await open('chat.html', 390, { height: 700 });
  await p.evaluate(() => { document.querySelector('.tk-thread').scrollTop = 0; });
  await p.waitForTimeout(100);
  await p.evaluate(() => { const a = document.createElement('p'); a.className = 'tk-message tk-message--system'; a.textContent = '새 메시지'; document.querySelector('.tk-thread__inner').append(a); });
  await p.waitForTimeout(100);
  assert.equal(await p.evaluate(() => document.querySelector('.tk-thread').scrollTop), 0, '읽던 위치를 빼앗았다');
  assert.equal(await p.isVisible('.tk-jump'), true);
  await p.click('.tk-jump');
  await p.waitForTimeout(600);
  assert.equal(await p.isVisible('.tk-jump'), false);
  await ctx.close();
});

await check('로그 따라가기: 토글이 aria-pressed 를 바꾼다', async () => {
  const { p, ctx } = await open('preview.html');
  const t = p.locator('#run [data-tk-log-follow]');
  await t.click();
  assert.equal(await t.getAttribute('aria-pressed'), 'true');
  await ctx.close();
});

await check('분할 손잡이: separator 이고 ←→ 로 작업 공간 폭이 바뀐다', async () => {
  const { p, ctx } = await open('workspace.html', 1440);
  const handle = p.locator('.tk-split__handle');
  assert.equal(await handle.getAttribute('role'), 'separator');
  const w = () => p.evaluate(() => document.querySelector('.tk-split__pane--secondary').getBoundingClientRect().width);
  const before = await w();
  await handle.focus();
  await p.keyboard.press('ArrowLeft');
  assert.ok((await w()) > before, '넓어지지 않았다');
  await ctx.close();
});

await check('작업 공간: 결과물을 고르면 그 뷰어만 보이고, 모바일에서는 전체 화면으로 열렸다 닫힌다', async () => {
  let { p, ctx } = await open('workspace.html', 1440);
  await p.click('#t-md');
  assert.equal(await p.isVisible('#v-md'), true);
  assert.equal(await p.isVisible('#v-pdf'), false);
  await ctx.close();
  ({ p, ctx } = await open('workspace.html', 390));
  await p.click('#t-xls');
  assert.equal(await p.evaluate(() => document.getElementById('viewer-dialog').open), true);
  assert.equal(await p.isVisible('#viewer-dialog #v-xls'), true);
  await p.click('#viewer-dialog #v-xls [data-tk-dialog-close]');
  await p.waitForTimeout(50); // close 이벤트는 다음 작업에서 온다
  assert.equal(await p.evaluate(() => document.getElementById('viewer-dialog').open), false);
  assert.equal(await p.evaluate(() => document.getElementById('viewer-host').contains(document.getElementById('v-xls'))), true, '뷰어가 제자리로 돌아오지 않았다');
  await ctx.close();
});

await check('뷰어 배율: 확대·축소가 --tk-zoom 과 표시값을 바꾼다', async () => {
  const { p, ctx } = await open('workspace.html', 1440);
  await p.click('#v-pdf [data-tk-zoom="in"]');
  assert.equal(await p.evaluate(() => document.querySelector('#v-pdf .tk-desk').style.getPropertyValue('--tk-zoom')), '1.25');
  assert.equal((await p.textContent('#v-pdf [data-tk-zoom-value]')).trim(), '125%');
  await p.click('#v-pdf [data-tk-zoom="fit"]');
  assert.equal((await p.textContent('#v-pdf [data-tk-zoom-value]')).trim(), '100%');
  await ctx.close();
});

await check('뷰어 찾기: 결과 수를 세고 Enter 로 다음, Esc 로 닫으면 표시가 지워진다', async () => {
  const { p, ctx } = await open('workspace.html', 1440);
  await p.click('#t-md');
  await p.click('#v-md [data-tk-find-open]');
  await p.fill('#v-md [data-tk-find]', '결정');
  await p.waitForTimeout(250);
  const count = (await p.textContent('#v-md .tk-findbar__count')).trim();
  assert.match(count, /^1\/\d+$/);
  await p.keyboard.press('Enter');
  assert.match((await p.textContent('#v-md .tk-findbar__count')).trim(), /^2\//);
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('#v-md mark[data-hit]').count(), 0);
  await ctx.close();
});

await check('파일 찾기: 고르면 선택 바가 개수와 함께 뜨고 해제하면 사라진다', async () => {
  const { p, ctx } = await open('files.html', 390);
  assert.equal((await p.textContent('[data-tk-select-count]')).trim(), '2');
  assert.equal(await p.isVisible('[data-tk-selectionbar]'), true);
  await p.click('[data-tk-select-clear]');
  assert.equal(await p.isVisible('[data-tk-selectionbar]'), false);
  await ctx.close();
});

await check('보관함: 필터 결과가 0 이면 빈 상태와 되돌리기가 보인다', async () => {
  const { p, ctx } = await open('library.html', 1280);
  await p.fill('#lib-q', 'zzzz');
  assert.equal(await p.isVisible('#lib-empty'), true);
  await p.click('#lib-reset');
  assert.equal(await p.isVisible('#lib-empty'), false);
  await ctx.close();
});

await check('토스트: 행동이 있으면 자동으로 닫히지 않고, 행동을 누르면 닫힌다', async () => {
  const { p, ctx } = await open('preview.html');
  await p.evaluate(() => { document.documentElement.style.setProperty('--tk-motion-duration-toast', '200ms'); });
  await p.click('#ex-toast');
  await p.waitForTimeout(400);
  assert.equal(await p.locator('.tk-toast').count(), 1);
  await p.click('.tk-toast__action');
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.tk-toast').count(), 0);
  await ctx.close();
});

await check('툴팁: 키보드 포커스에 즉시 뜨고 Esc 로 닫힌다', async () => {
  const { p, ctx } = await open('preview.html');
  const target = p.locator('button[data-tk-tooltip="원본 다운로드"]');
  await target.focus();
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
  const label = await target.getAttribute('aria-label');
  assert.equal(label, '원본 다운로드');
  await p.waitForSelector('.tk-tooltip[data-open]', { timeout: 1000 });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(50);
  assert.equal(await p.locator('.tk-tooltip[data-open]').count(), 0);
  await ctx.close();
});

await check('복사: 로그 복사는 시각·레벨·메시지를 줄마다 담는다', async () => {
  const { p, ctx } = await open('chat.html');
  await p.click('.tk-log .tk-copy');
  const text = await p.evaluate(() => navigator.clipboard.readText());
  assert.ok(text.split('\n').length === 4 && text.includes('contacts.search'), text);
  await ctx.close();
});

if (process.env.TK_SCREENSHOTS) {
  for (const page of templates) for (const width of [390, 1280]) for (const scheme of ['light', 'dark']) {
    const { p, ctx } = await open(page, width, { scheme });
    await p.screenshot({ path: join(process.env.TK_SCREENSHOTS, `${page.replace('.html', '')}-${width}-${scheme}.png`), fullPage: page === 'preview.html' });
    await ctx.close();
  }
}

await browser.close();
server.close();
const failed = results.filter((r) => r[0] === 'FAIL');
for (const r of results) console.log(r.join(' · '));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
