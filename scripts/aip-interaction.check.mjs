// AIP 예제를 실제 Chrome 에서 열어 키보드·복사·포커스 복귀·테마·가로 넘침을 검사한다.
// 실행: cd aip && node ../scripts/aip-interaction.check.mjs
// 필요: 설치된 Google Chrome + playwright-core. 저장소는 의존성이 없으므로 위치를 PLAYWRIGHT_CORE 로 넘길 수 있다.
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core/index.mjs node ../scripts/aip-interaction.check.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
assert.equal(basename(root), 'aip', 'aip 디렉터리에서 실행해야 한다');
let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_CORE ?? 'playwright-core'));
} catch {
  console.error('playwright-core 를 찾지 못했다. npm i -g playwright-core 또는 PLAYWRIGHT_CORE=<경로>/index.mjs 로 지정한다.');
  process.exit(2);
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.ico': 'image/x-icon' };
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
async function open(page, width = 1280, scheme = 'light') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(base + page, { waitUntil: 'load' });
  await p.waitForTimeout(150);
  return { p, ctx, errors };
}

for (const page of ['preview.html', 'docs.html', 'makeaip.html', 'home.html', 'playground.html']) {
  for (const width of [390, 768, 1280, 1440]) {
    await check(`${page} @${width}: 가로 넘침 0 · 스크립트 오류 0`, async () => {
      const { p, ctx, errors } = await open(page, width);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      await ctx.close();
      assert.equal(overflow, 0, `가로 넘침 ${overflow}px`);
      assert.deepEqual(errors, []);
    });
  }
}

await check('docs: 언어 탭은 화살표로 바뀌고 새로고침 후에도 기억된다', async () => {
  const { p, ctx } = await open('docs.html');
  await p.focus('#t-ts');
  await p.keyboard.press('ArrowRight');
  assert.equal(await p.getAttribute('#t-py', 'aria-selected'), 'true');
  assert.equal(await p.evaluate(() => document.activeElement.id), 't-py');
  assert.equal(await p.isVisible('#p-py'), true);
  assert.equal(await p.isVisible('#p-ts'), false);
  await p.reload(); await p.waitForTimeout(150);
  assert.equal(await p.getAttribute('#t-py', 'aria-selected'), 'true');
  await ctx.close();
});

await check('docs: 셸 코드 복사는 $ 프롬프트를 빼고 복사한다', async () => {
  const { p, ctx } = await open('docs.html');
  const btn = p.locator('figure.aip-code:has(.aip-code__prompt) [data-aip-copy]');
  await btn.click();
  assert.equal(await p.evaluate(() => navigator.clipboard.readText()), 'npm install @aip/client');
  assert.equal(await btn.getAttribute('data-copied'), '');
  await ctx.close();
});

await check('preview: diff 코드 복사는 삭제 줄과 줄 번호를 뺀다', async () => {
  const { p, ctx } = await open('preview.html');
  await p.locator('figure.aip-code:has([data-line-numbers]) [data-aip-copy]').click();
  const text = await p.evaluate(() => navigator.clipboard.readText());
  assert.ok(text.includes('read: "orders"') && !text.includes('read: "order",'), text);
  assert.ok(!/^\s*\d/m.test(text.split('\n')[1]), '줄 번호가 섞였다');
  await ctx.close();
});

await check('docs: 버전 메뉴는 ↓ 로 열리고 Esc 로 닫히며 트리거로 포커스가 돌아간다', async () => {
  const { p, ctx } = await open('docs.html');
  const trigger = p.locator('[aria-controls="version-menu"]');
  await trigger.focus();
  await p.keyboard.press('ArrowDown');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(await p.evaluate(() => document.activeElement.getAttribute('role')), 'menuitemradio');
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(await p.isVisible('#version-menu'), false);
  assert.equal(await p.evaluate(() => document.activeElement.getAttribute('aria-controls')), 'version-menu');
  await ctx.close();
});

