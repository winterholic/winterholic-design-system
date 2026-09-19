# 15 · 기존 FDS 점검 결과와 이관 안내

stock-gosu 에는 이미 "FDS(금융 디자인 시스템)" 가 있었다. 정본은 `front/src/styles/global.css` 의 `:root` 토큰 블록(약 60개 변수 + 레거시 별칭 30개), `front/docs/finance-design-system.html`(문서, 약 110KB), `front/src/lib/chartTheme.ts`(recharts 색). 이 셋을 읽고 winterholic-base 를 기준으로 무엇이 있고 무엇이 없었는지 점검한 결과다. 2026-09-19 기준.

## 1. 잘 돼 있던 것 (그대로 옮김)
- 4px 그리드, 375/768/1024 모바일 퍼스트, 터치 44, 가로 스크롤 금지 규칙.
- 한국 증시 등락 관례와 "색만으로 전달 금지" 원칙.
- 숫자·통화 표기 규칙(쉼표·원 붙여쓰기·tabular·U+2212).
- 보이스(해요체·능동형·단정 금지·용어 사전).
- 4상태(로딩·빈·오류·부분 실패) 설계 의무, 오류 문구 공식.
- 차트 시리즈 8색 고정 순서와 CVD 검증, 키별 색 고정(namedSeriesColors), 격자 gray.200 실측 근거.
- 컴포넌트 클래스 체계(btn·card·badge·segmented·tabbar·skeleton·empty).

## 2. 없거나 어긋나 있던 것 → 이번에 보완

