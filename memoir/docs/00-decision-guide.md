# 00 · 결정 가이드 — 상황별 정답표 (memoir)

> 토큰은 CSS 변수 `--mm-<경로>`, Tailwind 는 프리셋 클래스(`bg-surface-zone`, `text-text-tertiary`). 기존 클래스명(`text-primary` `bg-surface-low` `bg-sub-cream` `shadow-soft`)도 프리셋이 별칭으로 살려 두었다.
> 세 가지 원칙이 대부분의 결정을 끝낸다: **선 대신 면(No-Line)** · **파랗다 = 클릭 가능** · **핑크는 강조, 로즈는 액션**.

## 1. 면과 구획 (가장 자주 막히는 것)

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| 페이지 배경 | `color.surface.canvas` | #FFF9F8 | 01 |
| 리스트·구역 바닥(카드가 놓이는 곳) | `color.surface.zone` | #FFF0EE | 01 |
| 구역 안 구역·인풋 채움·비활성 | `color.surface.zone-deep` | #FEEAE6 | 01 |
| 카드·메모·에디터 면 | `color.surface.default` | #FFFFFF | 01 |
| 섹션 배경·벤토 박스·빈 상태 카드 | `color.surface.cream` | #FFEBE7 | 01 |
| 모달·드롭다운·플로팅 바 | `color.surface.raised` + `glass.blur` | white 80% + blur 20 | 04 |
| 대시보드 벤토 박스 | `component.bento.bg` + `blur-strong` | white 40% + blur 24 | 06 |
| 리스트 항목 사이 | **선 금지** → `space.6` 24 여백, 또는 hover 시 `interactive.row-hover`(흰 면) | | 03 |
| 카드 사이 | `component.card.gap` | 24 | 03 |
| 섹션 사이 | `space.12` | 48 | 03 |
| 접근성상 경계가 꼭 필요할 때 | `color.border.ghost` | outline 15% | 01 |
| 캘린더 그리드처럼 선이 정보일 때 | `color.border.default` | #E5D7D4 | 01 |
| 코드 블록 | `color.code.bg` | #1A1A1A (항상 어둡다) | 01 |

## 2. 색

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| 본문·제목 | `color.text.primary` | #231917 (따뜻한 검정, #000 금지) | 01 |
| 설명·미리보기 | `color.text.secondary` | #4C413E | 01 |
| 타임스탬프·라벨·메타 | `color.text.tertiary` | #635654 | 01 |
| 링크·클릭 가능한 글자 | `color.text.link` | #465D95 | 01 |
| 헤드라인 강조 단어·로고 m | `color.text.brand` | #A1385E | 01 |
| CTA 버튼 | `color.action.primary.*` | #A1385E + 흰 글자 | 06 |
| 보조 버튼 | `color.action.secondary.*` | #FEEAE6 + #A1385E 글자 | 06 |
| 취소·내비 텍스트 버튼 | `color.action.ghost.*` | 투명 + #635654 | 06 |
| 활성 메뉴·선택된 카테고리 | `color.action.interactive.*` | #7F95D1 + 흰 글자 | 06 |
| 삭제 | `color.action.danger.*` | #C33145 | 06·07 |
| 필터 칩 기본 / 활성 | `color.chip.bg`+`text` / `bg-active`+`text-active` | #FEEAE6 / #FF82A9 + #78163E | 06 |
| #태그 배지 | `color.chip.tag-bg` + `tag-text` | #FFC0BE + #231917 | 06 |
| ALL 칩 | `color.chip.all-bg` + `all-text` | #231917 + #FFF9F8 | 06 |
| 선택된 행·활성 항목 배경 | `color.interactive.selected-bg` | #FFF3F6 | 01 |
| 포커스 링·인풋 포커스 밑줄 | `color.border.focus` / `interactive` | #465D95 | 08 |
| 성공·경고·오류·안내 | `color.status.<s>.*` | | 07 |
| 보안·2FA·잠금 상태 | `color.status.secure.*` | 핑크 계열 | 07 |
| 카테고리 식별색(드롭다운 아이콘 배경) | `color.category.<name>` | | 01 |
| 캘린더 활동 히트맵 | `color.chart.heat.0…4` | paper-deep → pink.400 | 11 |

**절대 규칙**: 핑크 원색 `#FF82A9` 은 글자·버튼 배경에 못 쓴다(대비 2.33). 글자는 로즈 `#A1385E`, 버튼도 로즈. 핑크는 활성 칩·로고·장식·히트맵에만.

## 3. 글자

