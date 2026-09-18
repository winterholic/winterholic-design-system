# 00 · 결정 가이드 — 상황별 정답표

> 개발 중 "여기 뭐 쓰지?" 가 떠오르면 이 문서부터 본다. 상황 → 토큰 이름 → 값 순으로 적었다. 이유가 궁금하면 각 행 끝의 문서 번호로 간다.
> 토큰은 CSS 변수 `--wh-<경로>` 로 쓴다. 예: `color.action.primary.bg` → `var(--wh-color-action-primary-bg)`.

## 1. 색

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| 페이지 배경 | `color.surface.canvas` | #F7F9F9 | 01 |
| 카드·패널·인풋 배경 | `color.surface.default` | #FFFFFF | 01 |
| 모달·드롭다운·팝오버 배경 | `color.surface.raised` (+ shadow) | #FFFFFF | 01·04 |
| 코드블록·표 헤더·탭 트랙 배경 | `color.surface.sunken` | #E6EDF8 | 01 |
| 선택된 행·활성 항목 배경 | `color.interactive.selected-bg` | #F0F8FF | 01 |
| 히어로·프로모션 배경 | `color.surface.brand` 또는 `gradient.brand` | #1D2F6F | 01·04 |
| 본문 글자 | `color.text.primary` | #2B3139 | 01 |
| 설명·메타 글자 | `color.text.secondary` | #535A63 | 01 |
| 캡션·타임스탬프 | `color.text.tertiary` | #64748B | 01 |
| 플레이스홀더 | `color.text.placeholder` | #64748B | 01 |
| 링크 | `color.text.link` / hover `link-hover` | #1A76B4 / #0A5E93 | 01 |
| 브랜드색 글자(강조 숫자·키워드) | `color.text.brand` | #0A5E93 | 01 |
| 어두운 면 위 글자 | `color.text.inverse` 또는 `on-brand` | #FFFFFF | 01 |
| 카드 외곽선 | `color.border.default` | #D4DBE6 | 01 |
| 리스트 구분선 | `color.border.subtle` | #E6EDF8 | 01 |
| 인풋 외곽선 | `color.border.strong` | #9FA7B1 | 01 |
| 체크박스·라디오 외곽선 | `color.border.input-strict` | #828A94 | 01·08 |
| 포커스 링 | `color.interactive.focus-ring` 2px offset 2px | #2081C3 | 08 |
| 주 버튼 배경 / 글자 | `color.action.primary.bg` / `.text` | #1A76B4 / #FFFFFF | 01·06 |
| 보조 버튼 | `color.action.secondary.*` | 흰 배경 + #BCC3CE 테두리 | 06 |
| 텍스트 버튼(고스트) | `color.action.ghost.*` | 투명 + #0A5E93 글자 | 06 |
| 삭제·되돌릴 수 없는 버튼 | `color.action.danger.*` | #CE2D4F / #FFFFFF | 06·07 |
| 비활성 컨트롤 | `color.action.disabled.*` 또는 `opacity.disabled` | #D4DBE6 / #828A94 | 06 |
| 성공 메시지 배너 | `color.status.success.{bg,border,text,icon}` | #E5FFE9 / #A7EFB3 / #166B31 | 07 |
| 경고 배너 | `color.status.warning.*` | #FFF6E4 / #FAC748 / #6B5626 | 07 |
| 오류 배너·유효성 실패 | `color.status.danger.*` | #FFF4F4 / #FFCCCE / #A2193A | 07 |
| 안내 배너 | `color.status.info.*` | #F0F8FF / #BCE0FE / #0A5E93 | 07 |
| 상태 배지(채움) | `color.status.<s>.solid` + `.on-solid` | 예: 성공 #06873A + 흰 글자 | 06 |
| 상태 도트 | `color.status.<s>.solid` 8px 원 | | 06 |
| 차트 시리즈 | `color.chart.categorical.1` 부터 순서대로 | #2081C3, #67B6B7, … | 11 |
| 장식·그라데이션·일러스트 | `color.accent.*`, `gradient.*` | | 01·04 |

