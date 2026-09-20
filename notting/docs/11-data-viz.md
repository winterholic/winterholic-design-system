# 11 · 데이터 시각화 (notting)

notting 에서 차트가 나오는 곳은 셋이다 — **이슈 대시보드**(상태 분포·주간 완료), **검색 평가**(full-text vs vector vs hybrid 점수), **왕복 통계**(등급별 개수). 문서 안 차트 블록은 초기 범위가 아니다(Mermaid 코드 블록으로 대신한다).

## 1. 색

| 토큰 | 언제 |
|---|---|
| `chart.categorical.1` 부터 `8` | 서로 다른 범주. **순서대로**. 3개 이하면 1·2·4(verdigris·periwinkle·marigold) |
| `chart.sequential.1` 부터 `8` | 크기 순서(히트맵·활동 잔디). 밝음 → 어두움 |
| `chart.diverging.negative / mid / positive` | 기준점 양쪽. 코럴 ← 회색 → verdigris |
| `chart.grid` / `axis` / `label` | 격자·축·라벨 |
| `action.primary.bg` | 단일 시리즈 |
| `workflow.<s>.solid` | **이슈 상태 분포**는 categorical 이 아니라 상태색을 그대로(상태 필과 같은 색이어야 읽힌다) |
| `fidelity.<f>.solid` | 왕복 등급 분포도 같은 원칙 |
| `ai.solid` | 검색 평가에서 AI/hybrid 시리즈 |

categorical 순서: 1 verdigris(teal.500) · 2 periwinkle.400 · 3 coral.400 · 4 marigold(amber.400) · 5 green.500 · 6 teal.800 · 7 periwinkle.700 · 8 neutral.500. 3·5 는 상태색과 겹치니 상태 의미가 있는 차트에서는 1·2·4·6·7·8 만.

다크는 같은 토큰이 밝은 단계로. 컴포넌트에서 분기하지 않는다.

## 2. 차트 고르기

| 묻는 것 | 차트 |
|---|---|
| 시간에 따른 변화(주간 완료·검색 품질 추이) | 선. 시리즈 4개 이하 |
| 범주 비교(상태별 이슈 수·등급별 블록 수) | 가로 막대(라벨 길 때) 또는 세로 막대. 0 에서 시작 |
| 전체 중 비율(상태 분포) | 누적 가로 막대 1개. 파이 금지 |
| 두 검색 방식 비교 | 그룹 막대(질문 세트 × 방식) 또는 산점도(lexical vs vector 점수) |
| 단일 수치(미해결 충돌·인덱싱 지연) | 스탯 타일 |
| 진행률(가져오기·인덱싱) | 프로그레스 바 |
| 활동(문서별 수정 빈도) | 잔디(sequential 히트맵) |

## 3. 규격

| 요소 | 값 |
|---|---|
| 축 라벨 | `caption` `chart.label` |
| 축선 | `chart.axis` 1px, y축 선 생략 가능 |
| 격자 | `chart.grid` 1px 가로만 |
| 선 두께 | 2px, 강조 3px, 배경 시리즈 1px `neutral.300` |
| 점 | 기본 숨김, hover 6px + 흰 테두리 2px |
| 막대 간격 / radius | 폭의 40% / 위 `radius.xs` 또는 없음 |
| 범례 | 위 오른쪽 또는 아래, `caption`, 색 칩 12 `radius.xs`. 시리즈 1개면 없음 |
| 툴팁 | 06 §9. 값 `numeric` |
| 여백 / 최소 높이 | 패딩 16 / 카드 안 240, 전폭 320 |

## 4. 스탯 타일 (KPI)

```
[라벨 caption text.secondary]                    "미해결 충돌"
[숫자 display-sm numeric text.primary] [증감 label-sm]
[비교 caption text.tertiary]                     "지난주 대비"
[스파크라인 40, 1.5px action.primary.bg, 채움 8%] (선택)
```
- 증감: 상승 `status.success.text` + `trending-up`, 하락 `status.danger.text` + `trending-down`. **좋은 방향이 하락인 지표(충돌 수·손실 블록 수·근거 부족 응답 비율)는 색 반대.**
- 왕복 요약 타일(06 §28)은 KPI 타일의 변형: 라벨 = 등급 이름 + 도트, 숫자 = 개수, 증감 없음.
- 타일 4개 한 줄(데스크톱) / 2 / 1. 간격 16.

## 5. 접근성

- 색 + 다른 신호: 선 끝 직접 라벨, 막대 순서와 라벨, 상태 아이콘.
- `<figcaption>` 또는 `aria-label` 한 문장 요약.
- 표 대안 제공(토글).
- 그려지는 애니메이션 `slow` 한 번, reduced-motion 없음.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| 상태 분포 파이 차트 | 누적 가로 막대, 상태색 그대로 |
| 상태 분포에 categorical 색 | `workflow.<s>.solid` |
| 이중 y축 | 차트 두 개 |
| 시리즈마다 랜덤 색 | categorical 순서 |
| hybrid 를 verdigris 로(브랜드=정답 암시) | AI/hybrid 는 `ai.solid`, baseline 은 neutral. 평가 차트는 중립이어야 한다 |
| 문서 안 차트 블록 | Mermaid 코드 블록(코드 블록 규격) |