| # | 발견 | 근거 | 보완 |
|---|---|---|---|
| 1 | **다크 모드 없음** | `global.css` 에 `prefers-color-scheme`·`data-theme` 0건 | 다크 시맨틱 전부 추가, 빌드가 라이트/다크 1:1 강제. 컴포넌트 무수정 |
| 2 | **캡션 글자색 AA 미달** | `--text-tertiary: gray-500 #8B95A1` 흰 배경 3.04:1 | `text.tertiary` = gray.600 (4.62). 별칭이 자동 적용 |
| 3 | **브랜드 글자·링크 AA 미달** | `--text-brand: blue-500` 3.71:1 | blue.700 (5.41) |
| 4 | **13px 등락률 AA 미달** | `--finance-up #F04452` 3.71, `--finance-down #3182F6` 3.71 을 12~14px 글자에 사용(`.up/.down`, `movers-change`) | `finance.<d>.text`(600, 4.66) 와 `solid`(500) 이원화. 큰 숫자·차트만 500 |
| 5 | 등락 배지 글자 미달 | `.badge-up`: red-50 위 #F04452 = 3.7 | `finance.<d>.on-bg`(700) |
| 6 | blue-600·red-600 이 AA 를 0.01 놓침 | #2272EB 4.49, #E42939 4.49 | #216FE8 4.66, #E0263A 4.66 (눈으로 구분 불가) |
| 7 | green/yellow 단계 이름이 밝기와 어긋남 | `--green-500 #15C39A` 는 실제 400 자리, `--yellow-500 #FFB200` 은 300 자리 | 램프 재배치 + 별칭으로 옛 이름 유지 |
| 8 | 노랑 글자 미달 | `--yellow-600 #F59B00` 2.19 를 `.badge-amber` 글자에 | `yellow.600 #936712` (5.01) |
| 9 | 초록 글자 미달 | `--green-600 #03B488` 2.66 을 `.badge-green` 글자에 | `green.600 #088467` (4.66), 배너 글자 700 |
| 10 | **차트 색 이중 관리** | `chartTheme.ts` 에 hex 를 다시 적음(주석으로 CSS 변수 이름만 표기). 값이 갈릴 수 있고 다크 대응 불가 | `dist/chart-theme.ts` 를 토큰에서 생성. 라이트·다크 두 벌 + `currentChartTheme()` |
| 11 | 컨테이너 최대폭 불일치 | 문서 1080 vs 코드 1180 | 1180 |
| 12 | 간격 이름이 px | `--space-16` | 4px 배수 이름(`space.4`) + 별칭. 스케일에 없는 값(13·27) 방지 |
| 13 | 세그먼트 3종 중복 | `.segmented`, `.technical-chart-ranges`, `.movers-metric-tabs` 가 각각 값 다름(36/44/40 높이) | `component.segmented` 하나 + touch 변형 |
| 14 | 종목 행 규격 산재 | `movers-row` 68/78, 검색 결과 52 가 각자 정의 | `component.stock-row` (68/52/78) |
| 15 | 굵기 700/800 혼용 | `.value-lg 800`, `.btn 600`, `strong 700`, `em 800` | 5단계 정의: 800 은 display·price-lg 전용 |
| 16 | 인풋 15px 모바일 확대 | iOS Safari 16 미만 확대 | `input.font-size-mobile` 16 |
| 17 | 시간 표기 12시간제 | 문서 "오후 3:24" | 24시간제 `15:24`(장중 비교) |
| 18 | 미국식 등락 반전 방법 없음 | 문서에 "설정 제공" 만 | `[data-market=us]` 스코프, 토큰 이름 불변 |
| 19 | 실시간 틱 표현 규칙 없음 | | `finance.flash-*`, `motion.duration.flash`, 05 §3 |
| 20 | 낡은 데이터(지연·마감) 표현 없음 | | `opacity.stale`, 상태 배너, 07 표 |
| 21 | 히트맵·MA·캔들 색 없음 | 차트마다 즉석 hex | `chart.heat/overlay/candle/sparkline` |
| 22 | z-index 즉석 값 | `z-index: 20` 등 | `z-index.*` 스케일 |
| 23 | 접근성 검사 없음 | | 빌드가 106쌍 대비 검사, 08 체크리스트 |
| 24 | 단일 소스 없음 | CSS 변수가 곧 소스, JS·Tailwind·Figma 로 못 나감 | DTCG `tokens/src` → 7종 산출 |
| 25 | 문서가 HTML 한 덩어리 | 검색·diff 어려움 | md 16편 + 결정 가이드 |
| 26 | 로고 자산 정리 안 됨 | png 에 회색 배경, 단색·로크업 없음 | 14 에 파일 지도와 보완 목록(제작은 미완) |
| 27 | **등락색을 상태색으로 오용** | `FocusRefreshProgress.tsx`: 오류 문구에 `className="down"`, 작업 완료/실패 배지에 `tone="up"/"down"` | 상태는 `status.success/danger`(07 §7). 등락색은 값의 방향에만. 이관 2단계에서 함께 치환 |

### 유지한 것 (고치지 않은 이유)
- `action.primary` = blue.500 + 흰 글자(3.71). 브랜드 인상 유지. `primary-strict` 를 추가해 선택지를 줬다.
- 캔버스 gray.100. 흰 카드가 떠 보이는 구조가 제품 정체성. 대신 "캔버스 위 글자는 primary/secondary 만" 규칙.
- 버튼 좌우 패딩 18(4 그리드 밖). 44 높이와의 비례가 좋아 유지.

## 3. 이관 안내 (front 에 적용하는 순서)

### 0단계 — 로드만 (기존 화면 무변경, 다크 획득)
```html
<link rel="stylesheet" href="/vendor/stock-gosu/tokens.css" />
<link rel="stylesheet" href="/vendor/stock-gosu/typography.css" />
<link rel="stylesheet" href="/vendor/stock-gosu/legacy-aliases.css" />   <!-- global.css 의 :root 블록보다 뒤에 -->
```
`global.css` 의 `:root { … }` 토큰 블록을 지우거나 별칭 파일이 뒤에 오게 한다. 이 순간부터 `--blue-500` 등이 `--sg-*` 를 가리키고, 다크가 켜지며, `--text-tertiary`·`--text-brand` 가 AA 값으로 바뀐다.

확인: `data-theme="dark"` 강제 후 캔버스·카드·글자가 바뀌는지. 원시 별칭(`--gray-100`)을 배경으로 쓴 곳은 밝게 남는다 → 1단계 대상.