**절대 규칙 세 개**
1. 화면 코드에 hex 를 쓰지 않는다. `blue.500` 같은 원시 램프도 직접 쓰지 않는다(장식 예외는 01 §6).
2. 글자색은 `color.text.*` 에서만 고른다. 브랜드 원색 `#2081C3` 은 글자로 못 쓴다(대비 4.21:1).
3. 상태색(빨강·초록·노랑)은 상태를 말할 때만 쓴다. "예뻐서" 빨강을 쓰지 않는다.

## 2. 글자

| 상황 | 스타일 클래스 | 크기/굵기/행간 | 문서 |
|---|---|---|---|
| 페이지 제목(앱) | `.wh-heading-1` | 30px / 700 / 1.3 | 02 |
| 섹션·모달 제목 | `.wh-heading-2` | 24px / 600 / 1.3 | 02 |
| 카드 제목 | `.wh-heading-3` | 20px / 600 / 1.3 | 02 |
| 그룹 제목·사이드바 섹션 | `.wh-heading-4` | 18px / 600 / 1.5 | 02 |
| 폼 섹션·작은 카드 제목 | `.wh-heading-5` | 16px / 600 / 1.5 | 02 |
| 본문 | `.wh-body-md` | 16px / 400 / 1.6 | 02 |
| 보조 설명·표 셀·카드 설명 | `.wh-body-sm` | 14px / 400 / 1.6 | 02 |
| 버튼(md)·폼 라벨·표 헤더·메뉴 | `.wh-label-md` | 14px / 500 / 1.5 | 02 |
| 큰 버튼·탭·내비 | `.wh-label-lg` | 16px / 500 / 1.5 | 02 |
| 배지·칩·작은 버튼 | `.wh-label-sm` | 12px / 500 / 1.5 | 02 |
| 도움말·타임스탬프 | `.wh-caption` + `text.tertiary` | 12px / 400 / 1.5 | 02 |
| 섹션 위 카테고리 라벨 | `.wh-overline` | 11px / 600 / 대문자·자간 0.04em | 02 |
| 코드 | `.wh-code` | 14px 모노 | 02 |
| 표의 금액·수치 | `.wh-numeric` (tabular-nums) | 16px / 500 | 02 |
| 랜딩 히어로 | `.wh-display-lg` (모바일 자동 축소) | 60px / 700 / 1.2 | 02 |
| 랜딩 섹션 제목 | `.wh-display-md` | 48px / 700 / 1.2 | 02 |

## 3. 간격·크기

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 아이콘↔라벨 | `space.2` | 8px | 03 |
| 라벨↔인풋 | `space.2` | 8px | 03·06 |
| 인풋↔도움말 | `space.1-5` | 6px | 06 |
| 폼 필드↔필드 | `space.4` | 16px | 03 |
| 버튼↔버튼(같은 그룹) | `space.2` (sm) / `space.3` (md) | 8 / 12px | 06 |
| 카드 안쪽 패딩 | `space.5` (기본) · `space.4` (작은) · `space.6` (큰) | 20 / 16 / 24px | 03 |
| 카드↔카드 (그리드) | `space.4` 모바일 · `space.6` 데스크톱 | 16 / 24px | 03 |
| 카드 제목↔본문 | `space.3` | 12px | 06 |
| 관련 블록 사이 | `space.6` | 24px | 03 |
| 섹션 사이(앱) | `space.8` 모바일 · `space.12` 데스크톱 | 32 / 48px | 03 |
| 섹션 사이(랜딩) | `space.16` 모바일 · `space.24` 데스크톱 | 64 / 96px | 03 |
| 화면 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 16 / 24 / 32px | 03 |
| 콘텐츠 최대 폭(앱) | `size.container.xl` | 1280px | 03 |
| 본문 글 한 줄 폭 | `size.container.prose` | 720px | 03 |
| 컨트롤 높이(기본) | `size.control.md` | 40px | 06 |
| 컨트롤 높이(밀도 높음) | `size.control.sm` | 32px | 06 |
| 컨트롤 높이(모바일 주 액션) | `size.control.lg` | 48px | 06 |
| 아이콘(본문 옆·md 컨트롤) | `size.icon.md` | 20px | 10 |
| 아이콘(내비·헤더) | `size.icon.lg` | 24px | 10 |
| 터치 영역 최소 | `size.touch-target-min` | 44px | 08 |
| 헤더 높이 | `size.layout.header` / `header-lg` | 56 / 64px | 03 |
| 사이드바 폭 | `size.layout.sidebar` / `-collapsed` | 240 / 64px | 03 |

