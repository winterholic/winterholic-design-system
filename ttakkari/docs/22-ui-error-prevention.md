# 22 · UI 실수 방지 (Ttakkari)

앱을 만들며 실제로 났던 화면 실수와, 그것을 시스템이 막는 방법이다. 모든 항목은 사고 → 원인 → 막는 장치 → 고치는 법 순서다. 새 화면을 만들기 전에 §1 의 세 계약과 §5 체크리스트를 본다.

## 1. 세 가지 계약

1. **간격은 부모가 정한다.** 부모가 `gap`(`.tk-stack` · `.tk-cluster` · `.tk-grid` · `.tk-gap-*`)으로 정하고, 자식은 `margin` 으로 간격을 만들지 않는다. gap 과 margin 의 중복뿐 아니라, 중간 래퍼에 간격 규칙이 없어 내용이 붙는 경우도 확인한다(B11).
2. **폭은 안쪽에서 정하지 않는다.** flex·grid 자식은 `min-width: 0`, 긴 글자는 말줄임(한 줄) 또는 `overflow-wrap: anywhere`(여러 줄), 넘치는 상자는 그 상자만 가로 스크롤. 페이지가 가로로 밀리면 버그다.
3. **크기는 토큰이다.** 터치 44, 입력 16, 글자 12 이상, 모달은 화면(`dvh`) 안에서 safe-area 를 뺀 크기. 숫자를 직접 쓰지 않는다.

## 2. 실수 유형 분류

### A. 가로 넘침·화면 밖

| 코드 | 사고(출처) | 원인 | 막는 장치 | 고치는 법 |
|---|---|---|---|---|
| A1 | 임시 순서의 추가 계정 칩이 모달 밖으로(front `bd158ca`, 2026-10-13) | 칩이 한 줄 `nowrap` 고정 높이, 긴 이름 | 검사 `escapes-viewport` `silent-clip` · lint nowrap · `.tk-chip` `flex: 0 1 auto` + span 말줄임 | 라벨을 `<span>` 으로 감싼다. 여러 줄이 필요하면 `.tk-chips--wrap` + 칩 `height: auto` |
| A2 | 메모 태그 긴 이름·입력칸이 폭을 넘음(`bd158ca`) | flex 자식 `min-width: auto`, 입력 `flex-basis` 고정 | 같은 검사 | 자식에 `min-width: 0`, 입력은 `flex: 1 1 8rem; min-width: 0` |
| A3 | 구조 트리맵이 모바일에서 깨짐(`bd158ca`) | 칸이 많은 시각화를 좁은 폭에 그대로 | 아키타입 문서 §차트 + 검사 | 767 이하에서 목록으로 바꾼다. 둘 다 넣고 폭으로 고른다 |
| A4 | `.tk-empty` 의 칩 줄이 `max-content` 로 커져 양쪽으로 샘(검사에서 발견, 1.2.0 수정) | `align-items: center` 열의 자식은 stretch 되지 않아 자기 폭이 부모를 넘음 | 검사 `escapes-viewport` | 가운데 정렬 열의 자식에 `max-width: 100%; min-width: 0` (`.tk-empty > *`) |
| A5 | `.tk-dropdown` · Badge · Button 이 긴 라벨에 부모를 밀어냄(검사에서 발견, 1.2.0) | 인라인 요소에 `max-width` 없음 | 검사 `page-overflow-x` | 컴포넌트에 `max-width: 100%`, 라벨 span 말줄임(기본 포함) |
| A6 | 표·코드·로그가 페이지를 밀어냄 | 상자 없이 표를 그대로 | 03 §6 · 검사 | `.tk-datatable__scroll` / `.tk-table-wrap` / `.tk-code__pre` 가 스크롤 |
| A7 | 헤더 메타 줄이 조용히 잘림(검사에서 발견) | `overflow: hidden` 인데 `text-overflow` 가 없음 | 검사 `silent-clip` | 말줄임 + `title`. 정보가 중요하면 줄바꿈 |
| A8 | 알림 헤더 부제가 "확" 에서 말줄임 없이 뚝 잘림(실기기 iOS, 2026-10-17) | `.tk-header__meta` 는 `display: flex` 라 맨 글자(익명 flex 항목)에는 `text-overflow` 가 먹지 않는다 | 검사 `ellipsis-on-flex-text` | 글자는 `<span class="tk-header__meta-text">` 에 담는다(`PageHeader` 가 문자열이면 자동). flex 상자에 말줄임을 걸 때는 항상 글자를 span 에 |
| A9 | 맥락 도서관 탭 6개가 폭을 넘어 본문 전체가 왼쪽으로 밀리고 가로 스크롤바가 생김(실기기, 2026-10-17) | `.tk-segmented--block` 라벨이 `nowrap` 이라 상자 밖으로 나가고, 그 폭이 `.tk-screen__body`(스크롤 상자)를 넓힘. **문서 `scrollWidth` 는 그대로라** 기존 검사에 안 잡혔다 | 검사 `scroller-overflow-x` · `.tk-screen__body { overflow-x: hidden }` 안전망 | 선택지가 4개를 넘거나 한글 라벨이 길면 `.tk-segmented--scroll`(상자 안 스크롤, 잘린 쪽은 `data-fade` 로 흐림). 안전망은 증상만 가리므로 원인 컴포넌트를 고친다 |
| A10 | 320 폭 PMS 작업 모달에서 상태 세그먼트 마지막 칸이 잘림(전수 검수, 2026-10-17) | `.tk-segmented > label` 이 content-box 라 `min-width: 44`(터치) + padding 24 = 68 이 4개(272)로 계산돼 안쪽 폭 254 를 넘음 | 렌더 수치(320 모달) | 라벨에 `box-sizing: border-box`(DS 1.3.3). 칸이 넷 이상인 세그먼트는 320 에서 수치로 확인한다 |
| A11 | 320 폭 일정 모달에서 시각 입력의 시계 아이콘이 잘리고, 진행률 빠른 선택 칩이 가로로 밀려 `100%` 가 안 보임 | 날짜·시각을 한 줄에 `flex: 1 1 0` 으로 억지로 넣음 / `.tk-chips` 기본은 가로 스크롤인데 힌트가 없음 | 렌더 수치 | 짝 입력은 `flex-wrap` + `flex: 1 1 9rem`(좁으면 두 줄), 칩이 폭을 넘을 만하면 `.tk-chips--wrap` |

