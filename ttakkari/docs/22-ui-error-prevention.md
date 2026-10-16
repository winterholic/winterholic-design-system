# 22 · UI 실수 방지 (Ttakkari)

앱을 만들며 실제로 났던 화면 실수와, 그것을 시스템이 막는 방법이다. 모든 항목은 사고 → 원인 → 막는 장치 → 고치는 법 순서다. 새 화면을 만들기 전에 §1 의 세 계약과 §5 체크리스트를 본다.

## 1. 세 가지 계약

1. **간격은 부모가 정한다.** 부모가 `gap`(`.tk-stack` · `.tk-cluster` · `.tk-grid` · `.tk-gap-*`)으로 정하고, 자식은 `margin` 으로 간격을 만들지 않는다. 같은 간격이 gap 과 margin 으로 두 번 생기는 것이 "이상한 패딩"의 거의 전부다.
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

글자가 상자에 안 들어갈 때의 선택은 이 순서다. ① 줄바꿈(제목·설명·이름: `overflow-wrap: anywhere`) ② 한 줄 말줄임 + `title`(목록 행·헤더) ③ 가로 스크롤(표·코드). 글자를 줄여 맞추지 않는다.

### B. 간격·패딩

| 코드 | 사고 | 원인 | 장치 | 고치는 법 |
|---|---|---|---|---|
| B1 | PMS 생성 모달의 두 번째 필드만 20 더 떨어짐(front `7d4d1ce`, 2026-10-13) | `.tk-field + .tk-field` 의 sibling margin 이 부모 `gap` 과 겹침 | 검사 `gap-plus-margin` · DS 의 `:not(.tk-stack > *…)` | 필드 묶음을 `.tk-stack`(또는 `.tk-grid`)에 둔다 |
| B2 | 설정 섹션 설명 줄이 위아래로 이중 간격 | `.tk-fieldset__help` 의 음수·양수 margin 이 부모 gap 과 겹침 | 검사 `gap-plus-margin` | 도움말은 부모 gap 만 쓴다. 음수 margin 보정을 만들지 않는다 |
| B3 | 아이콘이 글자 첫 줄과 안 맞음 | 임의 `margin-top: 3px` | lint · 05 정렬 | `margin-top: calc((1lh - 아이콘)/2)` 한 번(컴포넌트가 이미 계산) |
| B4 | 탭바 아래가 휑하거나 드로어 하단이 두 번 비워짐(front `36eafbf`) | safe-area 를 두 요소가 각각 더함 | 규칙: safe-area 는 화면 끝에 닿는 한 요소만 | 탭바는 `padding-bottom: env()`, 그 안의 자식은 더하지 않는다 |
| B5 | 새 요소가 이름이 달라 간격 토큰을 우회 | `13px` `18px` | lint(px 직접값) | 4 배수 토큰(`space.*`) |

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

### D. 터치·입력

| 코드 | 사고 | 원인 | 장치 | 고치는 법 |
|---|---|---|---|---|
| D1 | 헤더·컴포저 아이콘 버튼이 40 이라 손가락에 작음(검사에서 발견, 1.2.0) | 보이는 크기 = 누르는 크기 | `touch-target-under-44` | 버튼은 보이는 크기를 그대로 두고 `::after` 로 44 까지(기본 포함). 칩·세그먼트·경로도 같다 |
| D2 | 터치 영역을 요소 자체로 44 로 키워 레이아웃이 커짐(front `001fc55` 에서 되돌림) | 높이를 강제 | 같은 검사 | 높이를 키우지 말고 `::after` 히트 영역 |
| D3 | iOS 에서 입력에 포커스하면 화면이 확대됨 | 입력 글자 < 16 | `input-font-under-16` | 입력·textarea·select 는 `font-size: md`(16) |
| D4 | 글자가 11px 이하 | 임의 값 | `font-under-12` · lint | 최소 12(`font.size.xs`) |
| D5 | 한글 조합 중 Enter 가 전송됨 | `isComposing` 무시 | 정적 테스트 | 19 §3 |
| D6 | 툴팁에만 있는 정보 | 터치에는 hover 가 없다 | 규칙 | 상세·읽기 줄·`title` 보조 |

### E. 구조·정보

| 코드 | 사고 | 장치 | 처방 |
|---|---|---|---|
| E1 | 모바일에서 데스크톱 전용 패널이 열려 상세가 안 보임(front `eb1d7b8`) | 아키타입 문서 §상태 | 같은 행동의 모바일 경로(시트·페이지)를 같이 만든다. 폭으로 고르는 분기를 한 곳에 둔다 |
| E2 | 탭바와 헤더에 같은 목적지가 두 번(front `53c52be`) | 21 공통 규칙 | 한 목적지는 한 곳 |
| E3 | 수정 중 회전하면 편집 중인 글이 사라짐(front `bd158ca`) | 21 §에디터 | 열 때의 표시 방식을 고정하거나 상태를 위로 올린다 |
| E4 | 모든 상태를 한 가지(성공)만 그림 | 21 상태 표 | 빈·로딩·오류·오프라인을 같이 그린다(10) |

