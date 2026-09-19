# 09 · 다크 모드 (stock-gosu)

기존 stock-gosu 에는 다크 모드가 없었다. 투자 앱은 장 마감 후·야간 사용이 많고, 차트 위주 화면은 어두운 배경에서 눈이 편하다. 이 시스템이 새로 추가한 가장 큰 항목이다.

## 1. 동작
`dist/tokens.css` 하나로: 시스템 설정 자동 / `<html data-theme="dark">` 강제 다크 / `data-theme="light"` 강제 라이트. `color-scheme: light dark` 로 스크롤바·네이티브 셀렉트도 따라온다. 깜빡임 방지 인라인 스크립트는 base 09 §1 과 같다.

`legacy-aliases.css` 를 로드하면 **기존 `--blue-500`·`--text-primary` 를 쓰는 화면도 다크가 된다**(별칭이 `--sg-*` 를 가리키므로). 단, 원시 별칭(`--gray-100` 등)을 배경으로 쓴 곳은 다크에서 밝게 남는다 → 시맨틱으로 바꿔야 한다(15 이관 표).

## 2. 컴포넌트가 할 일: 없음
시맨틱 토큰만 쓰면 자동. `dark:` 분기 금지. 예외는 아래 §4.

## 3. 매핑 원리
| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 면 | canvas gray.100 → default white → raised white+shadow | canvas #111418 → default #191F28 → raised #333D4B | 위로 올라올수록 밝게 |
| 주 버튼 | blue.500 + 흰 글자 | **blue.400 + gray.950 글자** | 흰 글자는 어떤 파랑에서도 AA 미달. 방향을 바꿨다 |
| 등락 글자 | red.600 / blue.600 | red.400 #FD7678 / blue.300 #64A8FF | 어두운 면에서 밝은 색이 읽힌다(6:1 이상) |
| 등락 큰 숫자·차트 | red.500 / blue.500 | red.400 / blue.300 | 텍스트와 같은 값으로 통일(다크에서는 구분이 필요 없다) |
| 등락 배지 | 50 배경 + 700 글자 | 950 배경 + 300/200 글자 | |
| 브랜드 글자·링크 | blue.700 | blue.300 | |
| 상태 배너 | 50 + 600/700 | 950 + 300/400 | |
| 차트 시리즈 | 원본 8색 | 밝은 8색(`chart.series` 다크 값) | 어두운 배경에서 남색·진초록이 죽는다 |
| 격자·축 | gray.200 / 500 | gray.800 / 500 | |
| 그림자 | 남색 5~15% | 검정 20~60% + 테두리 | |
| hover | 어둡게 4% | 밝게 6% | |

## 4. 다크에서 확인할 것
- **차트**: `dist/chart-theme.ts` 의 `currentChartTheme()` 로 다크 팔레트를 골라 recharts 에 넘긴다. 테마 변경 시 리렌더(`data-theme` MutationObserver 또는 상태). 라이트 hex 를 하드코딩한 차트는 다크에서 그대로 남는다 — 기존 `chartTheme.ts` 를 이 파일로 교체하는 것이 이관의 핵심.
- **캔들·거래량**: `chart.candle.*` 다크 값 사용. 거래량 alpha 50% 유지.
- **히트맵**: `chart.heat.*` 가 다크에서 950→400 으로 재배치. 셀 글자는 밝기에 따라 white/gray.950.
- **그라데이션** `sky`·`fade-right`: 원시 참조라 다크에서 밝게 남는다 → 다크에서는 `surface.default` 단색. `sparkline-*` 는 alpha 라 그대로 OK.
- **순백 면**: 종목 로고 배경·뉴스 썸네일 플레이스홀더가 `#fff` 면 눈부시다 → `surface.default`.
- **시장 태그**: `brand-subtle`(blue.950) + `text.brand`(blue.300) 로 자동.
- **툴팁**: `chart.tooltip-bg` 가 다크 값(#191F28 96%)으로.
- **스켈레톤**: `sunken-strong` 이 gray.950 이라 default(900) 위에서 보인다.

## 5. 검증
- 빌드가 다크 106쌍 중 절반을 검사(`contrast-report.json` mode=dark).
- `data-theme="dark"` 강제 후: ① 순백 면 ② 하드코딩 hex(`grep -rnE "#[0-9A-Fa-f]{6}" src --include=*.tsx`) ③ 차트 시리즈 색이 바뀌는지 ④ 등락 배지 글자 읽히는지.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `dark:bg-gray-800` | `bg-surface-default` |
| 다크에서 blue.500 버튼 + 흰 글자 | 토큰 그대로(blue.400 + 950) |
| chartTheme.ts 라이트 hex 유지 | `dist/chart-theme.ts` `currentChartTheme()` |
| 다크에서 `gradient.sky` | `surface.default` |
| `--gray-100` 을 배경으로 | `surface.sunken-strong` |