글자가 상자에 안 들어갈 때의 선택은 이 순서다. ① 줄바꿈(제목·설명·이름: `overflow-wrap: anywhere`) ② 한 줄 말줄임 + `title`(목록 행·헤더) ③ 가로 스크롤(표·코드). 글자를 줄여 맞추지 않는다.

### B. 간격·패딩

| 코드 | 사고 | 원인 | 장치 | 고치는 법 |
|---|---|---|---|---|
| B1 | PMS 생성 모달의 두 번째 필드만 20 더 떨어짐(front `7d4d1ce`, 2026-10-13) | `.tk-field + .tk-field` 의 sibling margin 이 부모 `gap` 과 겹침 | 검사 `gap-plus-margin` · DS 의 `:not(.tk-stack > *…)` | 필드 묶음을 `.tk-stack`(또는 `.tk-grid`)에 둔다 |
| B2 | 설정 섹션 설명 줄이 위아래로 이중 간격 | `.tk-fieldset__help` 의 음수·양수 margin 이 부모 gap 과 겹침 | 검사 `gap-plus-margin` | 도움말은 부모 gap 만 쓴다. 음수 margin 보정을 만들지 않는다 |
| B3 | 아이콘이 글자 첫 줄과 안 맞음 | 임의 `margin-top: 3px` | lint · 05 정렬 | `margin-top: calc((1lh - 아이콘)/2)` 한 번(컴포넌트가 이미 계산) |
| B4 | 탭바 아래가 휑하거나 드로어 하단이 두 번 비워짐(front `36eafbf`) | safe-area 를 두 요소가 각각 더함 | 규칙: safe-area 는 화면 끝에 닿는 한 요소만 | 탭바는 `padding-bottom: env()`, 그 안의 자식은 더하지 않는다 |
| B5 | 새 요소가 이름이 달라 간격 토큰을 우회 | `13px` `18px` | lint(px 직접값) | 4 배수 토큰(`space.*`) |
| B6 | 상단바가 휑함: 상태바 영역(safe-area 59) 아래에 헤더 56 이 더 얹혀 115 가 됨(실기기, 2026-10-17) | 데스크톱 높이(56)를 폰에도 그대로 씀. safe-area 는 `.tk-header` 한 곳에서만 더하고 있었다(중복 아님) | 규칙: 헤더 안쪽 높이 | 폭 1023 이하는 `--tk-component-header-height - space-2`(48). 제목+메타 두 줄(약 41)과 터치 타깃 44 가 들어간다. 헤더 위에 `padding-top: env(safe-area-inset-top)` 를 다른 요소가 또 더하지 않는다 |
| B7 | 보관함에서 개수·"오늘" 머리·첫 항목 사이가 위아래로 과하게 벌어짐(실기기, 2026-10-17) | `<p class="tk-list__group">` 에 브라우저 기본 위아래 margin(1em = 12)이 남음. 필터 아래 padding 과도 겹쳐 쌓임 | 검사 규칙은 아님(`gap-plus-margin` 은 gap 부모만 봄) — 렌더 수치로 확인 | `<p>`·`<h*>` 를 쓰는 컴포넌트 클래스는 `margin: 0` 을 스스로 적는다. 새 컴포넌트를 만들면 사용 태그의 기본 margin 부터 지운다 |
| B8 | 메모 편집 화면의 도구 줄만 흰 띠로 떠서 오류처럼 보임(실기기, 2026-10-17) | 페이지 바탕(`surface-canvas`) 위의 sticky 줄에 `surface-default`(흰색) 배경을 줌 | 규칙 | sticky·fixed 줄이 본문 위에 얹힐 때 배경은 **놓인 바탕과 같은 면**(페이지는 canvas, 모달은 default)으로 하고, 좌우 gutter 만큼 밖으로 펴 스크롤될 때 글자가 옆으로 비치지 않게 한다 |
| B9 | 모달 안 폼 필드 사이가 36(계정 추가·일정)·32(PMS 작업·이슈)로 벌어지고, 같은 모달 안에서도 32/12 로 들쭉날쭉함(전수 검수, 2026-10-17. "여백이 하마같이") | 폼 컨테이너를 앱 클래스(`display: flex; gap: 12~16`)로 만들고, 안쪽 `.tk-field` 의 DS 규칙 `.tk-field + .tk-field`(margin-top 20)가 gap 에 그대로 더해짐. B1 처방(`.tk-stack`)을 폼마다 적용하지 않았고, 검사는 열려 있는 모달만 보는데 **조건부로 그려지는 모달은 한 번도 열리지 않아** 통과해 왔다 | 앱 `scripts/ui-sweep/modals.mjs` 의 `gap-plus-margin` | 모달 폼은 `.tk-stack`(gap 16)에 두고 자체 flex+gap 클래스를 만들지 않는다. 짝 필드 `grid` 도 둘째 칸 margin 을 0 으로(`.pms-form__pair`). 새 모달은 `modals.mjs` 장면에 한 줄 추가 |
| B10 | 푸시 알림 모달에서 도움말이 스위치에 붙고 버튼 위만 24 가 빔 | `.tk-fieldset__help` 의 `margin: -8 0 12` 보정이 `.tk-choices` 의 gap 에 겹침 | `gap-plus-margin` | `.tk-choices > .tk-fieldset__help { margin: 0 }`(DS 1.3.3). 음수 margin 보정은 B2 와 같은 이유로 만들지 않는다 |
| B11 | 서버 리소스 탭 안에서 카드와 "CPU 코어별" 제목이 2px 로 붙어 쌓임 | 탭 패널(`<section role="tabpanel">`)에 레이아웃 규칙이 없어 바깥 `.res` 의 gap 이 닿지 않음 | 렌더 수치 | 패널도 `display: flex; flex-direction: column; gap` 을 갖는다. 내용을 넣는 상자마다 간격 규칙의 소유자를 정한다 |
| B12 | 체크리스트 삭제 확인에서 두 문단이 30 떨어짐 | `<p>` 기본 margin 14 + 부모 gap 16 | `gap-plus-margin` | `<p>` 를 flex 부모 안에 두면 `margin: 0`(B7 과 같은 유형) |
| B13 | 날씨 빈 상태의 위아래 padding 이 사라지고, 달력 날짜 줄간격이 상속값으로 풀림 | 없는 토큰 `--tk-space-7`·`--tk-font-line-height-tight` 를 씀. 없는 `var(--tk-*)` 는 에러 없이 조용히 무효가 된다 | lint `undefined-token`(앱 ui-lint, 새로 늘면 실패) | 있는 토큰만 쓴다(space 는 4 배수 단계, line-height 는 snug/normal/relaxed) |
| B14 | 캘린더 "음력" 스위치 라벨이 스위치보다 위로 떠 보임 | `.tk-switch > input` 의 위 여백이 본문(md) 글자 기준인데 라벨만 xs 로 줄임 | 눈 확인(렌더 좌표) | 라벨 글자 크기를 바꿀 때는 `align-items: center; input { margin-top: 0 }` 를 함께 준다 |
| B15 | 모바일 WBS 에서 작업 제목만 오른쪽으로 27 들어가 아래 요약·막대 줄과 왼쪽 선이 안 맞음 | 제목 앞의 접기 칸(twisty)만큼 제목 줄만 밀림 | 눈 확인 | 같은 행의 줄들은 한 왼쪽 선을 쓴다(요약·막대에 같은 들임) |
| B16 | 채팅 실행 단계가 "명령 실행ls -la" 처럼 이름과 대상이 붙음 | JSX 에서 이름 뒤에 공백 없이 `<span class="tk-step__target">` 가 이어짐 | 눈 확인 | `.tk-step__target { margin-inline-start: 6 }`(DS 1.3.3). 글자 사이 간격을 JSX 공백에 맡기지 않는다 |
| B17 | 새 회의록에서 같은 줄의 "범위" 세그먼트(34)가 "회의 날짜" 입력(40)보다 6 낮아 아래가 안 맞음 | 세그먼트 기본 높이(32+테두리)와 입력 `control-md`(40)가 다른데 폼 안에서 같은 줄에 놓임. PMS 프로젝트 모달만 앱에서 따로 맞춰 둠 | 렌더 수치 | `.tk-field > .tk-segmented` 가 입력과 같은 40 이 된다(DS 1.3.3). 앱이 폼마다 높이를 덮어쓰지 않는다 |

