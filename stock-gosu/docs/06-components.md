# 06 · 컴포넌트 규격 (stock-gosu)

공통 상태 6종 `default` `hover` `active` `focus-visible` `disabled` `loading`, 입력류는 `error` `readonly` 추가. 값은 토큰 이름(`component.*` 는 `tokens/src/component.json`). 기존 `global.css` 클래스와의 대응을 각 절에 적었다.

---

## 1. Button (기존 `.btn`)

| size | 높이 | 좌우 | 아이콘 | 글자 | radius | 기존 | 언제 |
|---|---|---|---|---|---|---|---|
| `xs` | 28 | 8 | 12 | label-sm | md 8 | | 표 셀 안, 칩 삭제 |
| `sm` | 36 | 12 | 16 | label-sm | md 8 | `.btn-sm` | 툴바·카드 헤더·필터 |
| `md` | 44 | 18 | 20 | label-md 15/600 | lg 12 | `.btn` | **기본**. 터치 최소 44 |
| `lg` | 52 | 24 | 20 | label-lg 17/600 | xl 16 | `.btn-lg` | 하단 고정 CTA·로그인 |

variant: `primary`(`.btn-primary`) · `secondary` 연파랑(`.btn-secondary`) · `outline`(`.btn-outline`, 1.5px 테두리) · `ghost` 회색(`.btn-ghost`) · `danger`(`.btn-danger`) · `primary-strict`(신규, 계정·결제).
- `.btn-block` = 전폭. 모바일 하단 CTA 는 `lg` + block + `layout.bottom-cta-pad` + safe-area.
- 상태: hover `bg-hover`, active `scale(0.97)`, focus 링 2px, disabled `action.disabled.*` + 이유 툴팁, loading 스피너 16 + 폭 유지 + `aria-busy`.
- 한 화면 primary 1개. 주문 화면의 "매수"·"매도" 두 개는 예외: 매수 primary, 매도 danger.

## 2. Input · Search · Amount (기존 `.input`, `.input-error`)

| size | 높이 | 좌우 | 글자 | 언제 |
|---|---|---|---|---|
| `sm` | 36 | 12 | body-3 13 | 표 필터 |
| `md` | 44 | 16 | body-2 15 (모바일 16) | 기본 |
| `lg` | 52 | 16 | body-1 17 | 로그인·검색 히어로 |

- 테두리 `border.strong`, hover gray.400, focus `border.focus` + `focus-ring-soft` 3px 안쪽, error `border.danger` + 아래 `body-3` `text.danger` + 아이콘, `aria-invalid`.
- 라벨 위 `caption` `text.secondary`, 간격 6. 도움말 아래 6. 필드 사이 16.
- **Search**(`component.search`, 기존 technical-stock-finder): 높이 48, 배경 `sunken-strong`, 테두리 없음, radius 12, 왼쪽 search 아이콘 20, 오른쪽 X(입력 있을 때). 결과 패널: 폭 480(모바일 100%), 최대 높이 420, radius 16, `shadow.lg`, 행 52(compact stock-row), 헤더 sticky "종목 12건 · ↑↓ 이동", 빈 결과 "‘{검색어}’ 종목이 없어요", hover/활성 `row-hover`. 키보드 ↑↓ Enter Esc.
- **Amount**(금액 입력): 숫자 `price-lg` 28/800 우측 정렬, 단위 "원" `body-2`, 밑줄 없음, 프리셋 칩(+1만 · +10만 · +100만 · 최대) `sm` outline 필, 잔고 "주문 가능 1,284,500원" `caption`. `inputmode="numeric"`, 천 단위 쉼표 자동.

## 3. Checkbox · Radio · Switch
base 와 같은 규격(체크 20, radius 4, 테두리 `input-strict`; 라디오 full; 스위치 36×22 손잡이 16, 기존 overlay toggle). 스위치는 즉시 반영 설정(지표 오버레이 켜기)에, 체크박스는 제출로 반영되는 선택(스크리너 조건)에.

