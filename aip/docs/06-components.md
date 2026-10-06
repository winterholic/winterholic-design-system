# 06 · 컴포넌트 (AIP core)

규격만이 아니라 **구현**이 있다: `dist/components.css`(CSS) + `dist/aip.js`(키보드·복사·다이얼로그 같은 동작). 소스는 `components/*.css`, 빌드가 lint 한 뒤 묶는다. 각 절은 **마크업 계약 → 변형 → 상태 → 접근성** 순서다. 문서 전용 컴포넌트는 [07](07-documentation.md), MakeAIP·Playground 조각은 [13](13-page-patterns.md).

설계 원칙: **기본값이 정답이다.** 클래스 하나면 가장 흔한 경우가 나온다. modifier 는 정말 다를 때만 붙이고, 같은 의미를 두 가지 방식으로 쓰게 하지 않는다.

공통 상태: `default` `hover` `active` `focus-visible` `disabled` `loading`. 입력류는 `invalid` `readonly` 가 더 있다. 상태 표시는 ARIA 속성이 정본이다(`aria-selected` `aria-current` `aria-invalid` `aria-busy` `aria-disabled` `aria-expanded`). CSS 는 그 속성을 읽는다. 클래스로 상태를 따로 두지 않는다.

---

## 1. Button

```html
<button class="aip-button" type="button">Cancel</button>                       <!-- 기본: secondary · md -->
<button class="aip-button aip-button--primary" type="submit">Generate</button>
<button class="aip-button aip-button--sm aip-button--ghost" type="button">
  <svg class="aip-icon" aria-hidden="true">…</svg>Copy
</button>
```

| variant | 언제 | size | 높이 | 좌우 | 아이콘 |
|---|---|---|---|---|---|
| (없음) = secondary | 기본. 대안·일반 행동 | `--xs` | 24 | 8 | 16 |
| `--primary` | 화면의 주 목적 1개 | `--sm` | 32 | 12 | 16 |
| `--ghost` | 도구(툴바·카드 안) | (없음) = md | 40 | 16 | 20 |
| `--danger` | 되돌릴 수 없는 파괴 | `--lg` | 48 | 24 | 20 |

`--block` 은 모바일 주 액션에서 전폭. 같은 줄 버튼은 같은 size, 묶음은 `.aip-button-group`(간격 12).

| 상태 | 처리 |
|---|---|
| hover / active | `bg-hover` / `bg-active`. 120ms |
| focus-visible | 전역 링 2px offset 2px |
| disabled | `disabled` 속성. 이유를 보여줘야 하면 `aria-disabled="true"` + 툴팁(포커스가 남는다) |
| loading | `aria-busy="true"` + `disabled`. 폭 유지, 라벨 자리에 스피너 |

접근성: 이동이면 `<a>`, 동작이면 `<button type>`. 아이콘만 있으면 Icon Button.

## 2. Icon Button

```html
<button class="aip-icon-button" type="button" aria-label="Copy link" data-aip-tooltip="Copy link">
  <svg class="aip-icon" aria-hidden="true">…</svg>
</button>
```
정사각형. 기본 ghost·md(40). `--secondary`(테두리), `--xs`·`--sm`·`--lg`. **`aria-label` 필수**(테스트가 examples 를 검사). 툴팁 문구가 aria-label 과 같으면 aip.js 가 설명으로 다시 연결하지 않는다. 터치 기기에서 xs·sm 은 보이지 않는 히트 영역이 8px 씩 커진다.

## 3. Link

```html
<a class="aip-link" href="…">policy</a>                                  <!-- 문장 안: 밑줄 -->
<a class="aip-link aip-link--standalone" href="…">Read the spec</a>        <!-- 단독: 밑줄 없음 + → -->
<a class="aip-link" href="…" target="_blank" rel="noopener">GitHub<span class="aip-sr-only"> (opens in a new tab)</span></a>
```
문서 본문(`.aip-doc`) 안의 맨 `<a>` 는 클래스 없이 같은 모양이다. 밑줄은 40% 색, hover 에서 진해진다. 색만으로 링크를 구분하지 않는다(밑줄 또는 화살표).

