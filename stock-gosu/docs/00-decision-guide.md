# 00 · 결정 가이드 — 상황별 정답표 (stock-gosu)

> "여기 뭐 쓰지?" 가 떠오르면 이 문서부터. 토큰은 CSS 변수 `--sg-<경로>` 로 쓴다. 예: `color.finance.up.text` → `var(--sg-color-finance-up-text)`.
> 기존 `global.css` 변수명(`--blue-500`, `--space-16`, `--finance-up`)은 `dist/legacy-aliases.css` 가 이어 주지만, 새 코드는 `--sg-*` 를 쓴다.

## 1. 등락 (가장 자주 막히는 것)

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| 리스트·표의 등락률 글자(13~15px) | `color.finance.up.text` / `down.text` / `flat.text` | #E0263A / #216FE8 / #6B7684 | 01 |
| 종목 상세 현재가 같은 큰 숫자(20px 이상 bold) | `color.finance.up.solid` / `down.solid` | #F04452 / #3182F6 | 01 |
| 등락 배지 배경 / 그 위 글자 | `finance.<d>.bg` / `finance.<d>.on-bg` | #FFEEEE / #9F2430 (상승) | 01·06 |
| 캔들·거래량·스파크라인 | `color.chart.candle.*`, `chart.sparkline.*` | | 11 |
| 히트맵 5단계 | `color.chart.heat.up-3 … down-3` | | 11 |
| 실시간 틱 깜빡임 | `finance.flash-up` / `flash-down`, `motion.duration.flash` 600ms | | 05 |
| 보합(0.00%) | `finance.flat.*` + 부호 없음 | | 01 |
| 미국 주식 화면(상승 초록) | 컨테이너에 `data-market="us"` 만 붙인다. 토큰 이름은 그대로 | | 01 |
| 부호 | 상승 `+`, 하락 `−`(U+2212), 보합 없음. 화살표 `▲▼` 는 배지·큰 숫자 옆에만 | | 07 |

**등락색 절대 규칙**: 색만으로 방향을 말하지 않는다(부호·화살표 동반). 빨강을 오류에, 파랑을 링크에 겹쳐 쓸 때는 아이콘·문맥으로 구분한다.

## 2. 색

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| 페이지 배경 | `color.surface.canvas` | #F2F4F6 | 01 |
| 카드·리스트·인풋 | `color.surface.default` | #FFFFFF | 01 |
| 바텀시트·모달·드롭다운 | `color.surface.raised` + shadow | #FFFFFF | 01 |
| 표 헤더·card-flat·세그먼트 트랙 | `color.surface.sunken` / `sunken-strong` | #F9FAFB / #F2F4F6 | 01 |
| 선택된 행·활성 항목 | `color.interactive.selected-bg` | #E8F3FF | 01 |
| 종목 행 hover | `color.interactive.row-hover` | #E8F3FF | 06 |
| 본문 / 설명 / 캡션 | `color.text.primary` / `secondary` / `tertiary` | #191F28 / #4E5968 / #6B7684 | 01 |
| 캔버스(회색 배경)에 직접 놓는 글자 | `primary` 또는 `secondary` 만 | | 01 |
| 링크·브랜드 글자 | `color.text.link` / `brand` | #1B64DA | 01 |
| 카드 외곽선 / 인풋 / 체크박스 | `border.default` / `strong` / `input-strict` | #E5E8EB / #D1D6DB / #8B95A1 | 01 |
| 주 버튼 | `color.action.primary.*` (엄격 화면 `primary-strict`) | #3182F6 (#216FE8) | 06 |
| 연파랑 보조 버튼 | `color.action.secondary.*` | #E8F3FF + #1B64DA | 06 |
| 회색 보조 버튼(기존 ghost) | `color.action.ghost.*` | #F2F4F6 + #333D4B | 06 |
| 아웃라인 버튼 | `color.action.outline.*` | 투명 + #D1D6DB 테두리 | 06 |
| 매도·삭제·탈퇴 | `color.action.danger.*` | #E0263A | 06·07 |
| 성공·경고·오류·안내 배너 | `color.status.<s>.{bg,border,text,icon}` | | 07 |
| 상태 배지(채움) | `status.<s>.solid` + `on-solid` | | 06 |
| 차트 시리즈 | `color.chart.series.1…8`, 9번째부터 `other` | #3182F6, #EB6834, … | 11 |
| 이동평균선 | `color.chart.overlay.ma5/20/60/120` | | 11 |

## 3. 글자