await check('preview: 다이얼로그는 Esc 로 닫히고 연 버튼으로 포커스가 돌아간다', async () => {
  const { p, ctx } = await open('preview.html');
  const opener = p.locator('[data-aip-dialog-open="ex-dialog"]');
  await opener.click();
  assert.equal(await p.evaluate(() => document.getElementById('ex-dialog').open), true);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(50);
  assert.equal(await p.evaluate(() => document.getElementById('ex-dialog').open), false);
  assert.equal(await p.evaluate(() => document.activeElement.dataset.aipDialogOpen), 'ex-dialog');
  await ctx.close();
});

await check('docs: ⌘K/Ctrl+K 로 검색이 열리고, 입력·↓ 가 결과를 고른다', async () => {
  const { p, ctx } = await open('docs.html');
  await p.keyboard.press(process.platform === 'darwin' ? 'Meta+k' : 'Control+k');
  assert.equal(await p.evaluate(() => document.querySelector('dialog.aip-search').open), true);
  await p.keyboard.type('run');
  const visible = await p.$$eval('.aip-search__result', (els) => els.filter((e) => !e.closest('[hidden]')).map((e) => e.textContent));
  assert.ok(visible.length >= 1 && visible.every((t) => t.toLowerCase().includes('run')), JSON.stringify(visible));
  const active = await p.getAttribute('.aip-search__input', 'aria-activedescendant');
  assert.ok(active, 'aria-activedescendant 없음');
  await p.keyboard.type('zzzz');
  assert.equal(await p.isVisible('.aip-search__empty'), true);
  await p.keyboard.press('Escape');
  assert.equal(await p.evaluate(() => document.querySelector('dialog.aip-search').open), false);
  await ctx.close();
});

await check('preview: 키보드 포커스에 툴팁이 즉시 뜨고 Esc 로 닫힌다', async () => {
  const { p, ctx } = await open('preview.html');
  await p.focus('body');
  const target = p.locator('button[data-aip-tooltip="Runs in a sandbox. Nothing is saved."]');
  await target.focus();
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); // :focus-visible 을 만들기 위해 키보드로 포커스
  const id = await target.getAttribute('aria-describedby');
  await p.waitForSelector(`#${id}[data-open]`, { timeout: 1000 });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(50);
  assert.equal(await p.locator(`#${id}`).isHidden(), true);
  await ctx.close();
});

await check('docs: TOC 는 스크롤한 절을 aria-current 로 표시한다', async () => {
  const { p, ctx } = await open('docs.html', 1440);
  await p.evaluate(() => document.getElementById('spec').scrollIntoView());
  await p.waitForTimeout(300);
  assert.equal(await p.getAttribute('.aip-docs__toc a[href="#spec"]', 'aria-current'), 'true');
  await ctx.close();
});

await check('테마 버튼: 다크로 바꾸면 캔버스·aria-pressed 가 바뀌고 AIP Blue 는 그대로다', async () => {
  const { p, ctx } = await open('makeaip.html');
  const before = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const blue = () => p.evaluate(() => getComputedStyle(document.querySelector('.aip-button--primary')).backgroundColor);
  const blueBefore = await blue();
  await p.click('[data-aip-theme-toggle]');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'dark');
  assert.equal(await p.getAttribute('[data-aip-theme-toggle]', 'aria-pressed'), 'true');
  assert.notEqual(await p.evaluate(() => getComputedStyle(document.body).backgroundColor), before);
  assert.equal(await blue(), blueBefore);
  await ctx.close();
});

await check('첫 Tab 은 본문 바로가기 링크다(모든 템플릿)', async () => {
  for (const page of ['docs.html', 'makeaip.html', 'home.html', 'playground.html', 'preview.html']) {
    const { p, ctx } = await open(page);
    await p.keyboard.press('Tab');
    assert.equal(await p.evaluate(() => document.activeElement.className), 'aip-skip-link', page);
    await ctx.close();
  }
});

await browser.close();
server.close();
const failed = results.filter((r) => r[0] === 'FAIL');
for (const r of results) console.log(r.join(' · '));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
