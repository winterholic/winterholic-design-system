# 06 · 컴포넌트 (core)

규격만이 아니라 **구현**이 있다: `dist/components.css`(CSS) + `dist/tk.js`(키보드·다이얼로그·메뉴·컴포저 같은 동작). 소스는 `components/*.css`, 빌드가 lint 한 뒤 묶는다. 각 절은 **마크업 계약 → 변형 → 상태 → 접근성** 순서다. 채팅은 [07](07-chat.md), 실행·승인은 [08](08-run-approval.md), 결과물·뷰어는 [09](09-artifact-viewer.md).

설계 원칙: **기본값이 정답이다.** 클래스 하나면 가장 흔한 경우가 나온다. 상태 표시는 ARIA 속성이 정본이다(`aria-current` `aria-selected` `aria-pressed` `aria-expanded` `aria-invalid` `aria-busy` `aria-disabled`). CSS 가 그 속성을 읽는다. 클래스로 상태를 따로 두지 않는다. 예외는 의미가 ARIA 에 없는 도메인 상태 셋이다: `data-state`(작업 6상태)·`data-policy`(정책 4종)·`data-type`(파일 계열).

React 로 옮길 때도 이 마크업(클래스 + ARIA + data 속성)을 그대로 낸다. 동작 계약은 [19](19-react-integration.md).

---

## 1. Button

```html
<button class="tk-button" type="button">거부</button>                                  <!-- 기본: secondary · md -->
<button class="tk-button tk-button--primary tk-button--lg" type="button">승인하고 보내기</button>
<button class="tk-button tk-button--sm tk-button--ghost" type="button"><svg class="tk-icon" aria-hidden="true">…</svg>로그</button>
```

| variant | 언제 | size | 높이 | 좌우 | 아이콘 |
|---|---|---|---|---|---|
| (없음) = secondary | 기본. 대안·일반 행동 | `--xs` | 24 | 8 | 16 |
| `--primary` | 화면의 주 목적 1개 | `--sm` | 32 | 12 | 16 |
| `--ghost` | 도구(카드 안·툴바) | (없음) = md | 40 | 16 | 20 |
| `--danger` | 되돌릴 수 없는 파괴(확인 다이얼로그 안) | `--lg` | 48 | 20 | 20, radius 12 |

`--block` 전폭, `.tk-button-group`(간격 12), `--end` 오른쪽, `--fill` 같은 폭으로 나눠 갖기(모바일 시트·카드 푸터).

| 상태 | 처리 |
|---|---|
| hover / active | `bg-hover` / `bg-active`. hover 는 `(hover: hover)` 기기에서만(터치 기기의 붙는 hover 방지) |
| focus-visible | 전역 링 2px offset 2px |
| disabled | `disabled`. 이유를 보여줘야 하면 `aria-disabled="true"` + 툴팁(포커스가 남는다) |
| loading | `aria-busy="true"` + `disabled`. 폭 유지, 라벨 자리에 스피너 |
| pressed(토글) | `aria-pressed="true"` → 선택 면(줄 바꿈·로그 따라가기) |

모바일의 주 행동(승인·보내기·로그인)은 `--lg`(48)다. 툴바·카드 안 보조 행동은 `--sm`.

## 2. Icon Button

```html
<button class="tk-icon-button" type="button" aria-label="파일 첨부" data-tk-tooltip="파일 첨부"><svg class="tk-icon" aria-hidden="true">…</svg></button>
<button class="tk-icon-button tk-icon-button--primary tk-icon-button--round tk-composer__send" type="submit" aria-label="보내기">…</button>
```
정사각형. 기본 ghost·md(40). `--secondary`(테두리) `--primary`(채움, 컴포저 보내기만) `--round`(원) `--xs` `--sm` `--lg`. **`aria-label` 필수**(테스트가 검사). 터치 기기에서 xs·sm 은 보이지 않는 히트 영역이 8px 씩 커진다.

## 3. Link

```html
<a class="tk-link" href="…">회의록 요약</a>                         <!-- 문장 안: 밑줄 -->
<a class="tk-link tk-link--standalone" href="…">전체 로그 보기</a>     <!-- 단독: → -->
```
prose 안의 맨 `<a>` 는 클래스 없이 같은 모양. 색만으로 링크를 구분하지 않는다.

## 4. Field · Input · Textarea · Select · Search