## 4. Field · Input · Textarea · Select

```html
<div class="aip-field">
  <label class="aip-label" for="name">Name <span class="aip-label__optional">optional</span></label>
  <input class="aip-input" id="name" aria-describedby="name-help">
  <p class="aip-help" id="name-help">Lowercase, numbers, dashes.</p>
</div>
<span class="aip-select"><select id="db">…</select></span>                  <!-- Select 는 래퍼에 클래스 -->
<span class="aip-input-wrap"><svg class="aip-icon">…</svg><input class="aip-input aip-input--sm" type="search"></span>
<textarea class="aip-textarea" id="desc"></textarea>                      <!-- Textarea -->
```

| size | 높이 | 글자 | 언제 |
|---|---|---|---|
| `--sm` | 32 | 14 | 툴바·필터·Playground |
| (없음) md | 40 | 16 | 폼 기본 |
| `--lg` | 48 | 16 | 랜딩·검색 다이얼로그 |

`--mono` 는 기계값 입력(패키지 이름·ID). 모바일에서 16px 미만 인풋은 iOS 가 확대하므로 폼 기본은 md 다.

| 상태 | 처리 |
|---|---|
| hover | 테두리 `text.tertiary` |
| focus-visible | 테두리 + 안쪽 1px = 2px 파랑(바깥 링 대신, 줄지어 놓인 인풋끼리 링이 겹치지 않게) |
| invalid | `aria-invalid="true"` + `.aip-error`(아이콘 + 문구)가 도움말을 **대체**. 빨간 테두리 |
| disabled | `surface.disabled` + `text.disabled` |
| readonly | `surface.subtle` + 점선 테두리 |

라벨은 항상 보인다. 플레이스홀더는 예시만 쓴다. Textarea 최소 96px, 세로로만 늘어난다.

## 5. Checkbox · Radio · Switch

```html
<fieldset class="aip-fieldset"><legend>Features</legend>
  <div class="aip-choices">
    <label class="aip-checkbox"><input type="checkbox" checked> Authentication</label>
    <label class="aip-checkbox"><input type="checkbox"> <span>Audit log<span class="aip-choice__desc">Record every intent.</span></span></label>
  </div>
</fieldset>
<label class="aip-radio"><input type="radio" name="rt" checked> Node.js</label>
<label class="aip-switch"><input type="checkbox" role="switch"> Include examples</label>
```
네이티브 input 위에 얹는다. 시각 18px, 클릭 영역은 라벨 전체. `.aip-choices--inline` 은 가로. 선택지 묶음은 **fieldset + legend 가 정답**이다(스크린 리더가 그룹 이름을 읽는다). legend 에 `.aip-heading-3` 처럼 글자 클래스를 붙이면 그 크기가 이긴다.
Switch 는 즉시 반영(테마·자동 저장), Checkbox 는 제출해야 반영. `indeterminate` 는 가로 막대.

## 6. Segmented

```html
<div class="aip-segmented" role="radiogroup" aria-label="Language">
  <label><input type="radio" name="lang" checked>TypeScript</label>
  <label><input type="radio" name="lang">Python</label>
</div>
```
2~4개의 짧은 상호 배타 옵션. 라디오라 화살표 키가 공짜다. 높이 32, 트랙 `surface.sunken`, 활성 칸 `surface.default` + `shadow.xs`. 5개 이상이면 Select.

## 7. Tabs

