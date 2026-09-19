# 11 · 데이터 시각화 (stock-gosu)

stock-gosu 의 본체다. recharts 기준으로 적었고, SVG 색은 `dist/chart-theme.ts` 의 raw 값을, DOM(툴팁·범례)은 CSS 변수를 쓴다.

## 1. 색

| 토큰 | 언제 |
|---|---|
| `chart.series.1~8` | 서로 다른 종목·투자자·산식 비교. **고정 순서, 순환 금지.** 9번째부터 `series.other`(회색) 로 접거나 차트를 나눈다 |
| `chart.overlay.ma5/20/60/120` | 이동평균. 짧을수록 밝고(노랑) 길수록 진하게(회색). `bollinger` + `bollinger-fill` |
| `chart.candle.up/down` + `*-wick`, `volume-up/down` | 캔들·거래량. 등락색과 같은 값 |
| `chart.sparkline.up/down/flat` + `gradient.sparkline-*` | 리스트·KPI 안 미니 차트. 기간 시작 대비 방향으로 색 |
| `chart.heat.up-3 … down-3` | 등락률 히트맵·트리맵 5단계 |
| `chart.grid` `axis` `label` `reference` `crosshair` | 격자·축·라벨·기준선·십자선 |
| `finance.up/down.solid` | 단일 종목 선 차트의 선 색(기간 시작 대비 방향) |
| `action.primary.bg` | 방향이 없는 단일 시리즈(거래대금 추이·지수) |

### 시리즈 색과 이름 고정 (기존 namedSeriesColors 유지)
| 키 | 색 |
|---|---|
| 동일가중 `equal` | series.7 (violet) |
| 가치가중 `value` | series.4 (yellow) |
| 혼합 `blend` | series.3 (aqua) |
| echo(주력) | series.1 (blue) |
| 외국인 `foreign` | series.1 |
| 기관 `institution` | series.3 |
| 개인 `individual` | series.2 (orange) |

같은 키가 화면마다 다른 색이면 사용자가 매번 범례를 다시 읽는다. 새 키는 여기 표와 `chart-theme.ts` 소비 코드에 함께 등록.

### 등락색을 시리즈 색으로 쓰지 않는다
빨강(series.8)·파랑(series.1)은 상승·하락으로 읽힌다. 방향 의미가 있는 차트(누적 수익률·수급)에서는 series.8 을 피하고 6개까지만 쓴다. 단일 종목 가격선은 방향색(`finance.<d>.solid`)이 맞다.

## 2. 차트 고르기
| 묻는 것 | 차트 | 규격 |
|---|---|---|
| 가격 흐름(1D~1Y) | 선 + 영역 채움(sparkline gradient) | 선 2px, 채움 alpha 12~20%, 기간 시작 기준선 `reference` 점선 |
| 캔들 분석(기술 차트) | 캔들 + 거래량 + MA 오버레이 | 캔들 최소 폭 4, 간격 폭의 30%, 거래량 별도 패널 94 |
| 여러 종목·산식 비교 | 정규화(시작=100) 선, 4개 이하 | 5개 넘으면 소형 다중 |
| 수급(외국인·기관·개인) | 누적 막대 또는 선 3개 | 0 기준선 `reference` |
| 섹터·시장 지도 | 트리맵(heat) | 셀 안 종목명 + 등락률 |
| 등락 분포 | 히스토그램 | 0 에서 좌우 색 분리 |
| 포트폴리오 비중 | 가로 누적 막대 1개 또는 도넛(6개 이하) | 파이 금지 |
| 단일 수치 | KPI 타일 + 스파크라인 40 | 06 §13 |
| 상관·상대강도 | 산점도·랭킹 막대 | |