## 4. Card (기존 `.card` `.card-flat` `.card-tap`)
| 항목 | 값 |
|---|---|
| 배경/테두리/그림자 | `surface.default` / `border.default` 1px / `shadow.sm` |
| radius | **2xl 20** (기본) · xl 16 (표·리스트 컨테이너, `radius-dense`) |
| 패딩 | sm 16 · **md 20** · lg 24. 표·리스트 카드는 0 |
| 제목 | `title-3` 18/600, 우측 액션 `sm` ghost 또는 "전체 보기 →" link |
| 제목↔본문 | 12 |
| flat | 그림자·테두리 없이 `surface.sunken` 배경(`.card-flat`) — 카드 안 구획·안내 상자 |
| tap | `cursor: pointer`, hover `shadow.md` + `translateY(-2px)`(`.card-tap`). 클릭 가능한 카드만 |

카드 안 카드 금지. 구획은 flat 또는 `border.subtle` 구분선.

## 5. Stock row (`component.stock-row`, 기존 `.movers-row`)
종목 리스트의 기본 단위. 검색 결과·관심종목·순위·보유 종목 전부 이 규격.

```
데스크톱 68:  [순위 56 | 로고 32 + 종목명 title-4 + [KOSPI] / 코드·업종 micro | 지표 numeric | 가격 price-sm | 등락 change]
컴팩트 52:    [로고 | 종목명 · 코드 | 가격 · 등락]   (검색 결과·관심종목)
모바일 78:    grid "rank identity price / rank metric change", 순위 32, 좌우 16
```
- 종목명 1줄 말줄임, 시장 태그(`component.market-tag`: 18 높이, full, `brand-subtle` + `text.brand`, badge 12/700) 이름 뒤 4px.
- 가격 `text.primary`, 등락만 `finance.<d>.text`. 우측 정렬, nowrap.
- hover `row-hover`(blue.50), 선택 `selected-bg`, 구분선 `border.default`, 마지막 행 없음.
- 행 전체가 링크(종목 상세). 행 안 관심 ★ 버튼은 `stopPropagation`, 44 터치 확보.
- 로딩: 같은 높이 스켈레톤 5행. 빈: 07 §2.

## 6. Price cell (`component.price-cell`)
가격과 등락을 세로로 쌓은 셀.
```
72,400          ← price-sm, text.primary
+1.68%          ← change, finance.up.text   (등락폭까지 보이면 "+1,200 (+1.68%)")
```
- gap 2, 우측 정렬, nowrap. 화살표는 배지형에서만(`▲ 1.68%` `finance.up.bg` + `on-bg`).
- 실시간 갱신 시 `data-tick="up|down"` 으로 배경 플래시(05 §3).
- 보합: `0.00%` `finance.flat.text`, 부호·화살표 없음.
- 지연·마감 시세: `opacity.stale` + 툴팁 "15:30 종가".

## 7. Badge · Market tag · Chip (기존 `.badge-*`)
| 종류 | 규격 | 기존 |
|---|---|---|
| 상태 배지(옅은) | 24 높이, 좌우 10, full, badge 12/700, `status.<s>.bg` + `text` | `.badge-blue/green/amber/gray` |
| 등락 배지 | `finance.<d>.bg` + `on-bg`, 화살표 12 앞 | `.badge-up/.badge-down` |
| 채움 배지 | `status.<s>.solid` + `on-solid` | |
| 시장 태그 | 18 높이, 좌우 6, `brand-subtle` + `text.brand` | `movers-identity em` |
| 필터 칩 | 36 높이, 좌우 12, full, label-sm, outline; 선택 시 `selected-bg` + `selected-border` + `selected-text`, X 16 | |
| 신호 배지 | "골든크로스" 같은 신호: `status.info` 옅은형 + 아이콘 12. 매수/매도 권유처럼 읽히는 문구 금지(07 §7) | |

한 화면에서 옅은형/채움형 중 하나만.