```html
<div class="tk-field">
  <label class="tk-label" for="to">받는 사람 <span class="tk-label__optional">선택</span></label>
  <input class="tk-input" id="to" type="email" aria-describedby="to-help">
  <p class="tk-help" id="to-help">처음 보내는 주소는 매번 승인이 필요해요.</p>
</div>
<span class="tk-select"><select id="ttl">…</select></span>
<span class="tk-input-wrap"><svg class="tk-icon">search</svg><input class="tk-input" type="search">
  <span class="tk-input-wrap__end"><button class="tk-icon-button tk-icon-button--xs" aria-label="검색어 지우기">…</button></span></span>
<textarea class="tk-textarea" id="memo"></textarea>
```

| size | 높이 | 언제 |
|---|---|---|
| `--sm` | 32 | 뷰어 찾기·툴바 필터 |
| (없음) md | 40 | 폼 기본 |
| `--lg` | 48 | 로그인 |

글자는 언제나 16(iOS 확대 방지). `--mono` 는 기계값(경로·ID).

| 상태 | 처리 |
|---|---|
| focus-visible | 테두리 + 안쪽 1px = 2px 파랑 |
| invalid | `aria-invalid="true"` + `.tk-error`(아이콘 + 문구)가 도움말을 **대체** |
| disabled | `surface.disabled` + `text.disabled` |
| readonly | `surface.subtle` + 점선 |

라벨은 항상 보인다. 플레이스홀더는 예시만. 채팅 입력은 Input 이 아니라 Composer 다(07 §7).

## 5. Checkbox · Radio · Switch · Fieldset

```html
<fieldset class="tk-fieldset"><legend>자동 승인</legend>
  <div class="tk-choices">
    <label class="tk-checkbox"><input type="checkbox" checked> 개인 작업 영역 안 파일 이동</label>
    <label class="tk-checkbox"><input type="checkbox"> <span>외부 메일<span class="tk-choice__desc">켜도 처음 보내는 주소는 묻는다</span></span></label>
  </div>
</fieldset>
<label class="tk-radio"><input type="radio" name="ttl" checked> 10분</label>
<label class="tk-switch tk-switch--row"><input type="checkbox" role="switch"> 작업 끝나면 알림</label>
<label class="tk-checkbox tk-checkbox--bare"><input type="checkbox" aria-label="계약서.pdf 선택"></label>  <!-- 목록 행 앞 -->
```
시각 20px(손가락 기준), 클릭 영역은 라벨 전체. Switch 는 즉시 반영(알림·테마), Checkbox 는 제출해야 반영. `--row` 는 설정 행(라벨 왼쪽, 스위치 오른쪽). `.tk-choices--inline` 가로.

## 6. Segmented

```html
<div class="tk-segmented" role="radiogroup" aria-label="보기">
  <label><input type="radio" name="view" checked><svg class="tk-icon">list</svg>목록</label>
  <label><input type="radio" name="view">격자</label>
</div>
```
2~4개 짧은 옵션. 높이 32, `--lg` 40(모바일 화면 위), `--block` 전폭. 라디오라 화살표 키가 공짜다. 5개 이상이면 Select.

## 7. Tabs

```html
<div class="tk-tablist" role="tablist" aria-label="상세">
  <button class="tk-tab" role="tab" id="t1" aria-controls="p1" aria-selected="true">정보</button>
  <button class="tk-tab" role="tab" id="t2" aria-controls="p2" aria-selected="false">기록</button>
</div>
<div class="tk-tabpanel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
```
밑줄 탭 하나(높이 44 터치, 간격 20). `.tk-tablist--fill` 칸을 나눠 갖기(모바일 상세). tk.js: roving tabindex·←→·Home·End. 영역 이동은 Tabs 가 아니라 Tabbar·Nav. 탭 안 탭 금지.

결과물 목록 → 뷰어 전환(작업 공간)도 같은 패턴이다: 목록이 `role="tablist" aria-orientation="vertical"`, 행이 `role="tab"`, 뷰어가 `role="tabpanel"`(09 §2).

## 8. Badge