## 4. 모양·깊이

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 버튼·인풋·드롭다운 | `radius.md` | 8px | 04 |
| 카드·배너·팝오버 | `radius.lg` | 12px | 04 |
| 모달·바텀시트 | `radius.xl` | 16px | 04 |
| 체크박스·인라인 코드·작은 태그 | `radius.xs` | 4px | 04 |
| 툴팁·sm 컨트롤 | `radius.sm` | 6px | 04 |
| 아바타·칩·토글·필 버튼 | `radius.full` | 9999px | 04 |
| 카드 그림자(기본) | `shadow.sm` | | 04 |
| 카드 hover·드롭다운·팝오버 | `shadow.md` | | 04 |
| 모달·드로어 | `shadow.lg` | | 04 |
| 눌린 상태·인풋 안쪽 | `shadow.inner` | | 04 |
| 히어로 배경 그라데이션 | `gradient.brand` (135deg) | 남색→파랑→하늘 | 04 |
| 배지·아바타 폴백·강조 텍스트 | `gradient.aurora` | 파랑→민트 | 04 |
| 안 보일 듯한 섹션 배경 | `gradient.frost` | 눈→연파랑 | 04 |
| 테두리 두께 | `border-width.hairline` | 1px | 04 |
| 왼쫀 강조 바(콜아웃) | `border-width.accent` | 4px | 04 |

## 5. 움직임

| 상황 | duration | easing | 문서 |
|---|---|---|---|
| hover 색 변화·토글 | `fast` 100ms | `standard` | 05 |
| 드롭다운·툴팁·탭 인디케이터 | `normal` 200ms | `standard` | 05 |
| 모달·드로어 열기 | `slow` 300ms | `decelerate` | 05 |
| 모달·드로어 닫기 | `normal` 200ms | `accelerate` | 05 |
| 토스트 진입 | `slower` 500ms | `decelerate` | 05 |
| 체크·토글 손잡이 | `fast` 100ms | `spring` | 05 |
| 스피너·프로그레스 | 반복 | `linear` | 05 |

## 6. 레이어

| 상황 | `z-index` | 값 |
|---|---|---|
| 드롭다운·자동완성 | `dropdown` | 1000 |
| 스티키 헤더 | `sticky` | 1100 |
| 스크림 | `overlay` | 1200 |
| 모달 | `modal` | 1300 |
| 모달 안 팝오버·날짜 선택 | `popover` | 1400 |
| 토스트 | `toast` | 1500 |
| 툴팁 | `tooltip` | 1600 |

## 7. 이 표에 없는 상황이면

1. 비슷한 상황의 행을 찾아 같은 토큰을 쓴다. 새 값을 만들지 않는다.
2. 정말 없으면 `docs/13-governance.md` 의 절차로 토큰을 추가하고 이 표에 행을 넣는다.
3. 임시로 hex·px 를 박아야 하면 `/* TODO(ds): 토큰 없음 */` 주석을 남긴다. grep 으로 나중에 걷어낸다.