## 8. Segmented (`component.segmented`, 기존 `.segmented` / `technical-chart-ranges` / `movers-metric-tabs` 통합)
- 트랙 `sunken-strong`, radius 12, 패딩 4, 항목 gap 4.
- 항목 높이 36 (터치 위주 44), 최소 폭 56, 좌우 10, radius 8, label-sm 13/600, `text.secondary`.
- 활성: `surface.default` + `text.brand` + `shadow.xs`. 이동 `fast` `out`.
- 항목 2~6개. 넘치면 가로 스크롤(`--scroll`, 스크롤바 숨김, 오른쪽 `fade-right`). 모바일 전폭(`--block`, 항목 flex 1).
- 기간(1D 1W 1M 3M 1Y), 지표(등락률·거래대금·시총), 시장(전체·KOSPI·KOSDAQ)에 쓴다. `role="tablist"`.

## 9. Tabs · Tab bar
- 밑줄 탭: 높이 44, 항목 간격 20, label-md, 비활성 `text.secondary` → 활성 `text.primary`, 인디케이터 3px `border.brand`. URL 연동. 5개 이하.
- **하단 탭바**(`component.tabbar`, 기존 `.tabbar` `.tab` `.tab-ico`): 높이 56 + safe-area, `surface.default` 90% + `blur.md`, 위 `border.default`, 항목 5개(홈·시장·섹터·자산·더보기), 아이콘 24 + 라벨 11/500 gap 2, 활성 `text.brand`(아이콘 채움), 비활성 `text.tertiary`. 알림 도트 8 `finance.up.solid` 아이콘 우상단. `z-index.sticky`.

## 10. Bottom sheet · Modal (`component.sheet` / `modal`)
모바일은 시트, 768 이상은 모달. 같은 콘텐츠 컴포넌트를 두 껍데기에 넣는다.

| 항목 | 시트 | 모달 |
|---|---|---|
| 배경/radius/그림자 | `raised` / 상단 20 / `shadow.lg` | `raised` / 20 / `shadow.xl` |
| 손잡이 | 36×4 `gray.300`, 상단 중앙, 위 8 | 없음 |
| 패딩 | 20 | 24 |
| 폭 | 100% | sm 400 · md 520 · lg 760 |
| 최대 높이 | 90vh, 본문 스크롤 | calc(100vh − 96) |
| 제목 | title-2 20/700, 우상단 닫기 X(ghost sm) | 같음 |
| 푸터 | 하단 고정 lg 전폭 버튼(두 개면 세로) | 우측 정렬 md, gap 8 |
| 더보기 메뉴 시트 | 항목 52 높이, 아이콘 20 + label-md, 파괴 항목 `text.danger` | |
| z-index | `sheet` 1250 | `modal` 1300 |

- 스크림 `surface.overlay`, 포커스 트랩, Esc, 배경 스크롤 잠금.
- 시트는 아래로 드래그해 닫기. 폼이 더러워졌으면 확인.
- **위험 확인(매도·전량 청산·모의투자 초기화·탈퇴)**: 제목 질문형 + 결과 한 문장 + 버튼에 동작 이름("전량 매도") + `danger`. 큰 금액은 금액을 제목에 넣는다: "1,284,500원어치 매도할까요?".

## 11. Dropdown · Menu · Tooltip · Chart tooltip
- 드롭다운: `raised`, `border.default`, radius 12, `shadow.md`, 패딩 4, 항목 36, 좌우 10, radius 8, body-2, hover `hover-overlay`, 선택 `selected-bg` + check. 최소 160, 최대 높이 320.
- 툴팁: `inverse`, body-3, 6/8, radius 6, 최대 240. 아이콘 버튼 필수. 지표 용어(PER·RSI) 옆 ⓘ 에 한 줄 설명.
- **차트 툴팁**(`component.chart-tooltip`, 기존 chartTooltipStyle): `tooltip-bg`(흰 96%), `border.default`, radius 12, `shadow.md`, 패딩 8/10, 최소 160, body-3. 첫 줄 날짜 `caption` `text.tertiary`, 이후 "색칩 8 · 시리즈명 · 값(numeric 우측)". 등락은 방향색. recharts 는 DOM 이라 CSS 변수 사용 가능.