```html
<span class="tk-badge" data-state="running"><span class="tk-dot tk-dot--live" aria-hidden="true"></span>실행 중</span>
<span class="tk-badge tk-badge--warning">주의</span>
<span class="tk-badge tk-badge--mono">PDF</span>
<span class="tk-badge tk-badge--count" aria-label="새 결과물 2개">2</span>
```
높이 20, radius 4. 상태 `--info --success --warning --danger`, 작업 6상태 `data-state`(08 §1), `--mono` 확장자·버전, `--count` 숫자(기본 파랑, `--neutral` 회색). 배지는 **단어**다. 한 줄에 셋까지.

## 9. Chip

```html
<div class="tk-chips" role="group" aria-label="형식 필터">
  <button class="tk-chip" type="button" aria-pressed="true">전체</button>
  <label class="tk-chip"><input type="checkbox">고정만</label>
</div>
<button class="tk-chip" type="button" data-tk-suggest="다음 회의 안건 만들어줘">다음 회의 안건 만들기</button>
<span class="tk-chip tk-chip--context"><span class="tk-glyph" data-type="pdf">…</span><span>결정사항.pdf</span><button class="tk-icon-button tk-icon-button--xs tk-icon-button--round" aria-label="문맥에서 빼기">…</button></span>
```
높이 32, 둥근 필. 세 용도:
- **필터 칩**: `aria-pressed` 또는 체크박스. 선택이면 선택 면 + 파랑 테두리.
- **제안 칩**: `data-tk-suggest`. 누르면 컴포저에 채우고 포커스, **바로 보내지 않는다**(07 §6).
- **문맥 칩**(`--context`): 다음 지시에 붙을 결과물. 파란 기운 면 + 지우기 버튼.

`.tk-chips` 줄은 넘치면 가로 스크롤(모바일 화면 위쪽이 길어지지 않게), `--wrap` 줄바꿈.

## 10. Card

```html
<div class="tk-card"><p class="tk-card__title">Mac Studio</p><p class="tk-card__body">…</p><p class="tk-card__footer">…</p></div>
<a class="tk-card" href="…">…</a>   <!-- 클릭 가능한 카드 = 링크 하나 -->
```
테두리, radius 12, 패딩 16(`--lg` md 이상 20). 그림자는 링크 카드 hover 에만. 카드 안에 카드 금지. 실행·승인·결과물은 카드가 아니라 전용 컴포넌트다.

## 11. Callout

```html
<aside class="tk-callout tk-callout--warning" role="note">
  <svg class="tk-icon tk-callout__icon" aria-hidden="true">…</svg>
  <div class="tk-callout__body"><strong class="tk-callout__title">Warning</strong><p>보낸 메일은 되돌릴 수 없어요.</p></div>
</aside>
```

| 종류 | 색 | 아이콘(Lucide) | Markdown |
|---|---|---|---|
| `--note` | `status.info` | `info` | `> [!NOTE]` |
| `--tip` | `status.success`(민트) | `lightbulb` | `> [!TIP]` |
| `--important` | `agent.*`(민트 면) | `bell` | `> [!IMPORTANT]` |
| `--warning` | `status.warning`(amber) | `triangle-alert` | `> [!WARNING]` |
| `--caution` | `status.danger` | `octagon-alert` | `> [!CAUTION]` |

이름이 GitHub alert 와 같아서 에이전트가 Markdown 으로 쓴 `.markdown-alert-*` 출력이 추가 마크업 없이 같은 모양이 된다(prose.css). 한 화면에 셋을 넘기지 않는다.

## 12. Tooltip

`data-tk-tooltip="문구"` (+ `data-tk-tooltip-kbd="⌘F"`). tk.js 가 `role="tooltip"` 을 만들고 잇는다. hover 400ms 후, 키보드 포커스는 즉시, Esc 로 닫힘. **터치에서는 띄우지 않는다.** 그래서 툴팁에만 있는 정보가 있으면 안 된다(모바일 사용자가 영영 못 본다). 아이콘 버튼의 aria-label 과 같은 문구면 설명으로 다시 잇지 않는다.

## 13. Menu (Dropdown)