### C. 모달·시트·안전 영역

| 코드 | 사고 | 원인 | 장치 | 고치는 법 |
|---|---|---|---|---|
| C1 | 모달이 모바일에서 주소창·홈 바에 가림, 좌우 여백 16 이 넓음(front `1b727a2`) | `100dvh − 64px` 만 계산, safe-area 없음 | 검사 `dialog-outside-viewport` `dialog-fills-viewport` `dialog-edge-to-edge` · DS Dialog 가 이미 반영 | 수정 없이 `.tk-dialog` 를 쓴다. 폭 `min(100vw − 여백 − 좌우 inset, 크기)`, 높이 `100dvh − 여백 − 위아래 inset`, 모바일 좌우 12 |
| C2 | 긴 목록 모달에서 헤더·버튼이 같이 스크롤됨 | 본문에 `overflow` 가 없고 푸터가 `flex: none` 이 아님 | `dialog-body-not-scrollable` | 헤더·푸터 `flex: none`, 본문 `overflow-y: auto`(기본 포함) |
| C3 | 모달 안의 한 자식이 모달 폭을 넘음 | A 계열과 같다 | `dialog-child-escapes` `dialog-overflow-x` | A 계열 처방 |
| C4 | 본문 바로가기 링크가 노치 기기에서 화면 위에 걸려 보임(검사에서 발견, 1.2.0) | `top: 8 + env(inset-top)` 인데 `translateY(-200%)` 가 부족 | 검사 `skip-link-visible` | 자기 높이 + top 만큼 위로(`calc(-100% − space-2 − env())`) |
| C5 | 가로 모드 폰에서 앱 좌우가 노치 아래로 들어감 | 좌우 inset 을 아무도 안 더함 | 검사 `safe-area-side`(844×390) | `.tk-app` 이 좌우 inset 을 가진다. 앱 셸 밖 전체 화면 요소는 직접 더한다 |
| C6 | 아래에 붙는 고정 요소가 홈 바에 눌림 | `env(safe-area-inset-bottom)` 없음 | lint(fixed 아래) · `safe-area-bottom` | 아래에 붙는 요소가 한 번만 더한다. 탭바 아래 여백은 inset 의 절반까지 허용(사용자 결정, front `36eafbf`) |
| C7 | 키보드가 올라오면 탭바가 입력을 가림 | 탭바가 `sticky` 로 남음 | 규칙(19 §6) | 키보드 열림 동안 탭바 숨김(`html[data-kbd]`), 입력 캐럿은 `visualViewport` 안으로 |
| C8 | 메모 지우기 확인 모달이 720 폭(내용은 한 줄)(전수 검수, 2026-10-17) | 사용자 정의 속성 `--tk-_w` 는 **상속된다**. 큰(lg) 모달 안에 렌더된 확인 모달이 부모의 720 을 물려받음 | `modals.mjs` `dialog-width` | `.tk-dialog` 가 자기 기본 폭을 직접 선언한다(DS 1.3.3). 중첩 컴포넌트에 쓰는 지역 변수는 자기 선택자에서 초기값을 준다 |
| C9 | 확인 질문("…지울까요?") 모달이 560 폭이라 한 줄 내용에 비해 큼 | 크기를 안 정해 기본(md 560) | `confirm-not-sm` | 제목이 질문이고 입력이 없으면 `size="sm"`(400). 입력 폼은 기본·`lg` |
| C10 | 모달마다 라벨 서체가 다름(일정·PMS 는 본문 글자, 계정은 medium) | `.tk-field` 첫 자식 `<label>`·`<span>` 에 `.tk-label` 이 없음 | `label-style` | 라벨과 의사 라벨(select 의 `<span id>`)에 모두 `.tk-label` |
| C11 | 모달 푸터 버튼 모양이 모달마다 다름(전체 폭 반씩 / 오른쪽 작은 둘 / 글자만 있는 ghost 취소 / size sm) | 푸터 대신 폼 안에 버튼 줄, 푸터에 `.tk-button-group` 래퍼, `variant="ghost"` 취소, `size="sm"` | 눈 확인(전후 캡처) | 확인류는 `Dialog footer` 에 **버튼만**(래퍼 없이), 취소는 윤곽 버튼·기본 크기. 폼 안 행동 줄은 모바일에서 버튼이 `flex: 1 1 0` 으로 폭을 나눠 가진다 |
| C12 | 회의 공유·다운로드 모달의 체크박스가 13px(옆 모달은 20px) | 네이티브 `<input type=checkbox>` + `accent-color` | `native-checkbox` | `<label class="tk-checkbox">`(20) |
| C13 | 온보딩 모달 그림 위가 64 비어 보임 | `.tk-empty` 의 위아래 padding 48 이 모달 본문 padding 16 에 더해짐 | `body-air` | `.tk-dialog__body > .tk-empty { padding: 8 0 }`(DS 1.3.3). 이미 padding 이 있는 상자 안에 padding 이 있는 컴포넌트를 넣지 않는다 |
| C14 | 사용자 메뉴에서 "로그아웃"이 스크롤 뒤에 숨음(데스크톱·모바일 공통) | 항목 10개 + 구분선이 `.tk-menu` 기본 `max-height: 360` 을 넘음 | `modals.mjs` `menu-clipped` | 항목이 8개를 넘는 메뉴는 높이 제한을 화면 높이 기준으로 올린다. 가장 중요한 행동을 스크롤 뒤에 두지 않는다 |