```html
<div class="aip-tablist" role="tablist" aria-label="Project view">
  <button class="aip-tab" role="tab" id="t1" aria-controls="p1" aria-selected="true">Overview</button>
  <button class="aip-tab" role="tab" id="t2" aria-controls="p2" aria-selected="false">Intents</button>
</div>
<div class="aip-tabpanel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
<div class="aip-tabpanel" role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0" hidden>…</div>
```
밑줄 탭 하나뿐이다(높이 40, 간격 24, 활성 밑줄 2px `border.brand`). aip.js 가 roving tabindex·←→·Home·End 를 붙이고 선택 즉시 패널을 바꾼다. 페이지 이동이면 Tabs 가 아니라 Nav. 탭 안 탭 금지. 좁으면 가로 스크롤.

## 8. Badge · Version

```html
<span class="aip-badge">draft</span>                         <!-- neutral -->
<span class="aip-badge aip-badge--success">passed</span>
<span class="aip-version">v0.4.0</span><span class="aip-badge aip-badge--beta">beta</span>
<span class="aip-badge aip-badge--count">12</span>
```
높이 20, radius 4(각진 라벨 = 명세 성격). 상태 `--info --success --warning --danger`, 성숙도 `--stable --beta --experimental --deprecated`, `--count` 만 둥글다. 배지는 **단어**다. 색만 있는 점 배지는 없다. 한 줄에 셋을 넘기지 않는다.

## 9. Card

```html
<div class="aip-card">
  <p class="aip-card__eyebrow">Concept</p>
  <p class="aip-card__title">Intent</p>
  <p class="aip-card__body">What the caller needs.</p>
</div>
<a class="aip-card" href="…">…</a>      <!-- 클릭 가능한 카드 = 링크 하나 -->
```
테두리 `border.default`, radius 8, 패딩 20(`--lg` 24). 그림자는 링크 카드 hover 에만. 카드 안에 버튼을 넣으면 카드 전체를 링크로 만들지 않는다. **문서 본문 안에는 카드를 넣지 않는다.**

## 10. Callout

```html
<aside class="aip-callout aip-callout--warning" role="note">
  <svg class="aip-icon aip-callout__icon" aria-hidden="true">…</svg>
  <div class="aip-callout__body">
    <strong class="aip-callout__title">Warning</strong>
    <p>Never trust an actor id sent by the caller.</p>
  </div>
</aside>
```

| 종류 | 색 | 아이콘(Lucide) | Markdown |
|---|---|---|---|
| `--note` | `status.info` | `info` | `> [!NOTE]` |
| `--tip` | `status.success` | `lightbulb` | `> [!TIP]` |
| `--important` | `highlight`(형광펜 노랑) | `highlighter` | `> [!IMPORTANT]` |
| `--warning` | `status.warning`(탱저린) | `triangle-alert` | `> [!WARNING]` |
| `--caution` | `status.danger` | `octagon-alert` | `> [!CAUTION]` |

이름이 GitHub alert 와 같아서 Markdown 으로 쓴 문서는 `.markdown-alert-*` 출력이 **추가 마크업 없이** 같은 모양이 된다(prose.css). 왼쪽 바 3px, 패딩 16, 본문 16/1.7. 제목 단어 + 아이콘이 색 없이도 종류를 말한다. 한 화면에 셋을 넘기면 문서 구조를 의심한다.

## 11. Tooltip

```html
<button … aria-label="Copy link" data-aip-tooltip="Copy link" data-aip-tooltip-kbd="⌘C">…</button>
```
aip.js 가 `role="tooltip"` 요소를 만들고 `aria-describedby` 로 잇는다. hover 400ms 후, 키보드 포커스는 즉시, Esc 로 닫힌다. 마우스로 툴팁 위에 올라가도 닫히지 않는다(WCAG 1.4.13). 면 `surface.inverse`, 12px, 최대 280. 꼭 알아야 하는 정보를 툴팁에만 두지 않는다.

## 12. Dropdown (Menu)