| 상황 | 클래스 | 크기/굵기 | 문서 |
|---|---|---|---|
| 페이지 제목 | `.sg-title-1` | 24 / 700 | 02 |
| 섹션·시트 제목 | `.sg-title-2` | 20 / 700 | 02 |
| 카드·패널 제목 | `.sg-title-3` | 18 / 600 | 02 |
| 리스트 행 제목·작은 카드 제목 | `.sg-title-4` | 15 / 600 | 02 |
| 본문·표 셀·리스트 행 | `.sg-body-2` | 15 / 400 | 02 |
| 안내 문장·리서치 본문 | `.sg-body-1` | 17 / 400 | 02 |
| 보조 설명 | `.sg-body-3` | 13 / 400 | 02 |
| 라벨(기존 .label)·메타 | `.sg-caption` + `text.tertiary` | 13 / 500 | 02 |
| 표 헤더·타임스탬프·시장 태그 | `.sg-micro` | 12 / 500 | 02 |
| 버튼·탭·세그먼트 | `.sg-label-md` | 15 / 600 | 02 |
| 배지 | `.sg-badge` | 12 / 700 | 02 |
| 현재가·총자산 | `.sg-price-lg` | 28 / 800 tabular | 02 |
| KPI·카드 안 가격 | `.sg-price-md` | 20 / 700 tabular | 02 |
| 리스트·표 가격 | `.sg-price-sm` | 15 / 700 tabular | 02 |
| 등락률 | `.sg-change` + `.sg-up/.sg-down/.sg-flat` | 13 / 700 tabular | 02 |
| 거래량·PER 같은 일반 수치 | `.sg-numeric` | 15 / 500 tabular | 02 |
| 총자산 display | `.sg-display` | 32 / 800 | 02 |

## 4. 간격·크기

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 등락 화살표↔숫자, 종목명↔시장 태그 | `space.1` | 4 | 03 |
| 라벨↔인풋, 버튼 아이콘↔라벨 | `space.1-5` | 6 | 03 |
| 리스트 행 안 세로 간격 | `space.2` | 8 | 03 |
| 리스트 행 상하 패딩 | `space.2-5` | 10 | 06 |
| 카드 안 요소 사이·셀 좌우 | `space.3` | 12 | 03 |
| 컴포넌트 내부 패딩·컴포넌트 사이 | `space.4` | 16 | 03 |
| 카드 패딩 | `space.5` | 20 | 03 |
| 카드 묶음 사이·페이지 섹션 gap | `space.6` | 24 | 03 |
| 큰 구획 사이 | `space.8` / `space.12` | 32 / 48 | 03 |
| 화면 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 20 / 24 / 32 | 03 |
| 콘텐츠 최대폭 | `size.container.xl` | 1180 | 03 |
| 버튼·인풋 높이 | `size.control.md` | 44 | 06 |
| 툴바·세그먼트 항목 | `size.control.sm` | 36 | 06 |
| 하단 고정 CTA | `size.control.lg` | 52 | 06 |
| 종목 행 높이 | `component.stock-row.height` / `-compact` / `-mobile` | 68 / 52 / 78 | 06 |
| 표 행 높이 | `component.table.row-height-*` | 40 / 48 / 68 | 06 |
| 하단 탭바 | `size.layout.tabbar` + safe-area | 56 | 03 |
| sticky 패널 top | `size.layout.sticky-offset` | 128 | 03 |
| 터치 최소 | `size.touch-target-min` | 44 | 08 |

## 5. 모양·깊이

| 상황 | 토큰 | 값 |
|---|---|---|
| 버튼·인풋·드롭다운 | `radius.lg` | 12 |
| 카드 | `radius.2xl` (밀도 높은 표 카드는 `xl`) | 20 (16) |
| 모달·바텀시트 | `radius.2xl` | 20 |
| 세그먼트 활성 항목·툴팁 | `radius.sm` | 6 |
| sm 버튼·칩 | `radius.md` | 8 |
| 배지·시장 태그·아바타 | `radius.full` | |
| 카드 기본 그림자 | `shadow.sm` | 기존 shadow-1 |
| 카드 hover·드롭다운·차트 툴팁 | `shadow.md` | 기존 shadow-2 |
| 바텀시트·토스트·검색 결과 | `shadow.lg` | 기존 shadow-3 |
| 모달 | `shadow.xl` | 기존 shadow-4 |
| 스크롤 시 sticky 헤더·탭바 | `shadow.sticky` | |
| 온보딩 헤더 | `gradient.brand` | |
| 스파크라인 채움 | `gradient.sparkline-up/down` | |
| 가로 스크롤 끝 페이드 | `gradient.fade-right` | |

## 6. 움직임

| 상황 | duration | easing |
|---|---|---|
| hover·세그먼트 이동·토글 | `fast` 150 | `out` |
| 드롭다운·아코디언·탭 인디케이터 | `normal` 250 | `out` |
| 바텀시트·모달 열기 | `slow` 400 | `out` |
| 닫기 | `normal` 250 | `in` |
| 실시간 틱 플래시 | `flash` 600 | `in-out` |
| 차트 그려짐·갱신 | `chart` 300 | recharts 기본 |
| 토스트 유지 | `toast` 3000 / `toast-long` 6000 | |

## 7. 레이어

`sticky-panel` 20(검색 결과·분석 패널) · `dropdown` 1000 · `sticky` 1100(상단 탐색·하단 탭바) · `overlay` 1200 · `sheet` 1250 · `modal` 1300 · `popover` 1400 · `toast` 1500 · `tooltip` 1600

## 8. 이 표에 없으면
1. 가장 비슷한 행의 토큰을 쓴다. 새 값을 만들지 않는다.
2. 정말 없으면 `docs/13-governance.md` 절차로 추가하고 여기 행을 넣는다.
3. 급하면 `/* TODO(ds): 이유 */` 를 남긴다.
