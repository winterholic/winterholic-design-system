# 11 · 데이터 시각화 (memoir)

memoir 에 차트는 많지 않다. 마이페이지 활동·대시보드 통계·캘린더 히트맵 정도. 소박하게, 종이 위 연필처럼. 정보 밀도보다 한눈에 읽히는 것이 우선.

## 1. 색
| 토큰 | 라이트 | 언제 |
|---|---|---|
| `chart.categorical.1` | pink.400 | 첫 시리즈·강조 |
| `chart.categorical.2` | blue.400 | 둘째 |
| `chart.categorical.3` | amber.300 | 셋째 |
| `chart.categorical.4` | green.400 | 넷째 |
| `chart.categorical.5` | neutral.400 | 다섯째·기타 |
| `chart.heat.0…4` | paper-deep → pink.100 → 200 → 300 → 400 | 활동 히트맵 5단계(0 = 없음) |
| `chart.grid` / `axis` / `label` | neutral.200 / 500 / 700 | 격자·축·라벨 |
| `brand.periwinkle` | | 단일 시리즈 선(주간 작성 수). 파랑 = 클릭 아님이지만 차트 안에서는 허용 |
| `brand.rose` | | 링(완료율) 채움 |

카테고리 10개를 한 차트에 넣을 때는 `color.category.*`(50~200 단계라 옅다) 대신 categorical 5색 + 나머지 '기타'. 카테고리 색 원은 범례 아이콘으로만.

## 2. 차트 고르기
| 묻는 것 | 차트 | 규격 |
|---|---|---|
| 카테고리별 메모 수 | 가로 막대(라벨이 길다) | 막대 높이 20, 간격 8, radius 4 오른쪽만, 값 라벨 막대 끝 `caption`, 축 없음 |
| 주간·월간 작성 추이 | 선 1개 | 1.5px periwinkle, 점 없음(hover 4px), 격자 가로 3줄, 영역 채움 없음 |
| 활동 밀도 | 잔디(52주 × 7) 또는 캘린더 히트맵 | 셀 12 gap 3 radius 2, 색 heat.N, 툴팁 "9월 19일 · 메모 3개" |
| 할일 완료율·저장 용량 | 링 1개 | 지름 64/96, 굵기 8, 트랙 zone-deep, 채움 로즈, 가운데 `title` 숫자 + `caption` 라벨 |
| 카테고리 비율 | 가로 누적 막대 1개 | 높이 12 full, 세그먼트 categorical, 아래 범례 |
| 시간대별 작성 | 세로 막대 24개 | 폭 8 gap 4, radius 2 위 |
파이·도넛(여러 조각)·이중 축·3D 금지. 축·범례 최소, 숫자를 직접 적는다.

## 3. 규격
| 요소 | 값 |
|---|---|
| 축 라벨 | `caption` 12 `chart.label` |
| 축선 | 없음 |
| 격자 | `chart.grid` 1px 가로만, 최대 4줄 |
| 막대 | 간격 폭의 40%, radius 4 |
| 선 | 1.5px, 강조 2px |
| 범례 | 차트 아래 `caption`, 색 칩 10×10 radius 2, 시리즈 1개면 없음 |
| 툴팁 | ink 면 툴팁 규격(06 §15), 날짜 `caption` + 값 |
| 여백 | 벤토·카드 패딩만 |
| 높이 | 벤토 안 160, 마이페이지 240, 잔디 7×15 = 105 |
| 애니메이션 | 첫 렌더 `normal` 200 한 번, 갱신 없음 |
| 빈 | "아직 기록이 없어요" `body-sm` tertiary 가운데, 축 안 그림 |

```html
<figure aria-label="이번 주 작성 12개, 지난주보다 3개 많음">
  <svg viewBox="0 0 320 160"> … <path stroke="var(--mm-brand-periwinkle)" stroke-width="1.5" fill="none" /> … </svg>
  <figcaption class="mm-caption">이번 주 · 12개</figcaption>
  <table class="sr-only">…</table>
</figure>
```
인라인 SVG 는 CSS 변수를 그대로 쓸 수 있다(recharts 같은 라이브러리를 쓰면 `getComputedStyle` 로 값을 읽어 넘긴다).

## 4. 잔디(활동 히트맵) 규칙
- 값 구간: 0 / 1 / 2~3 / 4~6 / 7+ → heat.0~4. 구간은 사용자 평균 기준으로 조정 가능하되 5단계 유지.
- 오늘 셀 링 1px indigo. 미래 셀 `zone`.
- 월 라벨 위 `caption`, 요일 라벨 왼쪽 월·수·금만.
- 다크: heat 가 neutral.800 → pink.400 으로 자동.

## 5. 접근성
- 색 + 숫자 라벨(막대 끝·링 가운데·툴팁).
- `<figure aria-label>` 한 문장 + 시각적으로 숨긴 `<table>`.
- 잔디 셀 `<button aria-label="9월 19일, 메모 3개">` 또는 `title`.
- reduced-motion 이면 애니메이션 0.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 도넛 10조각 | 가로 누적 막대 + 기타 |
| 카테고리 색 원 색으로 시리즈 | categorical 5색 |
| 그라데이션 채움 | 단색 |
| 격자 세로+가로 | 가로 3~4줄 |
| 숫자 카운트업 | 즉시 |
| 차트 hex 리터럴 | `var(--mm-color-chart-*)` |
