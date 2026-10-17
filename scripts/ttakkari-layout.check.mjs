// Ttakkari 레이아웃 오류 검사: 가로 넘침, 화면 밖으로 새는 요소, 조용히 잘리는 글자, 이중 간격, 터치 타깃, 입력 글자 크기, safe-area, 모달 크기.
// 예제(기본) 또는 실제 앱(--url)을 6폭 × (평소 | 긴 글자 주입) 으로 연다. 규칙의 이유와 고치는 법은 docs/22-ui-error-prevention.md.
//
//   cd ttakkari && node ../scripts/ttakkari-layout.check.mjs                 # examples/*.html 전부, 실패가 있으면 종료 코드 1
//   node ../scripts/ttakkari-layout.check.mjs --pages archetypes/github-pr.html,chat.html
//   node ../scripts/ttakkari-layout.check.mjs --url http://127.0.0.1:5173 --routes /memos,/settings --stub ./stub.mjs --out /tmp/report.json
//   TK_SHOTS=<폴더> 를 주면 폭마다 스크린샷을 남긴다.
//   --browser=webkit 이면 WebKit(= iOS Safari 와 같은 엔진)에 iPhone 프리셋으로 연다. Chrome 에뮬레이션만으로 통과한 화면이 실기기 Safari 에서 깨진 적이 있다(date 입력 폭, 파일 선택 메뉴 위치).
//     WebKit 에는 safe-area inset 에뮬레이션이 없어 CSS·JS 응답의 env(safe-area-inset-*) 를 고정 px 로 바꿔 흉내 낸다.
// 필요: 설치된 Chrome(WebKit 은 `npx playwright install webkit`) + playwright-core(PLAYWRIGHT_CORE=<경로>/index.mjs 로 지정 가능).
// 예외: 요소에 data-layout-ok="이유" 를 달면 그 요소와 자손은 건너뛴다(이유 없이 달지 않는다). 긴 글자 주입은 data-stress-skip 로 뺀다.
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  dialogClosedError, dialogMeasurementError, fileButtonMismatch, findSilentClip,
  inspectDynamicTargets, navigationError, pageErrorFinding, tableViewportFinding,
  touchTargetFinding, validateTargets,
} from './ttakkari-layout.rules.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split(/=(.*)/s)).map(([k, v]) => [k, v ?? true]));
const WIDTHS = (args.widths ? String(args.widths).split(',').map(Number) : [320, 390, 768, 1024, 1440]);
const LONG = ' 아주긴이름의프로젝트와파일_VeryLongUnbrokenIdentifier_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_final.tsx';

const BROWSER = args.browser === 'webkit' ? 'webkit' : 'chrome';
let chromium, webkit, devices;
try { ({ chromium, webkit, devices } = await import(process.env.PLAYWRIGHT_CORE ?? 'playwright-core')); } catch {
  console.error('playwright-core 를 찾지 못했다. PLAYWRIGHT_CORE=<경로>/index.mjs 로 지정한다.'); process.exit(2);
}

