# 04 · 모양·깊이 (stock-gosu) — radius · 테두리 · 그림자 · 그라데이션 · 불투명도 · 블러

금융 앱은 base 보다 한 단계 더 둥글고 그림자는 더 옅다. "둥근 모서리는 안전한 인상, 약한 그림자는 정보 레이어"(기존 FDS).

## 1. radius
| 토큰 | px | 언제 |
|---|---|---|
| `none` | 0 | 표 셀, 전폭 배너, 화면 끝에 붙은 이미지, 드로어 |
| `xs` | 4 | 체크박스, 인라인 코드, 각진 분류 태그, 스켈레톤 글자, 막대 차트 상단 |
| `sm` | 6 | 세그먼트 활성 항목, 툴팁, kbd |
| `md` | 8 | sm·xs 버튼, 칩(각진), 드롭다운 항목 hover, 카드 안 작은 상자, 세그먼트 항목 |
| `lg` | 12 | **버튼(md)·인풋·드롭다운 상자·차트 툴팁·검색창·세그먼트 트랙**. 기존 radius-12 |
| `xl` | 16 | 밀도 높은 카드(표·리스트 컨테이너), 검색 결과 패널, lg 버튼, 토스트, 배너 |
| `2xl` | 20 | **카드 기본·모달·바텀시트**. 기존 .card |
| `3xl` | 24 | 온보딩 히어로 카드 |
| `full` | | 배지·시장 태그·아바타·토글·필 칩·상태 도트·프로그레스 |

### 규칙
- 큰 면일수록 큰 radius. 44 버튼 12, 카드 20, 시트 20. 작은 것에 큰 radius 를 주면 캡슐이 되고, 큰 것에 작은 radius 를 주면 뾰족하다.
- **부모 radius − 안쪽 패딩 = 자식 radius**(음수면 4). 카드 20 안 패딩 20 이면 안쪽 이미지·차트 상자는 4~8. 안쪽이 부모보다 둥글면 모서리가 뜬다.
- 표·리스트를 감싸는 카드는 `xl` 16. 행이 빽빽한 곳에 20 은 과하다.
- 필(full)은 필터 칩·"관심 추가" 같은 칩형 버튼에만. 폼 버튼은 12. 한 화면에 필 버튼과 12 버튼이 섞이면 안 된다.
- 세그먼트: 트랙 12, 항목 8(트랙 − 패딩 4).
- 바텀시트는 상단 두 모서리만 20.

## 2. 테두리
| 토큰 | px | 언제 |
|---|---|---|
| `hairline` | 1 | 카드·표·인풋·배너 기본 |
| `medium` | 1.5 | 아웃라인 버튼(기존 btn-outline) |
| `focus` | 2 | 포커스 링, 선택 표시 |
| `accent` | 3 | 탭 인디케이터, 신호 카드·알림 카드 왼쪽 등락 띠 |

색은 01 §5 border. 테두리와 그림자는 **주 신호 하나만**:
- 밀도 높은 화면(표·순위·대시보드) → 테두리 `border.default`, 그림자 없음.
- 카드 갤러리·홈 요약 → `shadow.sm` + `border.default` 둘 다(기존 .card). 다크에서는 테두리가 주 신호.
- 인풋은 테두리 `border.strong`, 검색은 테두리 없이 채움면.
- 등락 띠: 알림·신호 카드 왼쪽 3px `finance.<d>.solid`. 카드 전체를 칠하지 않는다.
- 헤더·탭바 경계는 `border.subtle`/`border.default` 1px + 스크롤 시 `shadow.sticky`.

## 3. 그림자 (elevation)
그림자 색은 `#001B37`(남색) 계열로 차가운 톤을 지킨다. 검은 그림자는 탁하다. 단계는 "얼마나 떠 있나"로 고른다.

| 토큰 | 기존 이름 | 값 | 언제 | 뜬 높이 감각 |
|---|---|---|---|---|
| `xs` | | 0 1 2 · 4% | 세그먼트 활성 항목, 토글 손잡이 | 1px |
| `sm` | shadow-1 | 0 1 3 · 6% + 0 1 2 · 4% | **카드 기본**(정지) | 2px |
| `md` | shadow-2 | 0 4 16 · 8% | 카드 hover(card-tap), 드롭다운, 차트 툴팁, 팝오버 | 8px |
| `lg` | shadow-3 | 0 8 28 · 12% | 토스트, 바텀시트, 검색 결과 패널, 드래그 중 | 16px |
| `xl` | shadow-4 | 0 16 48 · 16% | 모달, 드로어 | 32px |
| `inner` | | inset 0 2 4 · 8% | 눌린 세그먼트, sunken 인풋 | 안으로 |
| `sticky` | | 0 2 8 · 6% | 스크롤 시 sticky 헤더·하단 탭바·고정 CTA 바 | 경계 강조 |