### D. 터치·입력

| 코드 | 사고 | 원인 | 장치 | 고치는 법 |
|---|---|---|---|---|
| D1 | 헤더·컴포저 아이콘 버튼이 40 이라 손가락에 작음(검사에서 발견, 1.2.0) | 보이는 크기 = 누르는 크기 | `touch-target-under-44` | 버튼은 보이는 크기를 그대로 두고 `::after` 로 44 까지(기본 포함). 칩·세그먼트·경로도 같다 |
| D2 | 터치 영역을 요소 자체로 44 로 키워 레이아웃이 커짐(front `001fc55` 에서 되돌림) | 높이를 강제 | 같은 검사 | 높이를 키우지 말고 `::after` 히트 영역 |
| D3 | iOS 에서 입력에 포커스하면 화면이 확대됨 | 입력 글자 < 16 | `input-font-under-16` | 입력·textarea·select 는 `font-size: md`(16) |
| D4 | 글자가 11px 이하 | 임의 값 | `font-under-12` · lint | 최소 12(`font.size.xs`) |
| D5 | 한글 조합 중 Enter 가 전송됨 | `isComposing` 무시 | 정적 테스트 | 19 §3 |
| D6 | 툴팁에만 있는 정보 | 터치에는 hover 가 없다 | 규칙 | 상세·읽기 줄·`title` 보조 |
| D7 | 새 회의록의 "회의 날짜" 입력이 다른 입력보다 넓어 오른쪽 화면 밖으로 튀어나감(실기기 iOS Safari, 2026-10-17. 이전에 Chrome 에서 "재현 안 됨" 으로 닫혔던 건) | iOS Safari 의 `input[type=date\|time\|datetime-local\|month\|week]` 는 기본 `appearance` 에서 자체 폭을 가져 `width: 100%` 를 넘는다. Chrome·데스크톱 WebKit 에서는 재현되지 않는다(**실기기 확인 필요**) | 검사 `date-input-overflow`(재현되는 환경에서만 잡힘) · 규칙 | `.tk-input` 의 날짜류 규칙: `appearance: none; display: block; box-sizing: border-box; min-width: 0; max-width: 100%`, `::-webkit-date-and-time-value` 정렬. 날짜 입력을 flex 행에 둘 때는 부모에 `min-width: 0` |
| D8 | 채팅 첨부(클립)를 누르면 iOS 파일 선택 메뉴가 버튼이 아니라 화면 중간에 뜸(실기기, 2026-10-17) | 숨은 `input[type=file]` 에 `hidden`(display:none)을 주면 iOS 가 메뉴를 붙일 상자를 찾지 못한다 | 검사 `file-input-hidden` | `input[type=file]` 에 `hidden`·`display:none` 금지. 투명(`opacity: 0`)한 input 을 눌리는 버튼 위에 같은 크기로 겹친다(앱의 `FileButton`, `.tk-file-slot`). 눌림은 버튼이 받아 `input.click()` 으로 넘긴다 |
| D9 | 모바일 칸반이 열을 가로로 늘어놓아 옆 열이 잘려 보임(실기기, 2026-10-17) | 데스크톱 4열을 폰에서 가로 스크롤로 | 규칙 | 767 이하는 상태 탭(개수 표시)으로 한 열씩. 끌기 대신 카드 메뉴로 상태 변경. 데스크톱 칸반은 그대로 |

