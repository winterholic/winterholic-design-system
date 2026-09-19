# 01 · 색 (stock-gosu)

## 1. 팔레트의 출처와 원칙

stock-gosu 는 이미 **Toss Blue `#3182F6` + Toss 회색조** 로 만들어져 있었다(`front/src/styles/global.css`, `front/docs/finance-design-system.html`). 이 시스템은 그 값을 버리지 않고 토큰으로 옮겼다. 그래서 blue·gray 램프의 50~900 은 기존 hex 와 **완전히 같다.** 새로 생긴 것은 950 단계, red/green/yellow 의 빠져 있던 중간 단계, 차트 보조 램프(orange·violet·magenta), 그리고 다크 모드다.

원칙 네 가지(기존 FDS 를 그대로 잇는다).
1. **화면의 90% 는 회색조.** 색은 등락·상태·액션에만.
2. **등락색은 정보다.** 한국 관례 상승=빨강, 하락=파랑, 보합=회색. 장식으로 쓰지 않는다.
3. **한 화면에 강조는 하나.** primary 버튼 1개, 브랜드색 면 1개.
4. **색만으로 말하지 않는다.** 부호·화살표·아이콘·문구가 항상 같이 간다.

## 2. 브랜드와 로고

파랑새 로고(`assets/brand/stock-gosu.svg`)의 색이 곧 브랜드 램프다.

| 이름 | hex | 토큰 | 로고에서 |
|---|---|---|---|
| Toss Blue | `#3182F6` | `brand.blue` = `blue.500` | 몸통 |
| Sky | `#64A8FF` | `brand.sky` = `blue.300` | 날개 하이라이트 |
| Deep | `#194AA6` | `brand.deep` = `blue.900` | 눈 |
| Canvas | `#F2F4F6` | `brand.canvas` = `gray.100` | 페이지 배경 |

로고 사용 규칙은 14.

## 3. 램프

| 램프 | 앵커 | 기존 값 유지 | 글자로 쓸 수 있는 최소 단계(흰 배경 4.5:1) |
|---|---|---|---|
| blue | 500 #3182F6 | 50~900 전부 | **700** #1B64DA (5.41). 500 은 3.71, 600 #216FE8 은 4.66 |
| gray | 500 #8B95A1 | 50~900 전부 + 950 #111418 | **600** #6B7684 (4.62). 500 은 3.04 |
| red | 500 #F04452 | 50·500 | **600** #E0263A (4.66). 500 은 3.71 |
| green | 400 #15C39A | 50·400·500 | **600** #088467 (4.66). 기존 500/600 은 실제 밝기가 400/500 자리 |
| yellow | 300 #FFB200 | 50·300·400 | **600** #936712 (5.01). 노랑은 어둡게 내려야 글자가 된다 |
| orange · violet · magenta | 차트 전용 | 새로 생성 | 글자 금지 |

`blue.600` 은 기존 `#2272EB` 를 `#216FE8` 로 아주 조금 내렸다(흰 글자 4.49 → 4.66). `red.600` 도 `#E42939` → `#E0263A`(4.49 → 4.66). 둘 다 AA 를 0.01 차이로 놓치던 값이라 조정했다. 눈으로는 구분되지 않는다.

전 단계 대비 수치는 `tokens/src/palette.json` 의 `$extensions["sg.contrast"]`.

## 4. 등락색 (finance)

| 토큰 | 라이트 | 언제 |
|---|---|---|
| `finance.up.text` | red.600 #E0263A | **13~15px 등락률·등락폭 글자.** 흰 카드 위 4.66:1 |
| `finance.up.solid` | red.500 #F04452 | 20px 이상 bold 큰 숫자, 배지 채움, 캔들, 화살표, 도트. 3.71:1 이라 큰 글자·비텍스트(3:1)에서만 |
| `finance.up.bg` | red.50 #FFEEEE | 등락 배지 배경, 행 강조 |
| `finance.up.on-bg` | red.700 #9F2430 | up.bg 위 글자(배지 안). 600 은 옅은 빨강 위에서 4.15 라 700 |
| `finance.up.border` | red.200 | 등락 카드 테두리 |
| `finance.up.muted` | red.300 | 히트맵 약한 상승, 스파크라인 채움 |
| `finance.down.*` | blue 같은 단계 | |
| `finance.flat.*` | gray 같은 단계 | 보합. 부호 없음 |
| `finance.flash-up/down` | 500 @15% | 실시간 틱 셀 배경 플래시(05) |