```html
<div class="tk-dropdown">
  <button class="tk-icon-button" aria-label="세션 메뉴" aria-haspopup="menu" aria-controls="m1">…</button>
  <div class="tk-menu tk-menu--end" id="m1" role="menu" aria-label="세션 메뉴">
    <button class="tk-menu__item" role="menuitem"><svg class="tk-icon">pin</svg>세션 고정</button>
    <hr class="tk-menu__separator">
    <button class="tk-menu__item tk-menu__item--danger" role="menuitem">세션 삭제…</button>
  </div>
</div>
```
행동 목록(데스크톱). 항목 높이 40, 상자 radius 12 + `shadow.md`, `--end` 오른쪽, `--up` 위로(화면 아래쪽 트리거). 값 고르기는 `menuitemradio` + `aria-checked` + 트리거 안 `[data-tk-menu-value]`. tk.js: ↓/↑ 열기, Home·End, 글자 점프, Esc 닫고 트리거로 복귀, Tab 닫기, 바깥 클릭 닫기. **모바일에서 행동이 넷 이상이면 Menu 대신 Sheet**(§15).

## 14. Dialog

```html
<button class="tk-button tk-button--danger" data-tk-dialog-open="del">세션 삭제…</button>
<dialog class="tk-dialog tk-dialog--sm" id="del" aria-labelledby="del-t">
  <div class="tk-dialog__header"><h2 class="tk-dialog__title" id="del-t">세션을 삭제할까요?</h2><button class="tk-icon-button tk-icon-button--sm" data-tk-dialog-close aria-label="닫기">…</button></div>
  <div class="tk-dialog__body"><p>결과물 3개도 보관함에서 지워져요.</p></div>
  <div class="tk-dialog__footer"><button class="tk-button" data-tk-dialog-close>취소</button><button class="tk-button tk-button--danger">세션 삭제</button></div>
</dialog>
```
네이티브 `<dialog>` + `showModal()`: 포커스 가두기·Esc·배경 inert 는 브라우저가 한다. 닫히면 연 버튼으로 포커스. 폭 `--sm` 400 · 기본 560 · `--lg` 720. 스크림 클릭은 닫는다. 결정·입력을 잃을 수 있으면 `data-tk-modal`(스크림 클릭 무시), Esc 까지 막으려면 `data-tk-modal="strict"`(재인증 진행 중처럼 정말 필요한 때만). 버튼 문구는 동작 이름, 제목은 질문형, 주 버튼 오른쪽. 모바일에서는 푸터 버튼이 폭을 나눠 갖는다.

## 15. Sheet (바텀 시트)

```html
<dialog class="tk-sheet" id="actions" aria-labelledby="a-t">
  <div class="tk-dialog__header"><h2 class="tk-dialog__title" id="a-t">결정사항.pdf</h2><button class="tk-icon-button" data-tk-dialog-close aria-label="닫기">…</button></div>
  <ul class="tk-sheet__actions" role="list"><li><button class="tk-menu__item" data-tk-dialog-close>…원본 다운로드</button></li>…</ul>
</dialog>
```
모바일에서 엄지가 닿는 아래에서 올라온다(위 손잡이, 위 모서리 16, safe-area). **lg 이상에서는 같은 마크업이 가운데 다이얼로그가 된다.** 머리·본문·푸터는 Dialog 와 같은 클래스(`tk-dialog__*`). 행동 목록은 `.tk-sheet__actions`(항목 48). 결과물 더보기·내보내기·필터·상세가 시트다.

## 16. Drawer

`<dialog class="tk-drawer">` + `.tk-drawer__header` · `__body`. 왼쪽에서 들어온다. 모바일 세션 목록(사이드바와 같은 `.tk-sidebar` 마크업을 안에 넣는다).

## 17. Toast

```js
TK.toast({ message: '회의록 요약이 끝났어요 · 결과물 2', tone: 'success', action: { label: '열기', onClick } });
```
`.tk-toast-region`(없으면 tk.js 가 만든다, `role="status"`) 안 `.tk-toast` + `__text` + `__action`. 두 테마 모두 잉크 면(민트 아이콘이 산다). 모바일은 탭바 위 가운데, 데스크톱은 오른쪽 아래. 행동은 하나까지, **행동이 있으면 자동으로 닫지 않는다.** 지금 보고 있는 화면의 결과는 토스트가 아니라 그 자리 Status(§22)다. 토스트는 다른 화면에 있을 때 끝난 일을 알린다.

## 18. Header