// ---------- 대상 ----------
let server, base, targets = [];
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.ico': 'image/x-icon' };
if (args.url) {
  base = String(args.url).replace(/\/$/, '');
  targets = String(args.routes ?? '/').split(',').map((r) => r.trim()).filter(Boolean).map((r) => ({ name: r, url: base + r }));
} else {
  const root = process.cwd();
  if (basename(root) !== 'ttakkari') { console.error('ttakkari 디렉터리에서 실행해야 한다'); process.exit(2); }
  server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const body = await readFile(join(root, path));
      res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/examples/`;
  const walk = async (dir, prefix = '') => {
    const out = [];
    for (const e of await readdir(join(root, 'examples', dir), { withFileTypes: true })) {
      if (e.isDirectory()) out.push(...await walk(join(dir, e.name), prefix + e.name + '/'));
      else if (e.name.endsWith('.html')) out.push(prefix + e.name);
    }
    return out;
  };
  const pages = args.pages ? String(args.pages).split(',') : await walk('');
  targets = pages.map((p) => ({ name: p, url: base + p }));
}
const targetValidationError = validateTargets(targets);
if (targetValidationError) {
  console.error(`[${targetValidationError.rule}] ${targetValidationError.detail} · 미측정`);
  process.exit(2);
}
const stub = args.stub ? (await import(pathToFileURL(resolve(String(args.stub))).href)).default : null;

// ---------- 페이지 안에서 도는 검사 ----------
const inPage = (opts) => {
  const { stress, long, touch, insets } = opts;
  const findSilentClip = window.__ttakkariLayoutFindSilentClip;
  if (typeof findSilentClip !== 'function') throw new Error('layout checker silent-clip policy was not installed');
  const vw = innerWidth, vh = innerHeight;
  const out = [];
  const sig = (el) => {
    const parts = [];
    for (let n = el, i = 0; n && n.nodeType === 1 && i < 3; n = n.parentElement, i++) {
      const cls = [...n.classList].filter((c) => !/^(is|has)-/.test(c)).slice(0, 2).map((c) => '.' + c).join('');
      parts.push(n.tagName.toLowerCase() + cls + (n.id ? '#' + n.id : ''));
    }
    return parts.reverse().join(' > ');
  };
  const skipped = (el) => !!el.closest('[data-layout-ok]');
  const shown = (el) => {
    if (el.closest('[hidden], dialog:not([open]), template, script, style, [inert]')) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const add = (rule, el, detail) => out.push({ rule, sig: sig(el), detail });
  const rect = (r) => ({ x: r.left, y: r.top, left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
  const hitRect = (el) => {
    const base = rect(el.getBoundingClientRect());
    let left = base.left, right = base.right, top = base.top, bottom = base.bottom;
    for (const pseudo of ['::before', '::after']) {
      const p = getComputedStyle(el, pseudo);
      if (p.content === 'none' || p.position !== 'absolute' || p.pointerEvents === 'none') continue;
      const n = (v) => Number.parseFloat(v);
      const t = n(p.top), r = n(p.right), b = n(p.bottom), l = n(p.left);
      if ([t, r, b, l].some(Number.isNaN)) continue;
      left = Math.min(left, base.left + l); right = Math.max(right, base.right - r);
      top = Math.min(top, base.top + t); bottom = Math.max(bottom, base.bottom - b);
    }
    return { x: left, y: top, left, top, right, bottom, width: right - left, height: bottom - top };
  };
  // 저작된 margin: 규칙에 적힌 값(auto 는 사용값으로 바뀌어 computed 로는 구분할 수 없다)
  const sheets = [];
  for (const sh of document.styleSheets) { try { sheets.push(...sh.cssRules); } catch { /* cross-origin 글꼴 CSS */ } }
  const flat = (rules) => rules.flatMap((r) => (r.cssRules && r.media ? (matchMedia(r.media.mediaText).matches ? flat([...r.cssRules]) : []) : r.cssRules && r.type === CSSRule.SUPPORTS_RULE ? flat([...r.cssRules]) : [r]));
  const rules = flat(sheets).filter((r) => r.style && r.selectorText);
  const authoredMargin = (el, side) => {
    let v = null;
    for (const r of rules) {
      let hit = false; try { hit = el.matches(r.selectorText); } catch { /* 지원하지 않는 선택자 */ }
      if (!hit) continue;
      const long = r.style.getPropertyValue('margin-' + side);
      if (long) v = long;
      else if (r.style.getPropertyValue('margin')) {
        const parts = r.style.getPropertyValue('margin').trim().split(/\s+(?![^(]*\))/);
        const [a, b = a, c = a, d = b] = parts;
        v = { top: a, right: b, bottom: c, left: d }[side];
      }
    }
    const inl = el.style.getPropertyValue('margin-' + side) || el.style.getPropertyValue('margin');
    return inl || v;
  };

  // 긴 글자 주입: 자식 요소가 없는 글자 요소 끝에 붙인다(실제 앱의 긴 파일명·계정·프로젝트 이름을 흉내)
  if (stress) {
    const skip = 'script,style,svg,option,kbd,code,pre,[data-stress-skip],.tk-sr-only,.tk-tabbar *,.tk-skip-link,.tk-header__brand *,.tk-header__actions *,.tk-viewer__tools *,.tk-tabs [role=tab],.tk-segmented *,.tk-nav__link,.tk-pagination *,.tk-copy *,.tk-menu__item,.tk-stream__hud *,.tk-keybar *';
    // 버튼·칩·배지의 맨 글자는 정해진 이름(승인·다운로드·완료)이다. 데이터가 들어가면 라벨을 <span> 으로 감싸는 것이 계약이라 그 span 만 주입한다. --stress-raw 는 맨 글자에도 주입한다(실제 앱에서 데이터 라벨 찾기).
    const staticLabel = (el) => !opts.raw && el.matches('.tk-button,.tk-icon-button,.tk-tab,.tk-segmented__item,.tk-toast__action,.tk-chip,.tk-badge');
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length || el.matches(skip) || staticLabel(el) || el.closest('[data-stress-skip]') || !shown(el)) continue;
      const t = el.textContent.trim();
      if (!t || t.length > 120) continue;
      if (el.matches('input,textarea,select')) continue;
      el.append(long);
    }
  }

  const doc = document.documentElement;
  if (doc.scrollWidth > vw + 0.5) {
    // 범인 찾기: 화면 오른쪽을 넘는 가장 안쪽 요소(가로 스크롤 상자 안은 제외)
    let culprit = null;
    for (const el of document.querySelectorAll('body *')) {
      if (!shown(el) || getComputedStyle(el).position === 'fixed') continue;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && !(() => { for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).overflowX !== 'visible') return true; return false; })()) culprit = el;
    }
    add('page-overflow-x', culprit ?? document.body, `scrollWidth ${doc.scrollWidth} > ${vw}` + (culprit ? ` · 범인 ${Math.round(culprit.getBoundingClientRect().right)}` : ''));
  }
  if (document.body.scrollWidth > vw + 0.5 && doc.scrollWidth <= vw + 0.5) add('page-overflow-x', document.body, `body.scrollWidth ${document.body.scrollWidth} > ${vw}`);

  const all = [...document.querySelectorAll('body *')];
  const clippers = (el) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.overflowX !== 'visible') { const r = n.getBoundingClientRect(); if (r.left >= -1 && r.right <= vw + 1) return n; }
    }
    return null;
  };
  const seen = new Set();
  for (const el of all) {
    if (skipped(el) || !shown(el)) continue;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();

    // 화면 밖으로 새는 요소: 오른쪽·왼쪽이 화면을 벗어나는데 가로 스크롤 상자 안도 아니다
    if ((r.right > vw + 1 || r.left < -1) && s.position !== 'fixed' && !el.closest('svg') && !el.closest('.tk-sr-only,.tk-skip-link') && !clippers(el)) {
      const key = sig(el.parentElement ?? el);
      if (!seen.has(key)) { seen.add(key); add('escapes-viewport', el, `x ${Math.round(r.left)}..${Math.round(r.right)} (화면 ${vw})`); }
    }

    // 조용히 잘리는 글자: overflow 가 숨김인데 말줄임도 아니고 내용이 더 크다
    if (s.overflowX !== 'visible' && s.overflowX !== 'auto' && s.overflowX !== 'scroll' && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const text = el.innerText?.trim();
      if (text && !el.matches('.tk-screen__body,.tk-progress,.tk-skeleton,.tk-code,.tk-avatar,.tk-canvas') && !el.closest('svg')) {
        const finding = findSilentClip({
          sig: sig(el), text, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
          style: {
            position: s.position, width: s.width, height: s.height,
            paddingTop: s.paddingTop, paddingRight: s.paddingRight, paddingBottom: s.paddingBottom, paddingLeft: s.paddingLeft,
            overflowX: s.overflowX, overflowY: s.overflowY, clip: s.clip, clipPath: s.clipPath,
            textOverflow: s.textOverflow, webkitLineClamp: s.webkitLineClamp, display: s.display,
          },
          role: el.getAttribute('role'), dataActive: el.getAttribute('data-active'),
        });
        if (finding) out.push(finding);
      }
    }
    if (s.textOverflow === 'ellipsis' && s.whiteSpace === 'nowrap' && el.scrollWidth > el.clientWidth + 1) {
      if (!el.hasAttribute('title') && !el.closest('[title],[aria-label]') && !stress) add('ellipsis-without-full-text', el, '말줄임이 생겼는데 title/상세에서 전체를 볼 방법이 없다');
    }

    // 이중 간격: 부모가 gap 으로 간격을 주는데 자식에도 margin(6px 이하의 아이콘·점 정렬 보정은 제외)
    const p = el.parentElement;
    if (p && p !== document.body) {
      const ps = getComputedStyle(p);
      const gapped = (ps.display.includes('flex') || ps.display.includes('grid')) && (parseFloat(ps.rowGap) > 0 || parseFloat(ps.columnGap) > 0);
      const px = (side) => { const a = authoredMargin(el, side); if (!a || /auto/.test(a)) return 0;
      // 저작된 값이 0 인데 계산값이 크면 다른(더 구체적인) 규칙의 auto 가 이긴 것이다
      const used = parseFloat(s['margin' + side[0].toUpperCase() + side.slice(1)]);
      return /^0(px)?$/.test(a.trim()) ? 0 : used; };
      if (gapped && s.position !== 'absolute' && !el.matches('.tk-sr-only')) {
        const col = ps.display.includes('grid') || ps.flexDirection.startsWith('column');
        const sides = ps.display.includes('grid') ? ['top', 'bottom', 'left', 'right'] : col ? ['top', 'bottom'] : ['left', 'right'];
        const big = sides.map((side) => [side, px(side)]).filter(([, v]) => v > 6);
        if (big.length) add('gap-plus-margin', el, `부모 gap ${ps.rowGap}/${ps.columnGap} 에 자식 margin ${big.map(([k, v]) => k + ' ' + v + 'px').join(', ')}`);
      }
      if (p.classList.contains('tk-stack') && (px('top') > 0 || px('bottom') > 0)) add('gap-plus-margin', el, `tk-stack 자식 margin ${s.marginTop}/${s.marginBottom}`);
    }

    // 가로 모드 노치: 눌리는 요소가 좌우 safe-area 안쪽에 있어야 한다(스크롤 상자 안은 제외)
    if (insets && (insets.left || insets.right) && document.querySelector('.tk-app, .tk-auth') && el.matches('a[href],button,input:not([type=hidden]),select,textarea,[role=tab]') && !clippers(el) && !el.closest('dialog:not([open])')) {
      if ((r.left < insets.left - 1 && r.right > 0) || (r.right > vw - insets.right + 1 && r.left < vw)) add('safe-area-side', el, `x ${Math.round(r.left)}..${Math.round(r.right)} 가 좌우 노치 ${insets.left}/${insets.right} 와 겹침`);
    }

    // 본문 바로가기는 포커스 전에는 화면 밖에 있어야 한다(노치 기기에서 top 이 밀려 걸려 보이던 문제)
    if (el.matches('.tk-skip-link') && document.activeElement !== el && r.bottom > 1 && r.top < vh) add('skip-link-visible', el, `포커스 없이 화면 안에 보인다 (${Math.round(r.top)}..${Math.round(r.bottom)})`);

    // 입력 글자 크기: iOS 는 16px 미만 입력에 포커스하면 화면을 확대한다
    if (touch && el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=file]),textarea,select') && s.opacity !== '0') {
      const finding = touchTargetFinding({ kind: 'input-font', sig: sig(el), fontSize: parseFloat(s.fontSize) });
      if (finding) out.push(finding);
    }
    // 12px 미만 글자
    if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(s.fontSize) < 12 && !el.closest('svg')) {
      add('font-under-12', el, `font-size ${s.fontSize}`);
    }

    // 터치 타깃: 보이는 크기 + ::after 히트 영역
    if (touch && s.pointerEvents !== 'none' && el.matches('a[href],button,[role=button],[role=tab],[role=menuitem],[role=menuitemradio],[role=menuitemcheckbox],[role=option],[role=switch],input:not([type=hidden]),select,summary,[tabindex="0"]') && !el.matches('[disabled],[aria-disabled=true]') && !el.closest('p,li > p,.tk-prose,.tk-callout__body')) {
      // 라벨 안의 체크·라디오는 라벨이 눌리는 영역이다
      const host = el.matches('input[type=checkbox],input[type=radio]') && el.closest('label') ? el.closest('label') : el;
      const hr = rect(host.getBoundingClientRect());
      const vr = host.querySelector('svg,.tk-icon,img')?.getBoundingClientRect() ?? host.getBoundingClientRect();
      const finding = touchTargetFinding({ sig: sig(el), hit: hitRect(host), visual: rect(vr) });
      if (finding && !el.closest('label.tk-chip,.tk-switch,.tk-checkbox,.tk-radio,.tk-field--inline')) out.push(finding);
    }

    // safe-area: 화면 가장자리에 붙은 고정 요소 안의 행동이 홈 인디케이터·노치에 겹친다
    if (insets && (s.position === 'fixed' || s.position === 'sticky') && el.matches('.tk-tabbar,.tk-header,.tk-composer,.tk-dialog,.tk-drawer,.tk-sheet,[class*="toast"]')) {
      const kids = [...el.querySelectorAll('a[href],button,input,textarea,[role=tab]')].filter(shown);
      if (r.bottom >= vh - 1) for (const k of kids) { const kr = k.getBoundingClientRect(); if (kr.bottom > vh - insets.bottom / 2 + 1) add('safe-area-bottom', k, `행동 아래 ${Math.round(vh - kr.bottom)}px < 홈 바 ${insets.bottom}px 의 절반`); }
      if (r.top <= 1) for (const k of kids) { const kr = k.getBoundingClientRect(); if (kr.top < insets.top - 1) add('safe-area-top', k, `행동 위 ${Math.round(kr.top)}px < 노치 ${insets.top}px`); }
    }

    // 화면 본문(스크롤 상자)이 옆으로 넘친다: 자식 하나가 폭을 넘기면 본문 전체가 옆으로 밀려 제목·탭이 잘려 보인다(실기기 맥락 도서관). 문서 scrollWidth 에는 안 잡힌다. 긴 글자 주입(stress)은 고정 라벨에도 글자를 붙여 오탐이 많아 평소 모드에서만 본다.
    if (!stress && el.matches('.tk-screen__body') && el.scrollWidth > el.clientWidth + 1) {
      // 범인: 본문 오른쪽을 넘는 가장 안쪽 요소(가로 스크롤 상자 안쪽은 제외)
      const bx = el.getBoundingClientRect().right;
      let culprit = null;
      for (const k of el.querySelectorAll('*')) {
        if (!shown(k) || getComputedStyle(k).position === 'fixed') continue;
        if (k.getBoundingClientRect().right <= bx + 0.5) continue;
        let inScroller = false;
        for (let n = k.parentElement; n && n !== el; n = n.parentElement) if (getComputedStyle(n).overflowX !== 'visible') { inScroller = true; break; }
        if (!inScroller) culprit = k;
      }
      add('scroller-overflow-x', culprit ?? el, `본문 scrollWidth ${el.scrollWidth} > ${el.clientWidth}${culprit ? ' · 범인 오른쪽 ' + Math.round(culprit.getBoundingClientRect().right) : ''}: 폭을 넘기는 자식을 찾아 고친다`);
    }

    // iOS Safari 의 날짜·시각 입력은 appearance 기본값에서 자체 폭을 가져 부모 밖으로 튀어나간다. 부모 상자 안에 있어야 한다.
    if (el.matches('input[type=date],input[type=time],input[type=datetime-local],input[type=month],input[type=week]')) {
      const box = (el.closest('.tk-field,.tk-grid,.tk-cluster,.tk-stack') ?? el.parentElement).getBoundingClientRect();
      if (r.right > box.right + 1 || r.right > vw + 1) add('date-input-overflow', el, `입력 오른쪽 ${Math.round(r.right)} > 부모 ${Math.round(box.right)} (화면 ${vw}). .tk-input 의 appearance:none; max-width:100% 규칙을 쓴다`);
    }

    // flex 상자인 글자 하나짜리 요소의 text-overflow: ellipsis 는 먹지 않아 말줄임 없이 잘린다(WebKit). 글자를 span 에 담는다.
    if (s.display.includes('flex') && s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1 && el.children.length === 0 && el.textContent.trim()) add('ellipsis-on-flex-text', el, `flex 상자의 맨 글자는 말줄임이 안 된다(내용 ${el.scrollWidth} > ${el.clientWidth}). 글자를 span 에 담는다`);
  }

  // 파일 입력은 display:none(hidden)이면 iOS 가 선택 메뉴를 붙일 상자를 못 찾아 화면 중간 같은 엉뚱한 곳에 띄운다. 눌리는 버튼 위에 투명하게 겹쳐 둔다.
  for (const input of document.querySelectorAll('input[type=file]')) {
    if (skipped(input) || input.closest('dialog:not([open]), template')) continue;
    const rr = input.getBoundingClientRect();
    if (rr.width === 0 || rr.height === 0) add('file-input-hidden', input, 'input[type=file] 에 hidden/display:none 금지. iOS 선택 메뉴가 엉뚱한 곳에 뜬다. 버튼 위에 투명하게 겹친다');
    const slot = input.closest('.tk-file-slot');
    const button = slot?.querySelector(':scope > button');
    if (button && shown(button) && shown(input)) {
      const finding = fileButtonMismatch(rect(button.getBoundingClientRect()), rect(input.getBoundingClientRect()), sig(button));
      if (finding) out.push(finding);
    }
  }

  // 표 자체가 화면 밖으로 나간 경우만 보고한다. 표 내부의 스크롤은 상자가 화면 안에 있을 때 허용한다.
  for (const table of document.querySelectorAll('table')) {
    if (skipped(table) || !shown(table)) continue;
    let scroller = null;
    for (let n = table.parentElement; n && n !== document.body; n = n.parentElement) {
      if (['auto', 'scroll'].includes(getComputedStyle(n).overflowX)) { scroller = n; break; }
    }
    const finding = tableViewportFinding({
      sig: sig(table), table: rect(table.getBoundingClientRect()), viewport: { left: 0, right: vw },
      scroller: scroller ? rect(scroller.getBoundingClientRect()) : null,
      overflowX: scroller ? getComputedStyle(scroller).overflowX : 'visible',
      scrollWidth: scroller?.scrollWidth ?? table.scrollWidth,
      clientWidth: scroller?.clientWidth ?? table.clientWidth,
    });
    if (finding) out.push(finding);
  }

  return out;
};


// 모달 하나를 열어 잰다(열리는 애니메이션이 끝난 뒤 호출)
const inDialog = (d, { insets }) => {
  if (!d?.isConnected) throw new Error('dialog target was removed before measurement');
  const vw = innerWidth, vh = innerHeight, out = [];
  const sig = (el) => { const parts = []; for (let n = el, i = 0; n && n.nodeType === 1 && i < 3; n = n.parentElement, i++) parts.push(n.tagName.toLowerCase() + [...n.classList].slice(0, 2).map((c) => '.' + c).join('') + (n.id ? '#' + n.id : '')); return parts.reverse().join(' > '); };
  const add = (rule, el, detail) => out.push({ rule, sig: sig(el), detail });
  const r = d.getBoundingClientRect();
  const kind = d.matches('.tk-viewer-dialog,.tk-drawer,.tk-sheet') ? 'edge' : 'box';
  const my = insets ? insets.top + insets.bottom : 0;
  if (r.left < -1 || r.right > vw + 2 || r.top < -2 || r.bottom > vh + 2) add('dialog-outside-viewport', d, `${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)} (화면 ${vw}×${vh})`);
  else if (kind === 'box') {
    if (r.height > vh - my - 1 && vh > 300) add('dialog-fills-viewport', d, `높이 ${Math.round(r.height)} ≥ 화면 ${vh}${my ? ' − safe-area ' + my : ''}: 위아래 여백이 없다`);
    if (r.width > vw - 2 && vw > 360) add('dialog-edge-to-edge', d, `폭 ${Math.round(r.width)} = 화면 ${vw}`);
  }
  const body = d.querySelector('.tk-dialog__body, .tk-sheet__body, .tk-drawer__body');
  if (kind === 'box' && body && body.scrollHeight > body.clientHeight + 1 && !/(auto|scroll)/.test(getComputedStyle(body).overflowY)) add('dialog-body-not-scrollable', body, `내용 ${body.scrollHeight} > 본문 ${body.clientHeight}인데 overflow-y 가 스크롤이 아니다`);
  if (d.scrollWidth > d.clientWidth + 1 && getComputedStyle(d).overflowX === 'visible') add('dialog-overflow-x', d, `scrollWidth ${d.scrollWidth} > ${d.clientWidth}`);
  const scroller = (el) => { for (let n = el.parentElement; n && n !== d; n = n.parentElement) { if (getComputedStyle(n).overflowX !== 'visible') { const nr = n.getBoundingClientRect(); if (nr.right <= r.right + 1 && nr.left >= r.left - 1) return true; } } return false; };
  for (const el of d.querySelectorAll('*')) {
    const er = el.getBoundingClientRect();
    if (er.width && (er.right > r.right + 1 || er.left < r.left - 1) && getComputedStyle(el).visibility !== 'hidden' && !scroller(el) && !el.closest('svg,.tk-sr-only,[hidden]')) { add('dialog-child-escapes', el, `자식 ${Math.round(er.right)} > 모달 ${Math.round(r.right)}`); break; }
  }
  return out;
};

// WebKit: env(safe-area-inset-*) 를 px 로 치환한다(CSS 와, CSS 를 문자열로 내보내는 개발 서버의 JS 모듈 모두)
const rewriteSafeArea = (ctx, insets) => ctx.route((u) => /\.(css|tsx?|jsx?|mjs)(\?|$)/.test(u.pathname) || u.pathname.includes('/@') || u.pathname.includes('/node_modules/'), async (route) => {
  const res = await route.fetch();
  if (!/css|javascript/.test(res.headers()['content-type'] ?? '')) return route.fulfill({ response: res });
  const text = (await res.text()).replaceAll('env(safe-area-inset-top)', insets.top + 'px').replaceAll('env(safe-area-inset-bottom)', insets.bottom + 'px').replaceAll('env(safe-area-inset-left)', insets.left + 'px').replaceAll('env(safe-area-inset-right)', insets.right + 'px');
  return route.fulfill({ response: res, body: text });
});

// ---------- 실행 ----------
const browser = BROWSER === 'webkit' ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
const results = [];
const shotsDir = process.env.TK_SHOTS;
if (shotsDir) await mkdir(shotsDir, { recursive: true });
const modes = [
  { name: 'normal', stress: false }, { name: 'stress', stress: true },
];
for (const t of targets) {
  // 세로 폭들 + 가로 모드 폰(844×390, 노치 좌우 47 · 홈 바 21)
  const variants = [...WIDTHS.map((w) => ({ width: w, height: w <= 390 ? 700 : 800, label: String(w) })), ...(args['no-landscape'] ? [] : [{ width: 844, height: 390, landscape: true, label: '844L' }])];
  for (const variant of variants) {
    const { width } = variant;
    for (const mode of modes) {
      if (variant.landscape && mode.stress) continue;
      for (const scheme of (width === 390 && mode.stress ? ['light', 'dark'] : ['light'])) {
        const touch = width <= 844;
        const insets = variant.landscape ? { top: 0, bottom: 21, left: 47, right: 47 } : touch ? { top: 47, bottom: 34, left: 0, right: 0 } : null;
        // WebKit 은 폰 폭에서 iPhone 프리셋(UA·배율·터치)을 쓴다. 320 은 SE, 그 밖의 폰 폭은 iPhone 14.
        const preset = BROWSER === 'webkit' && touch ? (width <= 320 ? devices['iPhone SE'] : devices['iPhone 14']) : {};
        const ctx = await browser.newContext({ ...preset, viewport: { width, height: variant.height }, colorScheme: scheme, hasTouch: touch, isMobile: touch, serviceWorkers: 'block' });
        if (BROWSER === 'webkit' && insets) await rewriteSafeArea(ctx, insets);
        const page = await ctx.newPage();
        await page.addInitScript({ content: `window.__ttakkariLayoutFindSilentClip = ${findSilentClip.toString()};` });
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        if (stub) await stub(ctx, page, base);
        if (insets && BROWSER !== 'webkit') {
          try { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets }); } catch { /* 지원하지 않는 Chrome */ }
        }
        let found = [];
        let response;
        try {
          response = await page.goto(t.url, { waitUntil: args.url ? 'networkidle' : 'load', timeout: 30000 });
          const failure = navigationError(t.name, t.url, response?.status());
          if (failure) found.push(failure);
        } catch (e) {
          found.push(navigationError(t.name, t.url, null));
        }
        if (response?.ok()) {
          try {
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(args.url ? 400 : 150);
            found.push(...await page.evaluate(inPage, { stress: mode.stress, long: LONG, touch, insets, raw: !!args['stress-raw'] }));
            const dialogHandles = await page.locator('dialog').elementHandles();
            const dialogReport = await inspectDynamicTargets(dialogHandles, async (dialog) => {
              let openedByChecker = false;
              try {
                openedByChecker = await dialog.evaluate((d) => {
                  if (!d.isConnected) throw new Error('dialog target was removed before opening');
                  if (d.open) return false;
                  d.showModal();
                  return true;
                });
                await dialog.evaluate((d) => Promise.all(d.getAnimations().map((a) => a.finished.catch(() => {}))));
                const samples = await dialog.evaluate(async (d) => {
                  const sample = () => ({ open: d.open, rect: (() => { const r = d.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })() });
                  const frames = [sample()];
                  await new Promise(requestAnimationFrame);
                  frames.push(sample());
                  await new Promise(requestAnimationFrame);
                  frames.push(sample());
                  return frames;
                });
                const unstable = dialogMeasurementError(samples);
                if (unstable) throw new Error(unstable);
                return await dialog.evaluate(inDialog, { insets });
              } finally {
                if (openedByChecker) await dialog.evaluate((d) => {
                  if (!d.isConnected) throw new Error('dialog target was removed before closing');
                  if (d.open) d.close();
                  const failure = dialogClosedError(d.open);
                  if (failure) throw new Error(failure);
                });
              }
            }, (dialog) => dialog.evaluate((d) => d.isConnected));
            found.push(...dialogReport.findings, ...dialogReport.errors);
            if (shotsDir) await page.screenshot({ path: join(shotsDir, `${t.name.replace(/[^\w.-]+/g, '_')}-${width}-${mode.name}-${scheme}.png`), fullPage: false });
          } catch (e) {
            found.push({ rule: 'checker-error', status: 'unmeasured', sig: t.name, detail: String(e.message).split('\n')[0] });
          }
        }
        for (const e of errors) found.push(pageErrorFinding(t.name, e));
        // 같은 규칙·같은 서명은 한 번만
        const uniq = new Map();
        for (const f of found) { const k = f.rule + '|' + f.sig; if (!uniq.has(k)) uniq.set(k, f); }
        for (const f of uniq.values()) results.push({ page: t.name, width: variant.label, mode: mode.name, scheme, ...f });
        await ctx.close();
      }
    }
  }
}
await browser.close();
server?.close();

// ---------- 보고 ----------
const byRule = new Map();
for (const r of results) { if (!byRule.has(r.rule)) byRule.set(r.rule, []); byRule.get(r.rule).push(r); }
const total = targets.length * WIDTHS.length;
console.log(`[${BROWSER}] 레이아웃 검사 · 페이지 ${targets.length} × 폭 ${WIDTHS.join('/')}(+가로 모드 844×390) × (평소|긴 글자) = ${total * 2}+ 상태`);
if (!results.length) console.log('ok · 위반 0');
for (const [rule, list] of byRule) {
  console.log(`\n[${rule}] ${list.length}건`);
  const groups = new Map();
  for (const r of list) { const k = r.sig; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const [sig, g] of [...groups].slice(0, args.limit ? Number(args.limit) : 25)) {
    console.log(`  - ${sig}\n      ${g[0].status ? `[${g[0].status}] ` : ''}${g[0].detail} · ${[...new Set(g.map((x) => `${x.page}@${x.width}${x.mode === 'stress' ? 's' : ''}`))].slice(0, 4).join(', ')}${g.length > 4 ? ` 외 ${g.length - 4}` : ''}`);
  }
  if (groups.size > (args.limit ? Number(args.limit) : 25)) console.log(`  … ${groups.size - (args.limit ? Number(args.limit) : 25)}개 더`);
}
if (args.out) await writeFile(String(args.out), JSON.stringify(results, null, 1));
process.exit(results.length && !args['no-fail'] ? 1 : 0);