### 어디에 text, 어디에 solid
```
현재가 72,400   ▲ 1,200 (+1.68%)
 └ price-lg     └ change: finance.up.text (13px)
   text.primary  화살표만 finance.up.solid
```
- 가격 자체는 `text.primary`. 등락은 방향색. 현재가까지 빨갛게 칠하면 화면이 빨간 덩어리가 된다(종목 상세 헤더의 큰 등락폭만 예외로 `solid` 허용).
- 표·리스트의 등락률 열: `finance.<d>.text`. 배지형이면 `bg` + `on-bg`.
- 차트·도트·프로그레스: `solid`.

### 미국식 반전
글로벌 종목 화면은 컨테이너에 `data-market="us"` 를 붙인다. `tokens.css` 가 그 스코프 안에서 `finance.up.*` 을 `finance.us-up.*`(초록)로, `down` 을 빨강으로 바꾼다. 컴포넌트 코드는 토큰 이름을 그대로 쓴다. 기본값은 한국 관례이고 설정으로 바꾼다.

### 빨강의 충돌
금융에서 빨강은 상승이지만 오류·위험(`status.danger`, `action.danger`)도 빨강이다. 규칙:
- 오류 배너·토스트에는 **아이콘 + 제목** 을 반드시 붙인다("⚠ 주문 실패").
- 등락 옆에 오류 배지를 두지 않는다. 오류는 행 밖(배너)으로.
- 매도 버튼은 `action.danger` 가 아니라 `finance.down`? — 아니다. 매도는 되돌릴 수 없는 동작이므로 `action.danger`(진한 빨강 #E0263A)를 쓰고, 등락 빨강(#F04452)과 굵기·크기로 구분한다. stock-gosu 는 정보·분석 서비스라 실제 매도 버튼은 모의투자에만 있다.

## 5. 시맨틱 색

### surface
| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | gray.100 #F2F4F6 | gray.950 | body. 흰 카드가 떠 보이게 회색 |
| `default` | white | gray.900 | 카드·리스트·인풋 |
| `raised` | white + shadow | gray.800 | 바텀시트·모달·드롭다운·검색 결과 |
| `sunken` | gray.50 | #14181D | 표 헤더·card-flat·세그먼트 트랙 |
| `sunken-strong` | gray.100 | gray.950 | 흰 카드 안에서 sunken 이 안 보일 때(탭 트랙·코드) |
| `overlay` | 900 @50% | black @60% | 스크림 |
| `inverse` | gray.900 | gray.50 | 툴팁·토스트 |
| `brand` | blue.600 | blue.800 | 온보딩 헤더·프로모션. 흰 글자 4.66 |
| `brand-subtle` | blue.50 | blue.950 | 선택 항목·안내 카드·시장 태그 배경 |
| `disabled` | gray.100 | gray.800 | |

**캔버스 규칙**: canvas(#F2F4F6) 위에 직접 놓는 글자는 `text.primary`·`secondary` 만. `tertiary`(4.19)·상태색·등락색은 흰 카드 안에서 쓴다. 페이지 헤더의 설명 문구도 `secondary` 다. 빌드가 이 기준으로 검사한다.

### text
| 토큰 | 라이트 | 대비(흰) | 언제 |
|---|---|---|---|
| `primary` | gray.900 | 16.56 | 본문·제목·가격 |
| `secondary` | gray.700 | 7.11 | 설명·메타·표 보조 열 |
| `tertiary` | gray.600 | 4.62 | 캡션·라벨·표 헤더. **기존 gray.500 에서 한 단계 내림** |
| `placeholder` | gray.600 | 4.62 | |
| `disabled` | gray.400 | | |
| `brand` / `link` | blue.700 | 5.41 | **기존 blue.500 에서 내림**. 링크는 밑줄 동반 |
| `success` `warning` `danger` `info` | green.600 / yellow.600 / red.600 / blue.700 | 4.66 이상 | 상태 문구 |

### border
`subtle` gray.100 (리스트 구분) · `default` gray.200 (카드·표) · `strong` gray.300 (인풋·아웃라인 버튼) · `input-strict` gray.500 (체크박스·라디오, 3.04) · `brand`/`focus` blue.500 · `danger` red.500.

### action
| variant | 언제 | 비고 |
|---|---|---|
| `primary` | 화면의 주 행동. 1개 | blue.500 + 흰 글자 3.71:1. 기존 제품과 같게 유지. 라벨 15px/600 아래로 내리지 않는다 |
| `primary-strict` | 계정·결제·공공 기준 화면 | blue.600, 4.66:1 |
| `secondary` | 연파랑 배경 + 파랑 글자(기존 btn-secondary) | 주 행동 옆 대안 |
| `outline` | 투명 + 회색 테두리(기존 btn-outline) | 필터·정렬·더보기 |
| `ghost` | 회색 배경(기존 btn-ghost) | 카드 안 가벼운 행동 |
| `danger` | 매도·삭제·탈퇴·초기화 | red.600. 확인 시트 안에서 |
| `disabled` | | opacity 대신 색 토큰 |

다크에서 primary 는 **밝은 파랑(blue.400) + 어두운 글자(gray.950)** 로 방향이 바뀐다. 흰 글자는 어떤 파랑 위에서도 AA 를 못 넘어서다. 09.

### status
`success` `warning` `danger` `info` `neutral` × `bg` `border` `text` `icon` `solid` `on-solid`. 배너·인라인은 bg+border+text+icon, 배지는 solid+on-solid. `warning.solid`(#FFB200) 위 글자는 검정. `danger` 는 §4 의 충돌 규칙.

### interactive
`focus-ring` blue.500 (2px 외곽) · `focus-ring-soft` blue @28% (인풋 안쪽 3px, 기존 --focus-ring) · `selected-*` · `hover-overlay` · `row-hover` blue.50 (종목 행).

### chart
11 참조. `series.1~8` 고정 순서, `overlay.ma*`, `candle.*`, `sparkline.*`, `heat.*`, `grid` `axis` `label` `reference` `crosshair` `tooltip-bg`. recharts 는 `dist/chart-theme.ts` 의 raw 값을 쓴다.

## 6. 조합 규칙

1. 한 화면의 색상(hue): 파랑(브랜드·하락) + 빨강(상승) + 회색. 상태색은 배너·배지 한두 개.
2. 채도 높은 면은 작게. 카드 전체를 빨갛게/파랗게 칠하지 않는다. 등락은 글자·배지·좌측 3px 바까지.
3. 종목 리스트에서 등락 열만 색. 종목명·가격·거래량은 회색조.
4. 히트맵·트리맵처럼 면 전체가 등락색인 화면은 `muted`/`heat` 단계로 채도를 낮추고 글자는 흰색 또는 gray.900 을 밝기에 따라 고른다(11).
5. 다크는 시맨틱이 처리. 컴포넌트에 `dark:` 없음.

## 7. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `color: var(--finance-up)` 로 13px 등락률 | `var(--sg-color-finance-up-text)` (600). solid 는 3.71 |
| `color: var(--blue-500)` 링크 | `text.link` (blue.700) |
| 캡션에 `gray-500` | `text.tertiary` (gray.600) |
| 캔버스 위에 캡션 직접 | 카드 안으로, 또는 `text.secondary` |
| 오류 토스트를 빨간 글자만 | 아이콘 + "주문 실패" 제목 + 원인 |
| 미국 종목만 초록/빨강 hex 로 분기 | `data-market="us"` 스코프 |
| 시리즈 색 랜덤·순환 | `chart.series.1…8` 고정, 9번째는 `other` |
| 현재가·등락폭·등락률 전부 빨강 | 가격은 `text.primary`, 등락만 방향색 |