### E. 구조·정보

| 코드 | 사고 | 장치 | 처방 |
|---|---|---|---|
| E1 | 모바일에서 데스크톱 전용 패널이 열려 상세가 안 보임(front `eb1d7b8`) | 아키타입 문서 §상태 | 같은 행동의 모바일 경로(시트·페이지)를 같이 만든다. 폭으로 고르는 분기를 한 곳에 둔다 |
| E2 | 탭바와 헤더에 같은 목적지가 두 번(front `53c52be`) | 21 공통 규칙 | 한 목적지는 한 곳 |
| E3 | 수정 중 회전하면 편집 중인 글이 사라짐(front `bd158ca`) | 21 §에디터 | 열 때의 표시 방식을 고정하거나 상태를 위로 올린다 |
| E4 | 모든 상태를 한 가지(성공)만 그림 | 21 상태 표 | 빈·로딩·오류·오프라인을 같이 그린다(10) |
| E5 | 같은 메뉴의 다른 이름이 사실상 같은 화면·위치를 엶(설정·계정 관리처럼) | 실제 라우트·앵커 도착 위치 확인 | 별도 항목은 사용자가 구분할 목적과 도착 위치가 있을 때 둔다. 중복이면 통합하거나 실제로 구분되는 목적지를 만든다. 문구 차이만으로 별개 기능이라 설명하지 않는다 |