```html
<header class="tk-header"><div class="tk-header__inner">
  <button class="tk-icon-button tk-header__menu" aria-label="세션 목록 열기" data-tk-dialog-open="nav-drawer">…</button>
  <div class="tk-header__title"><h1>회의록 정리하고 결정 사항 보내기</h1><p class="tk-header__meta"><span class="tk-dot tk-dot--online"></span>Mac Studio 연결됨</p></div>
  <div class="tk-header__actions">…</div>
</div></header>
```
높이 56, sticky, 불투명 canvas + 하단선, 노치 아래로 내려간다. 제목 한 줄 + 메타 한 줄(연결·상태), 넘치면 말줄임. `.tk-header__menu` 는 lg 이상에서 숨는다. 브랜드 자리는 `.tk-header__brand`(로고 타일 24 + 글자, 다크에서 타일 외곽선). 테마 버튼은 `data-tk-theme-toggle` + 아이콘 둘(`.tk-theme-toggle__to-dark` · `__to-light`).

## 19. Tabbar

```html
<nav class="tk-tabbar" aria-label="영역">
  <a class="tk-tabbar__item" href="/chat" aria-current="page"><svg class="tk-icon">…</svg>채팅</a>
  <a class="tk-tabbar__item" href="/workspace"><svg class="tk-icon">…</svg>작업 공간<span class="tk-badge tk-badge--count" aria-label="새 결과물 2개">2</span></a>
  …
</nav>
```
모바일 하단 4칸(채팅·작업 공간·보관함·파일). 아이콘 24 + 라벨 12 가 **항상 같이** 간다. 현재 위치는 `aria-current` + 위쪽 2px 파랑 + 글자 파랑. lg 이상에서 사라진다. 칸은 넷을 넘기지 않는다(설정은 헤더 메뉴).

## 20. Sidebar · Nav · Session

```html
<aside class="tk-app__sidebar"><div class="tk-app__brand">…</div>
  <nav class="tk-sidebar" aria-label="영역과 세션">
    <div class="tk-nav"><a class="tk-nav__link" href="/chat" aria-current="page"><svg class="tk-icon">…</svg>채팅</a>…</div>
    <div class="tk-sidebar__group"><p class="tk-sidebar__label">오늘</p>
      <a class="tk-session" href="…" aria-current="page"><span class="tk-session__title">…</span><span class="tk-session__time">14:32</span>
        <span class="tk-session__meta"><span class="tk-dot tk-dot--live"></span>실행 중 · 승인 1건 대기</span></a>
    </div>
  </nav>
</aside>
```
데스크톱 왼쪽 열(280, subtle 면). 위: 영역 내비(탭바와 같은 넷), 아래: 세션 목록(날짜 그룹). 세션 행은 제목 + 시각 + 상태 한 줄. 실행 중·승인 대기 세션은 live 점과 단어로 드러난다. 사람을 기다리는 세션이 가장 먼저 눈에 띄어야 한다.

## 21. Path

```html
<nav class="tk-path" aria-label="경로"><ol><li><a href="…">Mac Studio</a></li>…<li><span aria-current="location">회의록</span></li></ol></nav>
```
모노 + `/`. 모바일은 첫 단계 + 마지막 둘만(`/ …`). 경로는 정보라서 말줄임 대신 줄바꿈.

## 22. List · Table · Meta · Empty · Status · Spinner · Skeleton · Progress

- **List**(`.tk-list` > `.tk-list__item`): 행 최소 56, 앞(글리프·체크) · `__body`(`__title` + `__meta` + `__snippet`) · `__end`(상태·행동). `__meta` 항목 사이 `·` 는 CSS 가 넣는다. `__group` 날짜 머리(sticky). `--inset` 테두리 상자. 버튼·링크 행은 hover·pressed·`aria-current`·`aria-selected` 를 받는다. 고를 수 없는 행은 `aria-disabled="true"`(이유는 뒤 배지).
- **Table**(`.tk-table` + `.tk-table-wrap`): 앱 안 표. 숫자 `.tk-table__num`. 넓을 수 있으면 래퍼(`role="region" tabindex="0"`). 스프레드시트 결과물은 Table 이 아니라 뷰어 Cells(09).
- **Meta**(`dl.tk-meta`): 이름 112 | 값. 기계값은 `dd.tk-mono`. 결과물 상세·승인 카드.
- **Empty**(`.tk-empty`, `--boxed` 점선): 무엇이 없는지 + 다음 행동 하나(또는 제안 칩). 빨강·경고색 금지.
- **Status**(`.tk-status --success --danger --warning --agent`, `role="status"`): 버튼 옆·화면 안 한 줄 결과.
- **Spinner**(`.tk-spinner --sm --xs`): 1초 안쪽. 짧은 대기에는 띄우지 않는다(10 §1).
- **Skeleton**(`.tk-skeleton --text --block --glyph`): 실제와 같은 개수·모양. 정지.
- **Progress**(`.tk-progress`, `--tk-progress: 0~1` 또는 `data-indeterminate`, `role="progressbar"`): 업로드·다운로드·변환은 파랑, 에이전트 실행은 `--agent`(민트).