## 3. 규격
| 요소 | 값 |
|---|---|
| 축 라벨 | 11px(`axisProps.tick.fontSize`), `chart.axis`. y축 선 없음, x축 선 없음(`axisLine: false`) |
| 격자 | `chart.grid` 1px, 가로만, `strokeDasharray: 2 5`. gray.100 은 안 보여서 gray.200 |
| 선 | 2px. 강조 3px, 비교(배경) 1px `gray.300` |
| 점 | 숨김, hover 시 5px + 흰 테두리 2px |
| 막대 | 간격 폭의 40%, radius 위 4 |
| 캔들 | 몸통 `candle.up/down` 채움, 꼬리 `*-wick` 1px |
| 이동평균 | 1.5px, `overlay.ma*` |
| 기준선 | `chart.reference` 1px 점선 (0, 매수 평단, 기간 시작) |
| 십자선 | `chart.crosshair` 1px, 기술 차트만 |
| 범례 | 차트 위 우측, `micro`, 칩 10×10 radius 2, 시리즈 1개면 없음. hover 로 다른 시리즈 `opacity.chart-inactive-series` |
| 툴팁 | 06 §11. 날짜 + 시리즈별 값. 등락은 방향색 + 부호 |
| 여백 | `chartMargin` {top 8, right 8, left 0, bottom 0}. y축 폭은 YAxis width |
| 높이 | 스파크라인 40 · 카드 240 · 종목 상세 360 · 기술 차트 480(모바일 360) · 거래량 94(82) |
| 애니메이션 | 첫 렌더 300ms, 갱신 없음 |

```tsx
import { currentChartTheme, axisProps, gridProps, chartMargin, chartAnimationDuration } from 'winterholic-design-system/stock-gosu/dist/chart-theme';
const t = currentChartTheme();
<LineChart margin={chartMargin}>
  <CartesianGrid {...gridProps(t)} />
  <XAxis {...axisProps(t)} dataKey="date" />
  <YAxis {...axisProps(t)} width={48} tickFormatter={fmtWon} />
  <ReferenceLine y={base} stroke={t.reference} strokeDasharray="4 4" />
  <Line dataKey="close" stroke={up ? t.finance.up.solid : t.finance.down.solid} strokeWidth={2} dot={false} animationDuration={chartAnimationDuration} />
</LineChart>
```

## 4. 금융 차트 규칙
1. **y축 0 시작 금지가 원칙인 차트**: 가격선은 범위에 맞춘다(0 부터 그리면 변동이 안 보인다). 대신 y축 눈금·기간 시작 기준선으로 배율을 알린다. 막대(거래량·수급)는 0 시작.
2. 기간 전환(1D→1Y) 시 y 도메인이 튀는 애니메이션 금지.
3. 가격선 색 = 기간 시작 대비 방향. 1D 는 전일 종가 기준선 위/아래.
4. 툴팁 없이 읽히게: 마지막 값은 선 끝에 직접 라벨(현재가). 
5. 로그 스케일은 장기(3Y 이상) 비교에서만, 축에 "로그" 표기.
6. 데이터 공백(휴장·수집 실패)은 선을 끊는다(`connectNulls={false}`). 이어 그리면 거짓 추세.
7. 지연·집계 전은 차트 위 `micro` "15:30 기준".

## 5. 접근성
- `<figure aria-label="삼성전자 1개월 주가, 5.2% 상승">` + 숨긴 표.
- 시리즈는 색 + 범례 + 선 끝 라벨. 캔들은 툴팁에 시·고·저·종.
- 히트맵 셀에 숫자.
- reduced-motion 이면 `animationDuration 0`.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 파이 차트 | 가로 누적 막대·도넛 6개 이하 |
| 시리즈 9개 이상 색 순환 | 6~8개 + '기타', 또는 차트 분할 |
| 수익률 비교에 series.8(빨강) | 6개까지 |
| 가격선 0 부터 | 범위 맞춤 + 기준선 |
| 휴장일 선 연결 | 끊기 |
| 이중 y축 | 차트 두 개, 또는 정규화 |
| 차트 hex 하드코딩 | `chart-theme.ts` |
| 격자 세로+가로 | 가로 4~5줄 |
| 툴팁에 "chg%" | "등락률 +1.68%" |