| 상황 | 클래스 | 크기/굵기 | 문서 |
|---|---|---|---|
| 랜딩·빈 상태 대형 | `.mm-display-lg` | 56/700 (모바일 36) | 02 |
| 대시보드 인사·카테고리 히어로 | `.mm-display-md` | 44/700 | 02 |
| 메모 제목·페이지 제목 | `.mm-headline` | 28/600 | 02 |
| 섹션·모달 제목 | `.mm-title-lg` | 24/600 | 02 |
| 카드·스니펫·벤토 제목 | `.mm-title` | 20/600 | 02 |
| 리스트 항목·북마크·폴더 이름 | `.mm-title-sm` | 16/600 | 02 |
| 본문 | `.mm-body` | 16/400/1.6 | 02 |
| 카드 설명·미리보기 | `.mm-body-sm` | 14/400 | 02 |
| 에디터 본문 | `.mm-editor` | 16/400/1.8 | 02 |
| 타임스탬프·언어 배지·섹션 라벨 | `.mm-label` | 12/600 대문자 +0.05em | 02 |
| 버튼·칩·메뉴 | `.mm-label-md` | 14/600 | 02 |
| 도움말·글자 수·저장 상태 | `.mm-caption` | 12/500 | 02 |
| 코드 블록 / 명령어 행 | `.mm-code` / `.mm-command` | 14 mono | 02 |
| 2FA PIN 칸 | `.mm-pin` | 24 mono/600 | 02 |
| 로고 | `.mm-logo` (+ `.mm-logo-mark` 에 m) | 24/800 | 14 |

## 4. 간격·크기

| 상황 | 토큰 | 값 |
|---|---|---|
| 아이콘↔라벨, 칩 사이, 라벨↔인풋 | `space.2` | 8 |
| 미리보기 카드 패딩·카드 안 요소 사이 | `space.3` | 12 |
| 컴포넌트 내부 패딩·모바일 좌우 | `space.4` | 16 |
| 카드 패딩·리스트 항목 사이·데스크톱 좌우·필드 사이 | `space.6` | 24 |
| 카드 묶음 사이·서브 헤더 아래 첫 콘텐츠 | `space.8` | 32 |
| 섹션 사이 | `space.12` | 48 |
| 메인 헤더 / 서브 헤더 / 합 | `size.layout.header` / `subheader` / `header-stack` | 60 / 44 / 104 |
| 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 16 / 24 / 32 |
| 콘텐츠 폭 | `size.container.xl`(리스트) · `lg`(에디터) · `full`(캘린더·대시보드·명령어) | 1280 / 960 / 100% |
| 에디터 글 한 줄 | `size.container.prose` | 680 |
| 버튼·인풋·헤더 검색 | `size.control.md` | 44 |
| 서브 헤더 칩(필터) | `component.chip.height` | 28 (터치 36) |
| 2FA CTA·로그인 | `size.control.lg` | 52 |
| FAB | `component.fab.size` | 56 |
| 캘린더 사이드 패널 | `size.layout.panel` | 320 |
| 카테고리 드롭다운 | `size.layout.dropdown-width` | 280 |
| 밑줄 탭 / 세그먼트 항목 | `component.tabs.height` / `segmented.item-height` | 44 / 28 |
| 설정 행 | `component.settings-row.min-height` | 56 |
| 표(드묾) 헤더/행 | `component.table.header-height` / `row-height` | 40 / 48 |
| 잔디 셀 | `component.activity-grid.cell` | 12 gap 3 |
| 더 보기 단위 | `component.load-more.page-size` | 20 |

## 5. 모양·깊이

| 상황 | 토큰 | 값 |
|---|---|---|
| 버튼·인풋·미리보기 카드·드롭다운 | `radius.md` | 8 |
| 메모 카드·코드 블록·북마크 카드 | `radius.lg` | 12 |
| 벤토 박스·영상 카드·모달 | `radius.xl` | 16 |
| 히어로·플로팅 바 | `radius.2xl` | 24 |
| 칩·태그·검색창·FAB·활성 메뉴 | `radius.full` | |
| 카드 | `shadow.none` (면 차이로만) | |
| 카드 hover(클릭 가능)·드롭다운 | `shadow.soft` | 기존 shadow-soft |
| FAB·플로팅 바·팝오버 | `shadow.ambient` | 0 12 40 6% |
| 모달 | `shadow.modal` | |
| 검색창·필 인풋 포커스 | `shadow.focus` | indigo 25% 3px |
| 인풋 포커스 밑줄 | `border-width.underline` + `border.interactive` | 2px indigo |
| 보안 카드 왼쪽 띠 | `border-width.accent` + `status.secure.solid` | 4px |
| 랜딩 블롭 | `gradient.blob-pink` / `blob-blue` (radial) | |

## 6. 움직임

| 상황 | duration | easing |
|---|---|---|
| hover 면 전환·칩 활성 | `fast` 150 | `in-out` |
| fade-in·드롭다운·툴팁 | `normal` 200 | `ease` |
| 패널 slide-in-right | `slide` 250 | `out` |
| 모달·시트 slide-up | `slow` 300 | `out` |
| 2FA·비밀번호 오류 shake | `shake` 400 | `ease` |
| 보안 메모 잠금 해제(블러 걷힘) | `lock` 600 | `out` |

## 7. 레이어
`fab` 900 · `dropdown` 1000 · `sticky` 1100(두 헤더) · `overlay` 1200 · `modal` 1300 · `popover` 1400 · `toast` 1500 · `tooltip` 1600

## 8. 없으면
0. **상황이 문제면 `docs/16-situations.md`** — "리스트에 선을 긋고 싶다", "핑크 버튼을 쓰고 싶다", "칩이 넘친다" 같은 A~J 상황 사전.
1. 가장 비슷한 행의 토큰을 쓴다. 정말 없으면 `docs/13` 절차로 추가하고 여기 행을 넣는다. 급하면 `/* TODO(ds): 이유 */`.
