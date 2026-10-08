/* Ttakkari design system — 동작 스크립트(의존성 없음). dist/tk.js 로 복사된다.
   CSS 만으로 안 되는 접근성 동작만 붙인다. 마크업 계약은 docs/06·07·08 의 각 절에 있다.
   <script src="tk.js" defer></script> 로 넣으면 DOMContentLoaded 에 자동 초기화된다. 동적으로 붙인 영역은 TK.init(root).
   React 앱은 이 파일을 쓰지 않고 같은 계약(ARIA·키보드·data 속성)을 컴포넌트로 구현한다(docs/19). 이 파일은 그 기준 구현이자 예제용이다.
   같은 요소를 두 번 초기화하지 않는다(data-tk-ready-*). */
(function () {
  'use strict';
  if (typeof window === 'undefined' || window.TK) return;

  const STORAGE = { theme: 'tk-theme', sync: 'tk-sync:', split: 'tk-split' };
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* 저장소가 막힌 환경에서는 기억만 포기한다 */ } },
  };
  const cssMs = (name, fallback) => {
    const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    return Number.isFinite(n) ? n : fallback;
  };
  const once = (el, key) => { const k = `tkReady${key}`; if (el.dataset[k]) return false; el.dataset[k] = '1'; return true; };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = () => matchMedia('(pointer: coarse)').matches;
  let uid = 0;
  const id = (prefix) => `${prefix}-${++uid}`;

  // ---------- 알림(스크린 리더) ----------
  let live;
  function announce(message) {
    if (!live) {
      live = document.createElement('div');
      live.className = 'tk-sr-only';
      live.setAttribute('aria-live', 'polite');
      document.body.append(live);
    }
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = message; });
  }

  // ---------- 테마: [data-tk-theme-toggle] ----------
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
    else delete root.dataset.theme;
  }
  function currentTheme() {
    const root = document.documentElement;
    if (root.dataset.theme) return root.dataset.theme;
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function initTheme(root) {
    root.querySelectorAll('[data-tk-theme-toggle]').forEach((btn) => {
      if (!once(btn, 'Theme')) return;
      btn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
      btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        store.set(STORAGE.theme, next);
        document.querySelectorAll('[data-tk-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(next === 'dark')));
        document.dispatchEvent(new CustomEvent('tk:themechange', { detail: { theme: next } }));
      });
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
    const group = tab.closest('[data-tk-sync]');
    const value = tab.dataset.tkSyncValue;
    if (group && value && !fromSync) {
      const key = group.dataset.tkSync;
      store.set(STORAGE.sync + key, value);
      document.querySelectorAll(`[data-tk-sync="${CSS.escape(key)}"]`).forEach((other) => {
        if (other === group) return;
        const match = other.querySelector(`[role="tab"][data-tk-sync-value="${CSS.escape(value)}"]`);
        if (match && match.getAttribute('aria-selected') !== 'true') selectTab(match, { fromSync: true });
      });
    }
    list.dispatchEvent(new CustomEvent('tk:tabchange', { bubbles: true, detail: { tab } }));
  }
  function initTabs(root) {
    root.querySelectorAll('[role="tablist"]').forEach((list) => {
      if (!once(list, 'Tabs')) return;
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      if (!tabs.length) return;
      const group = list.closest('[data-tk-sync]');
      const remembered = group && store.get(STORAGE.sync + group.dataset.tkSync);
      const initial = (remembered && tabs.find((t) => t.dataset.tkSyncValue === remembered))
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

  // ---------- 복사: [data-tk-copy] (값이 선택자면 그 요소, 비면 가장 가까운 .tk-code·.tk-log 의 내용) ----------
  function copyText(source) {
    const clone = source.cloneNode(true);
    // 실행할 그대로: 셸 프롬프트·장식·삭제된 diff 줄·로그 시각/레벨은 뺀다
    clone.querySelectorAll('.tk-code__prompt, [aria-hidden="true"], [data-diff="-"]').forEach((n) => n.remove());
    const lines = clone.querySelectorAll('.tk-code__line');
    if (lines.length) return [...lines].map((l) => l.textContent).join('\n').replace(/\n$/, '');
    const logLines = clone.querySelectorAll('.tk-log__lines > li');
    if (logLines.length) return [...logLines].map((l) => [...l.children].map((c) => c.textContent).join(' ')).join('\n');
    return clone.textContent.replace(/\n$/, '');
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
    root.querySelectorAll('[data-tk-copy]').forEach((btn) => {
      if (!once(btn, 'Copy')) return;
      btn.addEventListener('click', async () => {
        const value = btn.dataset.tkCopy;
        let text = null;
        if (btn.hasAttribute('data-tk-copy-text')) text = btn.dataset.tkCopyText;
        else {
          let source = value ? document.querySelector(value) : null;
          if (!source) {
            const scope = btn.closest('.tk-code, .tk-log, .tk-message');
            const pre = scope && [...scope.querySelectorAll('pre, .tk-log__lines, .tk-message__body')].find((p) => !p.closest('[hidden]'));
            source = pre?.matches('pre') ? (pre.querySelector('code') ?? pre) : pre;
          }
          if (source) text = copyText(source);
        }
        if (text == null) return;
        const ok = await writeClipboard(text);
        clearTimeout(btn._tkTimer);
        if (ok) {
          btn.dataset.copied = '';
          announce(btn.dataset.tkCopiedLabel || '복사했어요');
          btn._tkTimer = setTimeout(() => delete btn.dataset.copied, cssMs('--tk-motion-duration-feedback', 1600));
        } else {
          announce('복사하지 못했어요. 직접 선택해서 복사해 주세요');
        }
      });
    });
  }

  // ---------- 긴 코드 접기: .tk-code[data-collapsible] ----------
  function initCollapsible(root) {
    root.querySelectorAll('.tk-code[data-collapsible]').forEach((code) => {
      if (!once(code, 'Collapse')) return;
      const pre = code.querySelector('pre');
      if (!pre) return;
      const max = parseFloat(getComputedStyle(code).getPropertyValue('--tk-component-code-block-max-height')) || 480;
      if (pre.scrollHeight <= max + 48) return;
      code.dataset.collapsed = '';
      let bar = code.querySelector('.tk-code__expand');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'tk-code__expand';
        const lines = (pre.textContent.match(/\n/g) || []).length + 1;
        bar.innerHTML = `<button type="button">${lines}줄 모두 보기</button>`;
        code.append(bar);
      }
      bar.querySelector('button').addEventListener('click', () => {
        delete code.dataset.collapsed;
        pre.tabIndex = 0;
        pre.focus();
      });
    });
  }

  // ---------- 다이얼로그·시트·드로어·전체 화면 뷰어: [data-tk-dialog-open="id"] · [data-tk-dialog-close] ----------
  const DIALOGS = 'dialog.tk-dialog, dialog.tk-sheet, dialog.tk-drawer, dialog.tk-viewer-dialog';
  function openDialog(dialog, opener) {
    if (!dialog || dialog.open) return;
    dialog._tkOpener = opener || document.activeElement;
    dialog.showModal();
    opener?.setAttribute('aria-expanded', 'true');
  }
  function initDialogs(root) {
    root.querySelectorAll('[data-tk-dialog-open]').forEach((trigger) => {
      if (!once(trigger, 'DialogOpen')) return;
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', () => openDialog(document.getElementById(trigger.dataset.tkDialogOpen), trigger));
    });
    root.querySelectorAll(DIALOGS).forEach((dialog) => {
      if (!once(dialog, 'Dialog')) return;
      dialog.addEventListener('click', (e) => {
        if (e.target.closest('[data-tk-dialog-close]')) dialog.close(e.target.closest('[data-tk-dialog-close]').dataset.tkDialogClose || '');
        // 스크림(대화상자 바깥) 클릭. 입력 중인 내용·결정을 잃을 수 있는 대화상자(승인·재인증)는 data-tk-modal 로 막는다
        else if (e.target === dialog && !('tkModal' in dialog.dataset)) dialog.close();
      });
      dialog.addEventListener('cancel', (e) => { if ('tkModal' in dialog.dataset && dialog.dataset.tkModal === 'strict') e.preventDefault(); });
      dialog.addEventListener('close', () => {
        const opener = dialog._tkOpener;
        opener?.setAttribute?.('aria-expanded', 'false');
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
      const outside = (e) => { if (!menu.contains(e.target) && !trigger.contains(e.target)) close(false); };
      const open = (focusLast = false) => {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        const list = items();
        list.forEach((it) => { it.tabIndex = -1; });
        (focusLast ? list.at(-1) : (list.find((it) => it.getAttribute('aria-checked') === 'true') || list[0]))?.focus();
        document.addEventListener('pointerdown', outside, true);
      };
      function close(returnFocus = true) {
        if (menu.hidden) return;
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('pointerdown', outside, true);
        if (returnFocus) trigger.focus();
      }
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
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
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
          const label = trigger.querySelector('[data-tk-menu-value]');
          if (label) label.textContent = item.dataset.value ?? item.textContent.trim();
        }
        close();
      });
    });
  }

  // ---------- 툴팁: [data-tk-tooltip="문구"] (단축키는 data-tk-tooltip-kbd) ----------
  function initTooltips(root) {
    root.querySelectorAll('[data-tk-tooltip]').forEach((trigger) => {
      if (!once(trigger, 'Tooltip')) return;
      const tip = document.createElement('div');
      tip.className = 'tk-tooltip';
      tip.id = id('tk-tooltip');
      tip.setAttribute('role', 'tooltip');
      tip.textContent = trigger.dataset.tkTooltip;
      if (trigger.dataset.tkTooltipKbd) {
        const k = document.createElement('kbd');
        k.textContent = trigger.dataset.tkTooltipKbd;
        tip.append(k);
      }
      tip.hidden = true;
      document.body.append(tip);
      // 아이콘 버튼의 이름(aria-label)과 툴팁 문구가 같으면 설명으로 다시 읽히지 않게 연결하지 않는다
      if (trigger.getAttribute('aria-label') !== trigger.dataset.tkTooltip) {
        trigger.setAttribute('aria-describedby', [trigger.getAttribute('aria-describedby'), tip.id].filter(Boolean).join(' '));
      }
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
      // 터치에서는 툴팁을 띄우지 않는다(누르는 순간 동작이 일어난다). 그래서 툴팁에만 있는 정보가 있으면 안 된다
      trigger.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') show(cssMs('--tk-motion-duration-tooltip-delay', 400)); });
      trigger.addEventListener('pointerleave', () => hide());
      trigger.addEventListener('focus', () => { if (trigger.matches(':focus-visible')) show(0); });
      trigger.addEventListener('blur', () => hide(true));
      trigger.addEventListener('click', () => hide(true));
      tip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
      tip.addEventListener('pointerleave', () => hide());
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !tip.hidden) hide(true); });
    });
  }

  // ---------- 토스트: TK.toast({ message, tone, action: { label, onClick }, duration }) ----------
  function toast({ message, tone = 'neutral', icon, action, duration } = {}) {
    let region = document.querySelector('.tk-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'tk-toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      (document.querySelector('.tk-app') ?? document.body).append(region);
    }
    const el = document.createElement('div');
    el.className = `tk-toast${tone !== 'neutral' ? ` tk-toast--${tone}` : ''}`;
    const ICON = { success: 'M20 6 9 17l-5-5', danger: 'M12 8v4m0 4h.01M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0', warning: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0' };
    const path = icon ?? ICON[tone];
    if (path) el.insertAdjacentHTML('beforeend', `<svg class="tk-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`);
    const text = document.createElement('span');
    text.className = 'tk-toast__text';
    text.textContent = message;
    el.append(text);
    const dismiss = () => {
      if (el.dataset.leaving != null) return;
      el.dataset.leaving = '';
      setTimeout(() => el.remove(), reduced() ? 0 : cssMs('--tk-motion-duration-normal', 180));
    };
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tk-toast__action';
      b.textContent = action.label;
      b.addEventListener('click', () => { action.onClick?.(); dismiss(); });
      el.append(b);
    }
    region.append(el);
    // 행동이 있으면 자동으로 닫지 않는다(읽고 누를 시간을 뺏지 않는다)
    if (!action) setTimeout(dismiss, duration ?? cssMs('--tk-motion-duration-toast', 5000));
    return { dismiss };
  }

  // ---------- 컴포저: form[data-tk-composer] > textarea.tk-composer__input + .tk-composer__send ----------
  // Enter 보내기(정밀 포인터), Shift+Enter 줄바꿈, ⌘/Ctrl+Enter 는 어디서나 보내기. 터치 기기의 Enter 는 줄바꿈(키보드에 보내기 버튼이 없다).
  // 한글 조합 중(isComposing)의 Enter 는 보내지 않는다 — 마지막 글자가 잘리는 고전적 버그.
  function initComposers(root) {
    root.querySelectorAll('[data-tk-composer]').forEach((form) => {
      if (!once(form, 'Composer')) return;
      const input = form.querySelector('.tk-composer__input');
      const send = form.querySelector('.tk-composer__send');
      if (!input) return;
      const grow = () => {
        if (CSS.supports('field-sizing', 'content')) return;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
      };
      const sync = () => {
        const empty = !input.value.trim();
        if (send && !send.hasAttribute('data-tk-stop')) send.setAttribute('aria-disabled', String(empty || 'offline' in form.dataset));
        grow();
      };
      input.addEventListener('input', sync);
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
        const mod = e.metaKey || e.ctrlKey;
        if (mod || (!e.shiftKey && !coarse())) {
          e.preventDefault();
          form.requestSubmit();
        }
      });
      form.addEventListener('submit', (e) => {
        if (send?.getAttribute('aria-disabled') === 'true' && !send.hasAttribute('data-tk-stop')) { e.preventDefault(); e.stopImmediatePropagation(); }
      });
      sync();
    });
    // 제안 칩: [data-tk-suggest="문구"] 를 누르면 가장 가까운(또는 data-tk-target) 컴포저에 채운다. 바로 보내지 않는다
    root.querySelectorAll('[data-tk-suggest]').forEach((chip) => {
      if (!once(chip, 'Suggest')) return;
      chip.addEventListener('click', () => {
        const input = (chip.dataset.tkTarget && document.querySelector(chip.dataset.tkTarget)) || document.querySelector('[data-tk-composer] .tk-composer__input');
        if (!input) return;
        input.value = chip.dataset.tkSuggest || chip.textContent.trim();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      });
    });
  }

  // ---------- 스레드 따라가기: .tk-thread[data-tk-follow] + .tk-jump ----------
  // 바닥 근처에 있으면 새 메시지를 따라 내려가고, 위로 올려 읽는 중이면 끌어내리지 않고 '최신으로' 버튼을 띄운다.
  function initThreads(root) {
    root.querySelectorAll('.tk-thread[data-tk-follow]').forEach((thread) => {
      if (!once(thread, 'Thread')) return;
      const jump = thread.querySelector('.tk-jump');
      const nearBottom = () => thread.scrollHeight - thread.scrollTop - thread.clientHeight < 96;
      const toBottom = (smooth) => thread.scrollTo({ top: thread.scrollHeight, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
      let stick = true;
      thread.addEventListener('scroll', () => {
        stick = nearBottom();
        if (stick && jump) jump.hidden = true;
      }, { passive: true });
      jump?.addEventListener('click', () => { toBottom(true); jump.hidden = true; });
      new MutationObserver(() => {
        if (stick) toBottom(false);
        else if (jump) jump.hidden = false;
      }).observe(thread.querySelector('.tk-thread__inner') ?? thread, { childList: true, subtree: true, characterData: true });
      toBottom(false);
    });
  }

  // ---------- 로그 따라가기: .tk-log 안 [data-tk-log-follow] 토글(aria-pressed) ----------
  function initLogs(root) {
    root.querySelectorAll('.tk-log').forEach((log) => {
      if (!once(log, 'Log')) return;
      const body = log.querySelector('.tk-log__body');
      const toggle = log.querySelector('[data-tk-log-follow]');
      if (!body) return;
      const following = () => !toggle || toggle.getAttribute('aria-pressed') === 'true';
      toggle?.addEventListener('click', () => {
        const next = !following();
        toggle.setAttribute('aria-pressed', String(next));
        if (next) body.scrollTop = body.scrollHeight;
      });
      // 손으로 위로 올리면 따라가기를 끈다(읽던 곳을 빼앗지 않는다)
      body.addEventListener('wheel', (e) => { if (e.deltaY < 0 && toggle) toggle.setAttribute('aria-pressed', 'false'); }, { passive: true });
      new MutationObserver(() => { if (following()) body.scrollTop = body.scrollHeight; }).observe(body, { childList: true, subtree: true });
      if (following()) body.scrollTop = body.scrollHeight;
    });
  }

  // ---------- 분할 손잡이: .tk-split > .tk-split__handle[role="separator"] ----------
  function initSplits(root) {
    root.querySelectorAll('.tk-split').forEach((split) => {
      const handle = split.querySelector(':scope > .tk-split__handle');
      const pane = split.querySelector(':scope > .tk-split__pane--secondary');
      if (!handle || !pane || !once(split, 'Split')) return;
      const min = () => parseFloat(getComputedStyle(split).getPropertyValue('--tk-size-layout-pane-min')) || 360;
      const clamp = (w) => Math.max(min(), Math.min(split.clientWidth - min(), w));
      const set = (w, save = true) => {
        const width = clamp(w);
        split.style.setProperty('--tk-_split', `${Math.round(width)}px`);
        const pct = Math.round((width / split.clientWidth) * 100);
        handle.setAttribute('aria-valuenow', String(pct));
        if (save) store.set(STORAGE.split, String(Math.round(width)));
      };
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-orientation', 'vertical');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.tabIndex = 0;
      const saved = Number(store.get(STORAGE.split));
      if (saved) requestAnimationFrame(() => set(saved, false));
      handle.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        handle.dataset.dragging = '';
        const right = split.getBoundingClientRect().right;
        const move = (ev) => set(right - ev.clientX);
        const up = () => { delete handle.dataset.dragging; handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
      });
      handle.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 96 : 32;
        const w = pane.getBoundingClientRect().width;
        const next = { ArrowLeft: w + step, ArrowRight: w - step, Home: split.clientWidth - min(), End: min() }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        set(next);
      });
    });
  }

  // ---------- 뷰어 배율: .tk-viewer 안 [data-tk-zoom="in|out|fit"] → .tk-desk·.tk-stage 의 --tk-zoom ----------
  const ZOOM = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  function initZoom(root) {
    root.querySelectorAll('.tk-viewer').forEach((viewer) => {
      if (!once(viewer, 'Zoom')) return;
      const target = () => viewer.querySelector('.tk-desk:not([hidden] *), .tk-stage:not([hidden] *)');
      const value = viewer.querySelector('[data-tk-zoom-value]');
      const get = () => parseFloat(target()?.style.getPropertyValue('--tk-zoom')) || 1;
      const set = (z) => {
        const t = target();
        if (!t) return;
        t.style.setProperty('--tk-zoom', String(z));
        const label = `${Math.round(z * 100)}%`;
        if (value) value.textContent = label;
        viewer.querySelectorAll('[data-tk-zoom="out"]').forEach((b) => b.setAttribute('aria-disabled', String(z <= ZOOM[0])));
        viewer.querySelectorAll('[data-tk-zoom="in"]').forEach((b) => b.setAttribute('aria-disabled', String(z >= ZOOM.at(-1))));
        announce(`배율 ${label}`);
      };
      viewer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-tk-zoom]');
        if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
        const z = get();
        const mode = btn.dataset.tkZoom;
        if (mode === 'fit') set(1);
        else if (mode === 'in') set(ZOOM.find((s) => s > z + 0.001) ?? ZOOM.at(-1));
        else if (mode === 'out') set([...ZOOM].reverse().find((s) => s < z - 0.001) ?? ZOOM[0]);
      });
    });
  }

  // ---------- 뷰어 찾기: [data-tk-find-open] → .tk-findbar(input[data-tk-find]) · 대상 .tk-viewer__body 의 글자 ----------
  function initFind(root) {
    root.querySelectorAll('.tk-viewer').forEach((viewer) => {
      const bar = viewer.querySelector('.tk-findbar');
      const input = bar?.querySelector('[data-tk-find]');
      if (!bar || !input || !once(viewer, 'Find')) return;
      const count = bar.querySelector('.tk-findbar__count');
      const opener = viewer.querySelector('[data-tk-find-open]');
      let hits = [], index = -1;
      const scope = () => [...viewer.querySelectorAll('.tk-viewer__body')].find((b) => !b.closest('[hidden]'));
      const clear = () => {
        viewer.querySelectorAll('mark[data-hit]').forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
        viewer.querySelectorAll('.tk-viewer__body').forEach((b) => b.normalize());
        hits = []; index = -1;
      };
      const focusHit = (i) => {
        if (!hits.length) { if (count) count.textContent = input.value ? '0/0' : ''; return; }
        index = (i + hits.length) % hits.length;
        hits.forEach((h, n) => (n === index ? h.setAttribute('aria-current', 'true') : h.removeAttribute('aria-current')));
        hits[index].scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
        if (count) count.textContent = `${index + 1}/${hits.length}`;
      };
      const search = () => {
        clear();
        const q = input.value.trim().toLowerCase();
        const body = scope();
        if (!q || !body) { focusHit(0); return; }
        const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest('script, style, iframe') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
          const text = node.textContent;
          const lower = text.toLowerCase();
          let at = lower.indexOf(q);
          if (at < 0) continue;
          const frag = document.createDocumentFragment();
          let last = 0;
          while (at >= 0) {
            frag.append(text.slice(last, at));
            const m = document.createElement('mark');
            m.dataset.hit = '';
            m.textContent = text.slice(at, at + q.length);
            frag.append(m);
            hits.push(m);
            last = at + q.length;
            at = lower.indexOf(q, last);
          }
          frag.append(text.slice(last));
          node.replaceWith(frag);
        }
        focusHit(0);
        announce(hits.length ? `${hits.length}개 찾음` : '찾는 글자가 없어요');
      };
      const open = () => { bar.hidden = false; opener?.setAttribute('aria-expanded', 'true'); input.focus(); input.select(); };
      const close = () => { bar.hidden = true; clear(); opener?.setAttribute('aria-expanded', 'false'); opener?.focus(); };
      opener?.setAttribute('aria-expanded', 'false');
      opener?.addEventListener('click', () => (bar.hidden ? open() : close()));
      let t;
      input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(search, 120); });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); if (!hits.length) search(); else focusHit(index + (e.shiftKey ? -1 : 1)); }
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      });
      bar.querySelector('[data-tk-find-prev]')?.addEventListener('click', () => focusHit(index - 1));
      bar.querySelector('[data-tk-find-next]')?.addEventListener('click', () => focusHit(index + 1));
      bar.querySelector('[data-tk-find-close]')?.addEventListener('click', close);
      viewer.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); open(); }
      });
    });
  }

  // ---------- 선택 모드: [data-tk-select-scope] 안 input[data-tk-select] → [data-tk-selectionbar] ----------
  function initSelection(root) {
    root.querySelectorAll('[data-tk-select-scope]').forEach((scope) => {
      if (!once(scope, 'Select')) return;
      const bar = (scope.dataset.tkSelectScope && document.querySelector(scope.dataset.tkSelectScope)) || scope.querySelector('[data-tk-selectionbar]');
      const sync = () => {
        const boxes = [...scope.querySelectorAll('input[data-tk-select]')];
        const n = boxes.filter((b) => b.checked).length;
        boxes.forEach((b) => b.closest('.tk-list__item')?.setAttribute('aria-selected', String(b.checked)));
        if (bar) {
          const was = bar.hidden;
          bar.hidden = n === 0;
          bar.querySelectorAll('[data-tk-select-count]').forEach((c) => { c.textContent = String(n); });
          if (was && n > 0) announce(`${n}개 선택됨`);
        }
      };
      scope.addEventListener('change', (e) => { if (e.target.matches('input[data-tk-select]')) sync(); });
      bar?.querySelector('[data-tk-select-clear]')?.addEventListener('click', () => {
        scope.querySelectorAll('input[data-tk-select]').forEach((b) => { b.checked = false; });
        sync();
      });
      sync();
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
    initComposers(root);
    initThreads(root);
    initLogs(root);
    initSplits(root);
    initZoom(root);
    initFind(root);
    initSelection(root);
  }

  // 저장된 테마는 가능한 한 일찍(깜빡임 방지 스니펫은 docs/11 §3)
  applyTheme(store.get(STORAGE.theme));
  window.TK = { init, announce, toast, openDialog: (idOrEl, opener) => openDialog(typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl, opener), setTheme: (t) => { applyTheme(t); store.set(STORAGE.theme, t ?? ''); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