```html
<div class="aip-dropdown">
  <button class="aip-button" type="button" aria-haspopup="menu" aria-controls="m1">Actions</button>
  <div class="aip-menu" id="m1" role="menu" aria-label="Actions">
    <button class="aip-menu__item" role="menuitem">Duplicate <span class="aip-menu__meta">⌘D</span></button>
    <hr class="aip-menu__separator">
    <button class="aip-menu__item aip-menu__item--danger" role="menuitem">Delete</button>
  </div>
</div>
```
행동 목록이다. 값을 고르는 것이면 네이티브 Select 가 먼저다(버전 선택처럼 값을 메뉴로 고르면 `menuitemradio` + `aria-checked`, 트리거 안 `[data-aip-menu-value]` 가 갱신된다). aip.js: ↓/↑ 로 열고 이동, Home·End, 글자 입력 점프, Esc 는 닫고 트리거로 포커스 복귀, Tab 은 닫기, 바깥 클릭 닫기. 항목 높이 32, 상자 radius 6 + `shadow.md`, `--end` 는 오른쪽 정렬.

## 13. Dialog · Drawer

```html
<button class="aip-button aip-button--danger" type="button" data-aip-dialog-open="del">Delete…</button>
<dialog class="aip-dialog aip-dialog--sm" id="del" aria-labelledby="del-t">
  <div class="aip-dialog__header"><h2 class="aip-dialog__title" id="del-t">Delete “aip-starter”?</h2>
    <button class="aip-icon-button aip-icon-button--sm" type="button" data-aip-dialog-close aria-label="Close">…</button></div>
  <div class="aip-dialog__body"><p>This cannot be undone.</p></div>
  <div class="aip-dialog__footer"><button class="aip-button" data-aip-dialog-close>Cancel</button><button class="aip-button aip-button--danger">Delete</button></div>
</dialog>
```
네이티브 `<dialog>` + `showModal()` 이라 포커스 가두기·Esc·배경 inert 는 브라우저가 한다. 닫히면 연 버튼으로 포커스가 돌아간다. 폭 `--sm` 420 · 기본 560 · `--lg` 720. 스크림 클릭은 닫는다. 입력 중인 내용을 잃을 수 있으면 `data-aip-modal` 로 막는다. 버튼 문구는 동작 이름("Delete project"), 질문형 제목, 주 버튼은 오른쪽.
Drawer(`dialog.aip-drawer`)는 같은 동작에 왼쪽에서 들어온다. 모바일 내비·문서 사이드바에 쓴다.

## 14. Header · Nav

```html
<header class="aip-header">
  <div class="aip-header__inner aip-container">
    <a class="aip-header__brand" href="/"><img src="logo-mark.svg" alt=""><span>AIP</span><span class="aip-header__product">Docs</span></a>
    <nav class="aip-nav" aria-label="Main"><a class="aip-nav__link" href="/docs" aria-current="page">Docs</a>…</nav>
    <div class="aip-header__actions">…검색·테마·GitHub… <button class="aip-icon-button aip-icon-button--sm aip-header__menu" data-aip-dialog-open="nav">…</button></div>
  </div>
</header>
```
네 제품이 같은 헤더를 쓴다. 높이 56/64, sticky, 불투명 canvas + 하단선. 제품 이름은 `AIP / Docs` 처럼 슬래시 뒤. 현재 위치는 `aria-current` + 헤더 바닥선에 붙는 2px 파랑. lg 미만은 내비를 숨기고 메뉴 버튼 → 드로어(`.aip-nav--vertical`). 테마 버튼은 `data-aip-theme-toggle` + 아이콘 두 개(`.aip-theme-toggle__to-dark` · `__to-light`).

## 15. Breadcrumb

```html
<nav class="aip-breadcrumb" aria-label="Breadcrumb"><ol>
  <li><a href="/docs">Docs</a></li><li><a href="/docs/concepts">Concepts</a></li><li><span aria-current="page">Intents</span></li>
</ol></nav>
```
구분자는 모노 `/` 라 경로처럼 읽힌다. 마지막 항목은 링크가 아니다. 모바일은 마지막 둘만.

## 16. Pagination