### 1단계 — 차트
`src/lib/chartTheme.ts` 를 `dist/chart-theme.ts` 로 교체. `chartColors.up` → `t.finance.up.solid`, `seriesColors[i]` → `seriesColor(i, t)`, `axisProps` → `axisProps(t)`. `t = currentChartTheme()` 는 테마 변경 시 다시 계산.

### 2단계 — 등락 글자
`.up/.down/.flat` 이 붙은 13~15px 글자를 `.sg-up/.sg-down/.sg-flat`(600) 로. 큰 숫자(`technical-chart-price` 22px 800 등)는 `finance.<d>.solid` 유지. 배지는 `on-bg`.

### 3단계 — 원시 별칭 제거
`grep -rn "var(--blue-\|var(--gray-\|var(--red-\|var(--green-\|var(--yellow-" src` 를 시맨틱으로 치환. 대응표:

| 기존 | 새 토큰 |
|---|---|
| `--bg-page` / `--gray-100` 배경 | `--sg-color-surface-canvas` / `surface-sunken-strong` |
| `--bg-elevated` `--white` 배경 | `--sg-color-surface-default` (오버레이는 `raised`) |
| `--bg-subtle` `--gray-50` | `--sg-color-surface-sunken` |
| `--blue-50` 배경(선택·hover) | `--sg-color-interactive-selected-bg` / `row-hover` |
| `--blue-50` + `--blue-700` (시장 태그) | `component-market-tag-bg/text` |
| `--blue-500` 배경(버튼) | `--sg-color-action-primary-bg` |
| `--blue-600` 글자(세그먼트 활성) | `--sg-component-segmented-active-text` |
| `--gray-300` 토글 트랙 | `--sg-component-switch-track-off` |
| `--border` / `--border-strong` | `--sg-color-border-default` / `strong` |
| `--text-*` | `--sg-color-text-*` (이름 동일) |
| `--finance-up` 13px 글자 | `--sg-color-finance-up-text` |
| `--finance-up` 22px 이상·차트·화살표 | `--sg-color-finance-up-solid` |
| `--up-bg` + `--finance-up` 배지 | `finance-up-bg` + `finance-up-on-bg` |
| `--space-16` | `--sg-space-4` (표: 2→0-5, 4→1, 6→1-5, 8→2, 10→2-5, 12→3, 14→3-5, 16→4, 20→5, 24→6, 28→7, 32→8, 40→10, 48→12, 64→16) |
| `--radius-12/16/20` | `--sg-radius-lg/xl/2xl` |
| `--shadow-1/2/3/4` | `--sg-shadow-sm/md/lg/xl` |
| `--dur-fast/base/slow`, `--ease-out/in-out` | `--sg-motion-duration-fast/normal/slow`, `--sg-motion-easing-out/in-out` |
| `font-size: 13px/15px/…` 리터럴 | `.sg-body-3/.sg-body-2/…` 클래스 또는 `--sg-font-size-sm/md` |
| `z-index: 20` | `--sg-z-index-sticky-panel` |

### 4단계 — 컴포넌트 규격 맞추기
세그먼트 3종 → `component.segmented`(36, touch 44). 종목 행 → `component.stock-row`. 인풋 모바일 16px. 표 헤더 micro.

### 5단계 — 별칭 제거
`legacy-aliases.css` 삭제 후 빌드·화면 확인. 13 §5 체크리스트 통과.

## 4. 점검 방법 (재현)
```bash
# 기존 토큰 블록
sed -n 1,80p C:/stock-gosu/front/src/styles/global.css
# 다크 유무
grep -n "prefers-color-scheme\|data-theme" C:/stock-gosu/front/src/styles/global.css   # 0건
# 차트 hex 이중 관리
grep -c "#[0-9A-Fa-f]\{6\}" C:/stock-gosu/front/src/lib/chartTheme.ts                  # 17건
# 대비 (이 저장소)
node -e "import('./winterholic-base/tokens/scripts/ramp.mjs').then(m=>console.log(m.contrast('#8B95A1','#FFFFFF')))"  # 3.04
```