## 23. Avatar · Dot · Presence · Banner · Kbd

- **Avatar**(`.tk-avatar --sm --lg`, `--agent`): 에이전트는 로고 심볼 '따'를 CSS 로 그린 잉크 타일(비어 있으면 자동). 사용자는 이니셜. 위에 `.tk-dot` 을 얹으면 실행 중·연결 표시.
- **Dot**(`.tk-dot --online --connecting --offline --live`): 상태 점 8. **단독으로 쓰지 않는다**(옆에 단어). `--live` 는 맥박.
- **Presence**(`.tk-presence`, `--plain`): Mac Studio 연결 알약 = 점 + 단어("연결됨·다시 연결 중·오프라인").
- **Banner**(`.tk-banner --warning --danger --neutral`): 헤더 바로 아래 전폭 한 줄. 앱 전체 상태 하나만(오프라인·다시 연결 중·업데이트·재인증). 화면당 하나.
- **Kbd**: `<kbd>⌘</kbd><kbd>K</kbd>`. typography.css 가 전역 처리. 터치 기기·좁은 화면에서는 단축키 안내를 숨긴다.

## 24. 유틸리티

| 클래스 | 무엇 |
|---|---|
| `.tk-text-primary` `.tk-text-secondary` `.tk-text-tertiary` `.tk-text-brand` `.tk-text-agent` | 글자색. typography 클래스와 짝 |
| `.tk-mono` | 문장 안 기계값 한 조각 |
| `.tk-truncate` | 한 줄 말줄임(전체는 상세·title 에) |
| `.tk-hide-below-md` `.tk-hide-below-lg` `.tk-hide-from-lg` | 폭에 따라 숨기기 |
| `.tk-gap-1` `.tk-gap-2` `.tk-gap-3` `.tk-gap-4` `.tk-gap-6` `.tk-gap-8` `.tk-gap-12` | stack·cluster·grid 간격 |
| `.tk-sr-only` · `.tk-skip-link` | 화면에서 숨김 · 본문 바로가기 |
| `.tk-hit` | 터치 기기에서 히트 영역 8px 확장 |
| `.tk-divider` `--subtle` | 구분선 |
| `.tk-icon` `--xs` `--sm` `--lg` `--xl` | 아이콘 크기 |
| `.tk-dotgrid` | 점 격자 바탕(로그인·빈 작업 공간만) |
| `[hidden]` | 모든 `tk-*` 요소에서 display 를 이긴다(탭 패널로 쓰는 뷰어가 hidden 을 무시하던 문제를 막는다) |

## 25. 여기 없는 컴포넌트를 만들 때

1. 높이는 `size.control.*` 중 하나. 툴바 32, 폼 40, 모바일 주 행동 48.
2. 가로 패딩은 sm `space.3`, md `space.4`.
3. radius: 컨트롤 `md`, 카드·코드·패널 `lg`, 오버레이·컴포저 `xl`.
4. 색: 면 `surface.*` → 글자 `text.*` → 선 `border.*` → 상호작용 `interactive.*`. 에이전트 신호면 `agent.*`, 기계 출력이면 `ink.*`.
5. 글자: UI 는 `label-*`·`body-*`, 기계값은 모노.
6. 상태를 전부 그리고(기본·hover·active·focus·disabled·loading + 도메인 상태), 상태는 ARIA·data 속성으로.
7. 키보드만으로 쓸 수 있고, 포커스가 보이고, 터치 44px, 툴팁에만 의존하지 않는다.
8. 블록 이름이 기존 블록·글자 역할과 겹치지 않는지 확인한다. 빌드가 막는다(`.tk-grid` 사고).
9. `components/<묶음>.css` 에 넣으면 빌드가 lint 한다. 토큰이 필요하면 `component.json` 에 등록하고 이 문서(또는 07·08·09)에 절을 추가한다(15).