### F. 셸 높이·데스크톱 배치

| 코드 | 증상·관찰 범위 | 확인 | 처방 |
|---|---|---|---|
| F1 | 데스크톱 셸이 창 중간에서 끝나고 아래가 빔(2026-10-17 사용자 보고). front `5c61907` 의 100% 높이 연결 수정은 코드로 확인했으나, 사용자 환경 원인은 미확정 | 창·루트·셸의 높이와 위/아래 좌표, 실제 overflow 소유자, 창 크기 변경 전후를 비교(03 §5) | 측정한 높이 기준·부모 연결 문제를 고친다. `100dvh` 금지나 100% 일괄 치환으로 일반화하지 않는다 |
| F2 | 가로 넘침은 없어도 데스크톱 데이터 화면이 한 줄로 길게 늘어져 정보 관계를 읽기 어려움 | 본문 가용 폭, 제목↔카드 간격, 이름↔수치 거리, 각 탭의 실제 상태를 본다 | 21 §6 서버 리소스 변형. 차트·목록을 관계에 따라 묶고 가용 폭으로 열을 정한다 |

## 3. 자동 검사

| 검사 | 무엇을 | 실행 |
|---|---|---|
| `node tokens/build.mjs` | 하드코딩(hex·px·ms·z-index·`!important`)·없는 토큰·이름 충돌·**레이아웃 lint 5종**: nowrap 짝, 아래 고정+safe-area, `vh`, `100vw`, 자식 margin-top. 예외는 규칙 본문에 `/* lint-ok: 이유 */` | `npm test` 에 포함 |
| `scripts/ttakkari-layout.check.mjs` | 실제 Chrome 에서 페이지를 6폭(320·390·768·1024·1440 + 가로 모드 844×390) × 평소/긴 글자 주입 × 라이트/다크로 열어 아래 규칙을 잰다. **`--browser=webkit`** 이면 WebKit(iOS Safari 와 같은 엔진)에 iPhone 프리셋(SE 320·14 390)으로 연다. WebKit 에는 safe-area 에뮬레이션이 없어 `env(safe-area-inset-*)` 를 px 로 치환해 흉내 낸다. Chrome 에뮬레이션만으로 "통과"한 화면이 실기기에서 깨진 일이 반복돼 앱 `check:layout` 은 두 엔진을 모두 돈다 | `npm run check:layout` · `-- --browser=webkit` |
| `scripts/ttakkari-interaction.check.mjs` | 키보드·포커스·컴포저·분할·뷰어 동작과 6폭 가로 넘침 | `npm run check:ui` |
| front `scripts/ui-sweep/run.sh` | 같은 검사기로 **실제 앱**의 25개 경로를 합성 데이터(긴 이름·긴 제목)로 연다 | `pnpm check:layout` |
| front `scripts/ui-lint.mjs` | 앱 CSS 의 하드코딩·`100vw`·`vh`·고정 폭·자식 margin-top 을 기준선(baseline)과 비교한다. 새로 늘면 실패 | `pnpm lint` 에 포함 |

긴 글자 주입은 글자가 든 말단 요소 끝에 약 90자의 끊김 없는 문자열을 붙인다. 버튼·칩·배지의 **맨 글자**는 정해진 이름(승인·완료)이라 주입하지 않고, 데이터가 들어가는 것은 `<span>` 으로 감싸는 계약이라 그 span 에 주입한다. 실제 앱의 데이터 라벨을 찾을 때는 `--stress-raw` 로 맨 글자에도 넣는다. 정말 예외인 요소는 `data-layout-ok="이유"`(검사 제외), `data-stress-skip`(주입 제외)을 단다. 이유 없이 달지 않는다.

### 검사 규칙