## 12. Table (`component.table`, 기존 `.table-scroll`)
| 항목 | 값 |
|---|---|
| 헤더 | `sunken`, 44 높이, micro 12/500 `text.tertiary`, sticky top |
| 행 높이 | compact 40 · **default 48** · relaxed 68(로고·2줄) |
| 셀 | 좌우 12, 첫·마지막 20, body-2. 숫자 열 `numeric` 우측 |
| 선 | 행 사이 `border.default`, 세로선 없음 |
| hover / 선택 | `row-hover` / `selected-bg` |
| 정렬 | 헤더 클릭, 아이콘 16, 정렬된 열만 `text.primary`. 기본 정렬은 등락률↓ 또는 시총↓ |
| 가로 스크롤 | 열 5개 이상: 컨테이너 스크롤 + **첫 열(종목명) sticky 160** + 오른쪽 `fade-right` |
| 모바일 | 열 4개 이상 → stock-row 카드 리스트로 전환 |
| 빈/로딩 | 07 / 스켈레톤 5행 |

스크리너·재무제표 표는 열 고정(체크 48·종목 160·등락 96·가격 110·거래량 120). 숫자 열 폭은 최대 자릿수 기준으로 고정해 정렬 시 흔들리지 않게.

## 13. KPI tile (`component.kpi`, 기존 technical-chart-summary)
```
[caption 라벨 text.secondary]       시가총액
[price-md 20/700]                   412조 5,000억      ← lg 화면·핵심 지표는 price-lg
[change 13/700 finance.<d>.text]    ▲ 1.2%  지난주 대비(micro tertiary)
[스파크라인 40 (선택)]
```
- 카드 패딩 20, 최소 높이 116, 4열(데스크톱)·2열(모바일), gap 16.
- 좋은 방향이 하락인 지표(오류율·부채비율)는 색을 뒤집지 않는다 — 금융 등락색은 항상 값의 방향이다. 대신 라벨에 "(낮을수록 좋음)".
- 값이 없으면 `—` + 툴팁 "집계 전". 0 은 "0".

## 14. Toast · Alert · Inline (기존 `.empty` 제외)
- 토스트: `inverse` 면, radius 16, `shadow.lg`, 패딩 16, 폭 360(모바일 전폭 − 40), 데스크톱 우하단·모바일 탭바 위 72. 3초 / 오류·액션 6초. `role="status"|"alert"`.
- 배너: `status.<s>.bg` + `border` + `text` + `icon` 20, radius 16, 패딩 16. 오류 배너는 **아이콘 + 제목 필수**(빨강=상승 충돌). 페이지에 1개.
- 인라인: 필드 아래 body-3 + 아이콘 12.
- 시장 상태 배너(장 마감·점검·지연): `status.neutral`, 상단 고정, 닫기 없음. "장 마감 · 15:30 종가 기준".

## 15. Progress · Spinner · Skeleton · Empty
- 스피너 16(버튼)/20/32, 2px, `action.primary.bg`. 300ms 후 표시.
- 프로그레스 4/8, 트랙 `sunken-strong`, 채움 `action.primary.bg`. 비중(포트폴리오 구성)은 `chart.series` 색.
- 스켈레톤(`.skeleton`, `.skeleton-rows`): `sunken-strong`, radius 8, 글자 0.75em, 종목 행 68 × 5. 실제 레이아웃과 같은 자리.
- 빈 상태(`.empty`): 07 §2.

## 16. Avatar · Stock logo
종목 로고 24/32/40, radius full, 폴백 `brand-subtle` + 종목명 첫 글자 `text.brand`. 로고 실패 시 자동 폴백. 사용자 아바타 동일.

## 17. Divider · Kbd · Code
base 06 §15 와 같다. 코드 배경 `sunken-strong`.

## 18. 여기 없는 컴포넌트를 만들 때
1. 높이 `size.control.*`(44 기본, 36 밀도, 52 CTA). 2. 가로 패딩 12/16/18. 3. radius: 컨트롤 12, 카드 20(밀도 16), 오버레이 20. 4. 색은 surface → text → border → action/finance/status 순으로, 원시 금지. 5. 글자는 `typography.*` 하나. 숫자는 `price-*`/`numeric`. 6. 상태 6종 전부. 7. 포커스·키보드·aria·44 터치. 8. 진입 `out`, 퇴장 `in`, 색 `fast`. 9. 이 문서와 `component.json` 에 등록.