## 3. 자동 검사

| 검사 | 무엇을 | 실행 |
|---|---|---|
| `node tokens/build.mjs` | 하드코딩(hex·px·ms·z-index·`!important`)·없는 토큰·이름 충돌·**레이아웃 lint 5종**: nowrap 짝, 아래 고정+safe-area, `vh`, `100vw`, 자식 margin-top. 예외는 규칙 본문에 `/* lint-ok: 이유 */` | `npm test` 에 포함 |
| `scripts/ttakkari-layout.check.mjs` | 실제 Chrome 에서 페이지를 6폭(320·390·768·1024·1440 + 가로 모드 844×390) × 평소/긴 글자 주입 × 라이트/다크로 열어 아래 규칙을 잰다 | `npm run check:layout` |
| `scripts/ttakkari-interaction.check.mjs` | 키보드·포커스·컴포저·분할·뷰어 동작과 6폭 가로 넘침 | `npm run check:ui` |
| front `scripts/ui-sweep/run.sh` | 같은 검사기로 **실제 앱**의 25개 경로를 합성 데이터(긴 이름·긴 제목)로 연다 | `pnpm check:layout` |
| front `scripts/ui-lint.mjs` | 앱 CSS 의 하드코딩·`100vw`·`vh`·고정 폭·자식 margin-top 을 기준선(baseline)과 비교한다. 새로 늘면 실패 | `pnpm lint` 에 포함 |

긴 글자 주입은 글자가 든 말단 요소 끝에 약 90자의 끊김 없는 문자열을 붙인다. 버튼·칩·배지의 **맨 글자**는 정해진 이름(승인·완료)이라 주입하지 않고, 데이터가 들어가는 것은 `<span>` 으로 감싸는 계약이라 그 span 에 주입한다. 실제 앱의 데이터 라벨을 찾을 때는 `--stress-raw` 로 맨 글자에도 넣는다. 정말 예외인 요소는 `data-layout-ok="이유"`(검사 제외), `data-stress-skip`(주입 제외)을 단다. 이유 없이 달지 않는다.

### 검사 규칙

| 규칙 | 뜻 |
|---|---|
| `page-overflow-x` | 문서가 화면보다 넓다. 범인 요소를 함께 알려 준다 |
| `escapes-viewport` | 가로 스크롤 상자 밖에서 요소가 화면 좌우를 넘는다 |
| `silent-clip` | `overflow: hidden` 인데 말줄임이 아니고 내용이 더 크다(조용히 잘림) |
| `ellipsis-without-full-text` | 말줄임이 생겼는데 `title`·`aria-label` 로 전체를 볼 방법이 없다 |
| `gap-plus-margin` | 부모가 gap 으로 간격을 주는데 자식에 6 초과 margin 이 있다. 저작된 값을 읽으므로 `auto` 는 걸리지 않는다 |
| `touch-target-under-44` | 터치 기기에서 누르는 영역(`::after` 포함)이 44 미만 |
| `input-font-under-16` | 입력류 글자가 16 미만(iOS 확대) |
| `font-under-12` | 글자가 12 미만 |
| `safe-area-bottom` | 화면 아래에 붙은 고정 요소의 행동이 홈 바(34)의 절반보다 가깝다 |
| `safe-area-top` | 화면 위에 붙은 고정 요소의 행동이 노치(47) 아래로 내려오지 않았다 |
| `safe-area-side` | 가로 모드에서 눌리는 요소가 좌우 노치(47)와 겹친다 |
| `skip-link-visible` | 포커스 없이 본문 바로가기가 화면 안에 보인다 |
| `dialog-outside-viewport` | 연 모달·시트가 화면 밖으로 나간다(열리는 애니메이션이 끝난 뒤 잰다) |
| `dialog-fills-viewport` | 모달이 화면을 꽉 채워 위아래 여백이 없다(전체 화면 뷰어·시트·드로어 제외) |
| `dialog-edge-to-edge` | 모달이 360 넘는 화면의 좌우 끝까지 닿는다 |
| `dialog-body-not-scrollable` | 모달 본문이 넘치는데 스크롤이 아니다 |
| `dialog-overflow-x` | 모달 자체가 가로로 넘친다 |
| `dialog-child-escapes` | 모달 안의 자식이 모달 폭을 넘는다 |
| `load-error` · `page-error` | 페이지가 안 열리거나 스크립트 오류 |

검사가 못 하는 것: 실제 iOS Safari 의 주소창·키보드·홈 바 동작(Chrome 의 safe-area 에뮬레이션과 다르다), 한글 IME, 실제 데이터의 길이 분포, 시각적 위계. 이 항목은 기기 확인이 필요하다(확인 필요).

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