| 규칙 | 뜻 |
|---|---|
| `page-overflow-x` | 문서가 화면보다 넓다. 범인 요소를 함께 알려 준다 |
| `escapes-viewport` | 가로 스크롤 상자 밖에서 요소가 화면 좌우를 넘는다 |
| `silent-clip` | `overflow: hidden` 인데 말줄임이 아니고 내용이 더 크다(조용히 잘림). 검사기는 클래스명 대신 1px 이하 absolute/fixed 상자와 실제 clip 조합으로 시각 숨김을 판별한다. `role=tabpanel` 은 `data-active=false` 인 경우에만 이 숨김을 인정한다. |
| `ellipsis-without-full-text` | 말줄임이 생겼는데 `title`·`aria-label` 로 전체를 볼 방법이 없다 |
| `gap-plus-margin` | 부모가 gap 으로 간격을 주는데 자식에 6 초과 margin 이 있다. 저작된 값을 읽으므로 `auto` 는 걸리지 않는다 |
| `touch-target-under-44` | 터치 기기에서 누르는 영역(`::after` 포함)이 44 미만 |
| `input-font-under-16` | 입력류 글자가 16 미만(iOS 확대) |
| `font-under-12` | 글자가 12 미만 |
| `safe-area-bottom` | 화면 아래에 붙은 고정 요소의 행동이 홈 바(34)의 절반보다 가깝다 |
| `safe-area-top` | 화면 위에 붙은 고정 요소의 행동이 노치(47) 아래로 내려오지 않았다 |
| `safe-area-side` | 가로 모드에서 눌리는 요소가 좌우 노치(47)와 겹친다 |
| `skip-link-visible` | 포커스 없이 본문 바로가기가 화면 안에 보인다 |
| `scroller-overflow-x` | `.tk-screen__body` 의 `scrollWidth` 가 `clientWidth` 보다 크다. 문서 `scrollWidth` 에는 안 잡히는 넘침(본문만 옆으로 밀림)이며 범인 요소를 알려 준다. 긴 글자 주입은 고정 라벨에도 글자를 붙여 오탐이 많아 평소 모드에서만 본다 |
| `date-input-overflow` | 날짜·시각 입력의 오른쪽이 부모 상자(또는 화면)를 넘는다 |
| `file-input-hidden` | `input[type=file]` 이 상자가 없다(`display: none`·`hidden`). iOS 선택 메뉴가 엉뚱한 곳에 뜬다 |
| `ellipsis-on-flex-text` | flex 상자의 맨 글자에 `text-overflow: ellipsis` 를 걸었는데 말줄임이 안 먹고 잘린다. 글자를 span 에 담는다 |
| `dialog-outside-viewport` | 연 모달·시트가 화면 밖으로 나간다(열리는 애니메이션이 끝난 뒤 잰다) |
| `dialog-fills-viewport` | 모달이 화면을 꽉 채워 위아래 여백이 없다(전체 화면 뷰어·시트·드로어 제외) |
| `dialog-edge-to-edge` | 모달이 360 넘는 화면의 좌우 끝까지 닿는다 |
| `dialog-body-not-scrollable` | 모달 본문이 넘치는데 스크롤이 아니다 |
| `dialog-overflow-x` | 모달 자체가 가로로 넘친다 |
| `dialog-child-escapes` | 모달 안의 자식이 모달 폭을 넘는다 |
| (앱) `modals.mjs` | 대표 모달·메뉴를 직접 열어 `gap-plus-margin`(이중 간격) · `dialog-width`(선언 폭 초과) · `confirm-not-sm` · `label-style` · `native-checkbox` · `body-air`(본문 위아래 24 초과 빈 공간) · `menu-clipped` 를 본다. 위 DS 검사는 조건부로 그려지는 모달을 열지 못해 B9 이후의 실수를 놓쳤다 |
| (앱) `ui-lint` `undefined-token` | 앱 코드가 쓰는 `var(--tk-*)` 가 vendor CSS 에 선언돼 있는지 본다. 없는 토큰은 조용히 무효가 된다(B13) |
| `load-error` · `page-error` | 페이지가 안 열리거나 스크립트 오류 |

검사가 못 하는 것: 실제 iOS Safari 의 주소창·키보드·홈 바 동작(Chrome 의 safe-area 에뮬레이션과 다르다), **iOS 만의 네이티브 컨트롤**(날짜 입력의 자체 폭, 파일 선택 메뉴가 뜨는 위치. 데스크톱 맥의 WebKit 은 이 컨트롤을 다르게 그려 재현되지 않는다), 한글 IME, 실제 데이터의 길이 분포, 시각적 위계. 이 항목은 기기 확인이 필요하다(확인 필요). 그래서 위 규칙은 원인(숨은 file input, appearance 기본값)을 코드 수준에서 막는 쪽으로 둔다.

**검사 통과의 범위를 구분한다.** 현재 자동 검사에는 셸과 창의 세로 높이 일치·창 높이 변경 후 복원·데스크톱 정보 밀도를 판정하는 규칙이 없다. 가로 넘침 0 은 이 항목의 통과 근거가 아니다. 예제 검사, 합성 데이터의 앱 검사, 운영 데이터, 실기기 결과를 각각 구분하고 미실행은 미실행으로 남긴다. 기본 라우트만 연 검사는 방문하지 않은 탭·메뉴·상세를 검증하지 않는다.

