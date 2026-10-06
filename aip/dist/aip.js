/* AIP design system — 동작 스크립트(의존성 없음). dist/aip.js 로 복사된다.
   CSS 만으로 안 되는 접근성 동작만 붙인다: 탭 키보드·동기화, 복사, 다이얼로그·드로어, 메뉴, 툴팁, TOC 위치 표시, 검색, 긴 코드 접기, 테마 전환.
   <script src="aip.js" defer></script> 로 넣으면 DOMContentLoaded 에 자동 초기화된다. 동적으로 붙인 영역은 AIP.init(root).
   마크업 계약은 docs/06·07 의 각 컴포넌트 절에 있다. 같은 요소를 두 번 초기화하지 않는다(data-aip-ready). */
(function () {
  'use strict';
  if (typeof window === 'undefined' || window.AIP) return;

  const STORAGE = { theme: 'aip-theme', sync: 'aip-sync:' };
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* 저장소가 막힌 환경에서는 기억만 포기한다 */ } },
  };
  const cssMs = (name, fallback) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  const once = (el, key) => { const k = `aipReady${key}`; if (el.dataset[k]) return false; el.dataset[k] = '1'; return true; };
  let uid = 0;
  const id = (prefix) => `${prefix}-${++uid}`;

  // ---------- 알림(스크린 리더) ----------
  let live;
  function announce(message) {
    if (!live) {
      live = document.createElement('div');
      live.className = 'aip-sr-only';
      live.setAttribute('aria-live', 'polite');
      document.body.append(live);
    }
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = message; });
  }

  // ---------- 테마: [data-aip-theme-toggle] ----------
  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
  }
  function currentTheme() {
    const forced = document.documentElement.dataset.theme;
    if (forced) return forced;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function initTheme(root) {
    root.querySelectorAll('[data-aip-theme-toggle]').forEach((btn) => {
      if (!once(btn, 'Theme')) return;
      const sync = () => {
        const dark = currentTheme() === 'dark';
        btn.setAttribute('aria-pressed', String(dark));
      };
      btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        store.set(STORAGE.theme, next);
        document.querySelectorAll('[data-aip-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(next === 'dark')));
      });
      sync();
    });
  }

  // ---------- 탭: role="tablist" > role="tab"[aria-controls] ----------
  function selectTab(tab, { focus = false, fromSync = false } = {}) {
    const list = tab.closest('[role="tablist"]');
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    const group = tab.closest('[data-aip-sync]');
    const value = tab.dataset.aipSyncValue;
    if (group && value && !fromSync) {
      const key = group.dataset.aipSync;
      store.set(STORAGE.sync + key, value);
      document.querySelectorAll(`[data-aip-sync="${CSS.escape(key)}"]`).forEach((other) => {
        if (other === group) return;
        const match = other.querySelector(`[role="tab"][data-aip-sync-value="${CSS.escape(value)}"]`);
        if (match && match.getAttribute('aria-selected') !== 'true') selectTab(match, { fromSync: true });
      });
    }
  }
  function initTabs(root) {
    root.querySelectorAll('[role="tablist"]').forEach((list) => {
      if (!once(list, 'Tabs')) return;
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      if (!tabs.length) return;
      const group = list.closest('[data-aip-sync]');
      const remembered = group && store.get(STORAGE.sync + group.dataset.aipSync);
      const initial = (remembered && tabs.find((t) => t.dataset.aipSyncValue === remembered))
        || tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      selectTab(initial, { fromSync: true });
      list.addEventListener('click', (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab && list.contains(tab)) selectTab(tab);
      });
      list.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        const next = { [vertical ? 'ArrowDown' : 'ArrowRight']: i + 1, [vertical ? 'ArrowUp' : 'ArrowLeft']: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        selectTab(tabs[(next + tabs.length) % tabs.length], { focus: true });
      });
    });
  }

  // ---------- 복사: [data-aip-copy] (값 없으면 가장 가까운 .aip-code 의 보이는 코드) ----------
  function copyText(source) {
    const clone = source.cloneNode(true);
    // 실행할 그대로: 셸 프롬프트·줄 번호·삭제된 diff 줄·장식은 뺀다
    clone.querySelectorAll('.aip-code__prompt, [aria-hidden="true"], [data-diff="-"]').forEach((n) => n.remove());
    const lines = clone.querySelectorAll('.aip-code__line');
    const text = lines.length ? [...lines].map((l) => l.textContent).join('\n') : clone.textContent;
    return text.replace(/\n$/, '');
  }
  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* 아래 폴백 */ }
    }
    const area = document.createElement('textarea');
    area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.append(area); area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    return ok;
  }
  function initCopy(root) {
    root.querySelectorAll('[data-aip-copy]').forEach((btn) => {
      if (!once(btn, 'Copy')) return;
      btn.addEventListener('click', async () => {
        const selector = btn.dataset.aipCopy;
        let source = selector ? document.querySelector(selector) : null;
        if (!source) {
          const scope = btn.closest('.aip-code, .aip-code-tabs');
          const panel = scope && [...scope.querySelectorAll('pre')].find((p) => !p.closest('[hidden]'));
          source = panel?.querySelector('code') ?? panel;
        }
        if (!source) return;
        const ok = await writeClipboard(copyText(source));
        clearTimeout(btn._aipTimer);
        if (ok) {
          btn.dataset.copied = '';
          announce(btn.dataset.aipCopiedLabel || 'Copied to clipboard');
          btn._aipTimer = setTimeout(() => delete btn.dataset.copied, cssMs('--aip-motion-duration-feedback', 1600));
        } else {
          announce('Copy failed — select the code and copy it manually');
        }
      });
    });
  }

  // ---------- 긴 코드 접기: .aip-code[data-collapsible] ----------
  function initCollapsible(root) {
    root.querySelectorAll('.aip-code[data-collapsible]').forEach((code) => {
      if (!once(code, 'Collapse')) return;
      const pre = code.querySelector('pre');
      if (!pre) return;
      const max = parseFloat(getComputedStyle(code).getPropertyValue('--aip-component-code-block-max-height')) || 560;
      if (pre.scrollHeight <= max + 48) return;
      code.dataset.collapsed = '';
      let bar = code.querySelector('.aip-code__expand');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'aip-code__expand';
        const lines = (pre.textContent.match(/\n/g) || []).length + 1;
        bar.innerHTML = `<button type="button">Show all ${lines} lines</button>`;
        code.append(bar);
      }
      bar.querySelector('button').addEventListener('click', () => {
        delete code.dataset.collapsed;
        pre.tabIndex = 0;
        pre.focus();
      });
    });
  }

  // ---------- 다이얼로그·드로어: [data-aip-dialog-open="id"] · [data-aip-dialog-close] ----------
  function initDialogs(root) {
    root.querySelectorAll('[data-aip-dialog-open]').forEach((trigger) => {
      if (!once(trigger, 'DialogOpen')) return;
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.addEventListener('click', () => {
        const dialog = document.getElementById(trigger.dataset.aipDialogOpen);
        if (!dialog || dialog.open) return;
        dialog._aipOpener = trigger;
        dialog.showModal();
        trigger.setAttribute('aria-expanded', 'true');
      });
    });
    root.querySelectorAll('dialog.aip-dialog, dialog.aip-drawer, dialog.aip-search').forEach((dialog) => {
      if (!once(dialog, 'Dialog')) return;
      dialog.addEventListener('click', (e) => {
        if (e.target.closest('[data-aip-dialog-close]')) dialog.close();
        // 스크림(대화상자 바깥) 클릭: 입력 중인 내용을 잃을 수 있는 대화상자는 data-aip-modal 로 막는다
        else if (e.target === dialog && !('aipModal' in dialog.dataset)) dialog.close();
      });
      dialog.addEventListener('close', () => {
        const opener = dialog._aipOpener;
        opener?.setAttribute('aria-expanded', 'false');
        if (opener && document.contains(opener)) opener.focus();
      });
    });
  }

  // ---------- 메뉴: button[aria-haspopup="menu"][aria-controls] + [role="menu"] ----------
  function initMenus(root) {
    root.querySelectorAll('[aria-haspopup="menu"][aria-controls]').forEach((trigger) => {
      if (!once(trigger, 'Menu')) return;
      const menu = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!menu) return;
      const items = () => [...menu.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])')];
      const open = (focusLast = false) => {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        const list = items();
        list.forEach((it) => { it.tabIndex = -1; });
        (focusLast ? list.at(-1) : (list.find((it) => it.getAttribute('aria-checked') === 'true') || list[0]))?.focus();
        document.addEventListener('pointerdown', outside, true);
      };
      const close = (returnFocus = true) => {
        if (menu.hidden) return;
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('pointerdown', outside, true);
        if (returnFocus) trigger.focus();
      };
      const outside = (e) => { if (!menu.contains(e.target) && !trigger.contains(e.target)) close(false); };
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', () => (menu.hidden ? open() : close()));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); open(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); open(true); }
      });
      let typed = '', typedTimer;
      menu.addEventListener('keydown', (e) => {
        const list = items();
        const i = list.indexOf(document.activeElement);
        const move = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: list.length - 1 }[e.key];
        if (move !== undefined) { e.preventDefault(); list[(move + list.length) % list.length]?.focus(); return; }
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key === 'Tab') { close(false); return; }
        if (e.key.length === 1 && /\S/.test(e.key)) {
          typed += e.key.toLowerCase();
          clearTimeout(typedTimer);
          typedTimer = setTimeout(() => { typed = ''; }, 500);
          list.find((it) => it.textContent.trim().toLowerCase().startsWith(typed))?.focus();
        }
      });
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('[role^="menuitem"]');
        if (!item || item.getAttribute('aria-disabled') === 'true') return;
        if (item.getAttribute('role') === 'menuitemradio') {
          menu.querySelectorAll('[role="menuitemradio"]').forEach((r) => r.setAttribute('aria-checked', String(r === item)));
          const label = trigger.querySelector('[data-aip-menu-value]');
          if (label) label.textContent = item.dataset.value ?? item.textContent.trim();
        }
        close();
      });
    });
  }

  // ---------- 툴팁: [data-aip-tooltip="문구"] (단축키는 data-aip-tooltip-kbd) ----------
  function initTooltips(root) {
    root.querySelectorAll('[data-aip-tooltip]').forEach((trigger) => {
      if (!once(trigger, 'Tooltip')) return;
      const tip = document.createElement('div');
      tip.className = 'aip-tooltip';
      tip.id = id('aip-tooltip');
      tip.setAttribute('role', 'tooltip');
      tip.textContent = trigger.dataset.aipTooltip;
      if (trigger.dataset.aipTooltipKbd) {
        const k = document.createElement('kbd');
        k.textContent = trigger.dataset.aipTooltipKbd;
        tip.append(k);
      }
      tip.hidden = true;
      document.body.append(tip);
      const described = trigger.getAttribute('aria-describedby');
      // 아이콘 버튼의 이름(aria-label)과 툴팁 문구가 같으면 설명으로 다시 읽히지 않게 연결하지 않는다
      if (trigger.getAttribute('aria-label') !== trigger.dataset.aipTooltip) trigger.setAttribute('aria-describedby', [described, tip.id].filter(Boolean).join(' '));
      let showTimer, hideTimer;
      const place = () => {
        const r = trigger.getBoundingClientRect();
        const t = tip.getBoundingClientRect();
        const gap = 8;
        let top = r.top - t.height - gap;
        if (top < gap) top = r.bottom + gap;
        const left = Math.min(Math.max(gap, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - gap);
        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;
      };
      const show = (delay) => {
        clearTimeout(hideTimer); clearTimeout(showTimer);
        showTimer = setTimeout(() => {
          tip.hidden = false; place();
          requestAnimationFrame(() => { tip.dataset.open = ''; });
        }, delay);
      };
      const hide = (now = false) => {
        clearTimeout(showTimer);
        hideTimer = setTimeout(() => { delete tip.dataset.open; tip.hidden = true; }, now ? 0 : 100);
      };
      trigger.addEventListener('pointerenter', () => show(cssMs('--aip-motion-duration-tooltip-delay', 400)));
      trigger.addEventListener('pointerleave', () => hide());
      trigger.addEventListener('focus', () => { if (trigger.matches(':focus-visible')) show(0); });
      trigger.addEventListener('blur', () => hide(true));
      tip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
      tip.addEventListener('pointerleave', () => hide());
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !tip.hidden) hide(true); });
    });
  }

  // ---------- TOC 현재 위치: .aip-toc a[href^="#"] → aria-current="true" ----------
  function initToc(root) {
    const links = [...root.querySelectorAll('.aip-toc a[href^="#"]')].filter((a) => once(a, 'Toc'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    const allLinks = () => [...document.querySelectorAll('.aip-toc a[href^="#"]')];
    const headings = [...new Set(links.map((a) => decodeURIComponent(a.hash.slice(1))))].map((h) => document.getElementById(h)).filter(Boolean);
    const visible = new Set();
    const setActive = (hid) => allLinks().forEach((a) => {
      if (decodeURIComponent(a.hash.slice(1)) === hid) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const offset = cssMs('--aip-size-layout-anchor-offset', 88);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      const top = headings.find((h) => visible.has(h));
      if (top) { setActive(top.id); return; }
      // 화면 안에 제목이 없으면(긴 절 한가운데) 지나온 마지막 제목
      const passed = headings.filter((h) => h.getBoundingClientRect().top < offset);
      setActive((passed.length ? passed.at(-1) : headings[0]).id);
    }, { rootMargin: `-${offset}px 0px -55% 0px` });
    headings.forEach((h) => io.observe(h));
  }

  // ---------- 검색: dialog.aip-search + [data-aip-search-open] + ⌘K·Ctrl+K·/ ----------
  function initSearch(root) {
    root.querySelectorAll('dialog.aip-search').forEach((dialog) => {
      if (!once(dialog, 'Search')) return;
      const input = dialog.querySelector('.aip-search__input');
      const list = dialog.querySelector('.aip-search__results');
      const empty = dialog.querySelector('.aip-search__empty');
      if (!input || !list) return;
      list.setAttribute('role', 'listbox');
      list.id ||= id('aip-search-list');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-autocomplete', 'list');
      const options = () => [...list.querySelectorAll('.aip-search__result')].filter((o) => !o.closest('[hidden]') && !o.hidden);
      list.querySelectorAll('.aip-search__result').forEach((o) => { o.setAttribute('role', 'option'); o.id ||= id('aip-search-option'); o.tabIndex = -1; });
      const select = (opt) => {
        list.querySelectorAll('.aip-search__result').forEach((o) => o.setAttribute('aria-selected', String(o === opt)));
        if (opt) { input.setAttribute('aria-activedescendant', opt.id); opt.scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
      };
      const filter = () => {
        const q = input.value.trim().toLowerCase();
        list.querySelectorAll('.aip-search__result').forEach((o) => { o.closest('li').hidden = q !== '' && !o.textContent.toLowerCase().includes(q); });
        list.querySelectorAll('.aip-search__group').forEach((g) => {
          let n = g.nextElementSibling, any = false;
          while (n && !n.classList.contains('aip-search__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
          g.hidden = !any;
        });
        const opts = options();
        if (empty) {
          empty.hidden = opts.length > 0;
          empty.querySelectorAll('[data-aip-search-query]').forEach((s) => { s.textContent = input.value.trim(); });
        }
        select(opts[0]);
      };
      input.addEventListener('input', filter);
      input.addEventListener('keydown', (e) => {
        const opts = options();
        const i = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
        // type="search" 인풋의 Esc 는 브라우저가 글자만 지운다. 검색에서는 Esc 한 번에 닫는 것이 약속이다
        if (e.key === 'Escape') { e.preventDefault(); dialog.close(); return; }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (opts.length) select(opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length]);
        } else if (e.key === 'Enter' && i >= 0) {
          e.preventDefault();
          opts[i].click();
        }
      });
      list.addEventListener('pointermove', (e) => { const o = e.target.closest('.aip-search__result'); if (o) select(o); });
      const openSearch = (opener) => {
        if (dialog.open) return;
        dialog._aipOpener = opener || document.activeElement;
        dialog.showModal();
        input.select();
        filter();
      };
      document.querySelectorAll('[data-aip-search-open]').forEach((t) => {
        if (!once(t, 'SearchOpen')) return;
        t.setAttribute('aria-haspopup', 'dialog');
        t.addEventListener('click', () => openSearch(t));
      });
      document.addEventListener('keydown', (e) => {
        const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
        if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
          e.preventDefault();
          openSearch();
        }
      });
      dialog.addEventListener('close', () => { input.value = ''; });
    });
  }

  function init(root = document) {
    initTheme(root);
    initTabs(root);
    initCopy(root);
    initCollapsible(root);
    initDialogs(root);
    initMenus(root);
    initTooltips(root);
    initToc(root);
    initSearch(root);
  }

  // 저장된 테마는 가능한 한 일찍(깜빡임 방지 스니펫은 docs/10 §4)
  applyTheme(store.get(STORAGE.theme));
  window.AIP = { init, announce, setTheme: (t) => { applyTheme(t); store.set(STORAGE.theme, t ?? ''); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