### 규칙
- 그림자는 "떠 있다"는 뜻. 떠 있지 않은 것(섹션 배경·표·정지 헤더)에 주지 않는다.
- 한 화면에 그림자 단계 두 개까지(카드 sm + 모달 xl).
- hover 는 `sm → md` 한 단계 + `translateY(-2px)`. 클릭할 수 없는 카드는 hover 로 그림자를 바꾸지 않는다.
- 다크에서는 `shadow-dark.*` 로 자동 교체(검정 20~60%). 그래도 테두리를 함께 둔다.

```css
.card { box-shadow: var(--sg-shadow-sm); border: 1px solid var(--sg-color-border-default); transition: box-shadow var(--sg-motion-duration-fast) var(--sg-motion-easing-out), transform var(--sg-motion-duration-fast) var(--sg-motion-easing-out); }
.card.tap:hover { box-shadow: var(--sg-shadow-md); transform: translateY(var(--sg-component-card-hover-lift)); }
.header.is-scrolled { box-shadow: var(--sg-shadow-sticky); }
```

## 4. 그라데이션
금융 화면은 그라데이션을 거의 쓰지 않는다. 다섯 곳뿐. 각도는 브랜드 135 / 세로 180 / 가로 90 세 가지로 고정.

| 토큰 | 색 | 각도 | 언제 | 위 글자 |
|---|---|---|---|---|
| `brand` | blue.700 → 500 → 300 | 135 | 온보딩 헤더, 프로모션 카드, 앱 스토어·OG 이미지 | white, 어두운 시작점 쪽에 |
| `sky` | blue.50 → white | 180 | 홈 상단 요약 카드 배경(거의 안 보임) | 그대로 |
| `sparkline-up` / `sparkline-down` | 500 @20% → 0 | 180 | 스파크라인·영역 차트 채움 | |
| `scrim-bottom` | 투명 → 950 @70% | 180 | 뉴스 썸네일 위 제목 | white |
| `fade-right` | 투명 → white | 90 | 가로 스크롤 칩·탭·표 오른쪽 끝 "더 있음" | |

```css
.onboarding-head { background: var(--sg-gradient-brand); color: var(--sg-color-text-on-brand); }
.chips-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 32px; background: var(--sg-gradient-fade-right); pointer-events: none; }
```
- 버튼·배지·KPI·표에 그라데이션 금지.
- `brand` 위 글자는 blue.300 끝(밝은 쪽)에 두지 않는다. 흰 글자 대비는 blue.700 시작점 기준.
- 다크: `sky`·`fade-right` 는 원시 참조라 밝게 남는다 → 다크에서는 `surface.default` 단색 또는 `linear-gradient(90deg, transparent, var(--sg-color-surface-default))` 로 직접 쓴다. `sparkline-*`·`scrim` 은 alpha 라 그대로.

## 5. 불투명도
| 토큰 | 값 | 언제 |
|---|---|---|
| `disabled` | 0.4 | 비활성 요소 전체(색 토큰 대신 걸어도 됨) |
| `hover` / `pressed` | 0.04 / 0.08 | overlay 층 alpha |
| `scrim` | 0.5 | 모달 뒤 |
| `skeleton` | 0.6 | 스켈레톤 최저점 |
| `stale` | 0.6 | 장 마감·지연 시세 등 **낡은 데이터**. 숫자 옆 "15:30 기준" 동반 |
| `chart-inactive-series` | 0.25 | 범례 hover 시 다른 시리즈 |

## 6. 블러
| 토큰 | 값 | 언제 |
|---|---|---|
| `sm` | 4 | 스크림 뒤 미세 |
| `md` | 12 | 글래스 상단 탐색·하단 탭바 `backdrop-filter`(배경 90~92%) |
| `lg` | 24 | 모달 뒤 배경(선택, 성능 비용) |

## 7. 이미지 모양
| 항목 | 규칙 |
|---|---|
| 종목 로고 | 원형, `border.subtle` 1px |
| 뉴스 썸네일 | 16:9, radius 8(카드 안) / 카드 상단 꽉 차면 카드 radius 상단만 |
| 리포트 표지 | 3:4, radius 12 |
| 차트 공유 이미지 | 1200×630, radius 0, 로고 우하단 |
| 아바타 | 원형 |

## 8. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 버튼 radius 20(캡슐) 앱 폼에 | `radius.lg` 12. 필은 칩·랜딩 CTA 만 |
| 표 카드 radius 20 | `xl` 16 |
| 카드 20 안 차트 상자 20 | 4~8(부모 − 패딩) |
| 정지 카드에 `shadow.lg` | `shadow.sm` |
| `box-shadow: 0 4px 16px rgba(0,27,55,.08)` 직접 | `var(--sg-shadow-md)` |
| 등락 카드 배경 전체 빨강 | 왼쪽 3px 띠 + 배지 |
| KPI 타일 그라데이션 | 단색 `surface.default` |
| 그라데이션 각도 화면마다 | 135/180/90 세 값 |
| 다크에서 `gradient.sky` 그대로 | `surface.default` |
| 표에 그림자 | 테두리 `border.default` |