**실데이터 규모로 본다.** 합성 데이터가 3건짜리면 목록 머리·개수·첫 항목 사이 간격, 100건 넘는 알림의 날짜 묶음, 6개 탭 같은 문제가 안 보인다. 앱 스텁은 알림 148건·보관함 30건 가득·PMS 14작업·도서관 실제 수치로 채워 둔다.

## 4. 레시피

```css
/* flex·grid 자식이 긴 글자에 밀리지 않게 */
.row > .text { min-width: 0; }
/* 한 줄 말줄임(자식 span 에) */
.name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* 여러 줄 이름 */
.title { overflow-wrap: anywhere; }
/* 넘치는 상자만 스크롤 */
.box { max-width: 100%; overflow-x: auto; overscroll-behavior-x: contain; }
/* 터치 44: 높이를 키우지 않고 히트 영역만 */
.small-control { position: relative; }
@media (pointer: coarse) { .small-control::after { content: ""; position: absolute; inset: calc((var(--tk-size-touch-target-min) - var(--tk-size-control-sm)) / -2) 0; } }
```

(위는 앱 CSS 예시라 `var(--tk-…)` 를 쓴다. 대부분은 컴포넌트가 이미 가지고 있으니 새로 쓰기 전에 클래스를 먼저 찾는다.)

## 5. 새 화면 체크리스트

1. 아키타입(21)을 골랐고, 모바일 320·390 배치를 먼저 그렸다.
2. 스크롤은 본문(`.tk-screen__body` 등) 안에서만 일어난다. 페이지·헤더·탭바는 움직이지 않는다.
3. 간격은 `.tk-stack`·`.tk-cluster`·`.tk-grid` 와 `gap` 이다. 자식에 `margin-top` 이 없다.
4. 긴 값(파일명·계정·URL·프로젝트 이름)이 들어갈 자리마다 줄바꿈·말줄임·스크롤 중 하나를 정했다.
5. 모든 터치 컨트롤이 44(히트 영역 포함)이고 입력은 16 이다.
6. 모달은 `.tk-dialog`(짧은 것·목록)나 전체 화면 뷰어(문서)다. 새 크기를 만들지 않았다.
7. 빈·로딩·오류·오프라인 상태를 그렸다. 빈 상태에는 `.tk-art` 자리를 둔다(23).
8. 호버에만 있는 정보가 없다. 색만으로 말하는 상태가 없다.
9. `npm run check:layout`(예제) 또는 `pnpm check:layout`(앱)이 위반 0 이다.
10. 하드코딩이 없다(`node tokens/build.mjs` · `pnpm lint`).
11. 날짜·시각 입력은 `.tk-input`(appearance 규칙 포함)을 쓰고, 파일 고르기는 `input[type=file]` 에 `hidden` 을 주지 않고 버튼 위에 투명하게 겹친다(D7·D8).
12. 선택지가 4개를 넘거나 라벨이 긴 세그먼트는 `.tk-segmented--scroll` 이다. `<p>`·`<h*>` 로 만든 컴포넌트는 `margin: 0` 을 스스로 적었다(B7). sticky 줄의 배경은 놓인 바탕과 같은 면이다(B8).
13. 앱은 Chrome 만이 아니라 `--browser=webkit`(iPhone 프리셋) 로도 통과했고, 실데이터 규모(알림 100+·목록 30+)로 간격을 수치로 봤다. iOS 네이티브 컨트롤은 실기기에서 한 번 확인한다.
14. 폼은 `.tk-stack`(모달 gap 16 · 페이지 20)에 둔다. `display: flex; gap` 을 가진 자체 폼 클래스를 만들지 않는다(B9). 라벨은 모두 `.tk-label`(C10).
15. 확인류 모달은 `size="sm"`, 푸터는 `Dialog footer` 안 버튼만(C9·C11). 체크박스는 `.tk-checkbox`(C12). 새 모달·메뉴는 앱 `scripts/ui-sweep/modals.mjs` 장면에 한 줄 추가한다.
16. 조건부로 그려지는 UI(모달·메뉴·탭 패널·상세 화면)는 기본 페이지 방문만으로 검사되지 않는다. 각 상태를 열어서 320·390·1440 수치를 본다. 같은 상자 안의 padding·margin·gap 중복과 중간 래퍼의 gap 누락을 함께 본다.
17. 데스크톱은 1024·1440 과 문제를 보고한 창 크기에서 본문 배치를 확인한다. 창 높이를 줄였다가 늘린 뒤 셸이 창 아래까지 이어지고 본문만 스크롤되는지 좌표로 확인한다(F1).
18. 데이터 화면은 각 탭을 열어 요약·차트·상세의 관계, 제목↔카드 간격, 과도한 빈 열·늘어진 목록을 확인한다(21 §6·F2). 자동 검사와 별도로 본 화면·크기·상태와 미확인 환경을 기록한다.
19. 같은 메뉴의 다른 항목이 같은 화면·위치로 가는지 실제로 눌러 확인한다(E5).