```html
<nav class="aip-pagination" aria-label="Pagination"><ul>
  <li><a class="aip-pagination__item" href="?p=1" aria-label="Previous page">‹</a></li>
  <li><a class="aip-pagination__item" href="?p=2" aria-current="page">2</a></li>
  <li><span class="aip-pagination__gap">…</span></li>
</ul></nav>
```
검색 결과·Changelog 목록. 문서 페이지 사이 이동은 Pager(07 §8).

## 17. Table

```html
<div class="aip-table-wrap" role="region" aria-label="Status codes" tabindex="0">
  <table class="aip-table">…<td class="aip-table__num">42.00</td>…</table>
</div>
```
문서 본문의 맨 `<table>` 은 prose 가 같은 모양으로 받는다. 표가 넓을 수 있으면 래퍼로 감싸 표만 가로 스크롤한다(래퍼에 `tabindex="0"` 이라 키보드로도 스크롤된다). 세로선 없음, 헤더 아래만 진한 선, 숫자 오른쪽.

## 18. Empty · Status · Spinner · Skeleton

- Empty(`.aip-empty`): 아이콘 32 + 무엇이 없는지 + 다음 행동 하나(primary). 점선 테두리.
- Status(`.aip-status --success --danger --warning`, `role="status"`): 버튼 옆·폼 아래 한 줄 결과. 아이콘 + 단어 + 색.
- Spinner(`.aip-spinner`, `--sm`): 1초 안쪽 대기. 300ms 뒤에만 보인다(호출부 책임).
- Skeleton(`.aip-skeleton --text`): 실제와 같은 개수·모양. 정지.

## 19. Kbd

`<kbd>⌘</kbd><kbd>K</kbd>`. typography.css 가 전역으로 처리한다. 높이 20, 모노 12, 아래 1px 그림자 선. 플랫폼 기호(⌘·Ctrl)는 런타임이 바꾼다.

## 20. 유틸리티 (utilities.css · base.css · layout.css)

유틸은 이것뿐이다. 더 만들지 않는다.

| 클래스 | 무엇 |
|---|---|
| `.aip-text-primary` `.aip-text-secondary` `.aip-text-tertiary` `.aip-text-brand` | 글자색. typography 클래스와 짝 |
| `.aip-hide-below-md` `.aip-hide-below-lg` | 폭에 따라 숨기기(마지막 파일이라 컴포넌트를 이긴다) |
| `.aip-gap-1` `.aip-gap-2` `.aip-gap-3` `.aip-gap-4` `.aip-gap-6` `.aip-gap-8` `.aip-gap-12` | stack·cluster·grid 간격 |
| `.aip-sr-only` · `.aip-skip-link` | 화면에서 숨김 · 본문 바로가기 |
| `.aip-hit` | 터치 기기에서 히트 영역 8px 확장 |
| `.aip-divider` `--subtle` | 구분선(위아래 24 / 16) |
| `.aip-icon` `--xs` `--sm` `--lg` `--xl` | 아이콘 크기 |

## 21. 여기 없는 컴포넌트를 만들 때

1. 높이는 `size.control.*` 중 하나. 헤더·툴바·사이드바 32, 폼 40, 주 CTA 48.
2. 가로 패딩은 sm `space.3`, md `space.4`.
3. radius: 컨트롤 `md`, 상자·코드·카드 `lg`, 오버레이 `xl`.
4. 색: 면 `surface.*` → 글자 `text.*` → 선 `border.*` → 상호작용 `interactive.*`. 원시 램프를 열지 않는다.
5. 글자: UI 는 `label-*`·`body-*`, 문서 안이면 `doc-*`, 기계값이면 모노.
6. 상태 6종을 전부 그리고, 상태는 ARIA 속성으로 표현한다.
7. 키보드만으로 쓸 수 있고, 포커스가 보이고, 터치 44px.
8. `components/<묶음>.css` 에 넣으면 빌드가 lint 한다. 토큰이 필요하면 `component.json` 에 등록하고 이 문서에 절을 추가한다(14).
