# 14 · 브랜드 자산 (stock-gosu)

## 1. 컨셉
파랑새. 가볍고 빠르게 시장을 살펴보는 눈. 색은 Toss Blue 계열(`blue.500` 몸통, `blue.300` 날개 하이라이트, `blue.900` 눈). 금색·로켓·상승 화살표 같은 "수익" 연상 모티프는 쓰지 않는다 — 정보·분석 서비스라는 정체성.

## 2. 파일
| 파일 | 용도 |
|---|---|
| `assets/brand/stock-gosu.svg` | 벡터 원본(1024 그리드, 단색 path). 색은 CSS `fill: currentColor` 로 입힌다 |
| `assets/brand/stock-gosu.png` | 컬러 래스터(1024). OG·앱 아이콘 원본. 회색 배경이 포함돼 있어 마스크가 필요하다 |
| `assets/brand/stock-gosu.ico` | 파비콘 |

**보완 필요**(이번에 만들지 않음): 투명 배경 컬러 SVG, 단색 mono, 가로 로크업(심볼 + 워드마크), 다크용 inverse, 파비콘 SVG. png 원본에 회색 배경이 박혀 있어 다크 화면에서 그대로 쓰면 회색 사각형이 보인다. 우선은 `border-radius: full` + `object-fit: cover` 로 원형 마스크.

## 3. 사용 규칙
| 항목 | 규칙 |
|---|---|
| 헤더 | 심볼 28 + 워드마크 "stock-gosu" Pretendard 700 `text.primary`, 간격 8. 모바일은 심볼만 |
| 최소 크기 | 심볼 20, 로크업 높이 24 |
| 여백 | 심볼 높이의 1/2 이상 |
| 색 | 밝은 면: 컬러 또는 `text.primary` 단색. 브랜드 면(`surface.brand`): white 단색. 다크: 컬러(배경 없이) 또는 `text.primary` |
| 금지 | 늘리기·회전·그라데이션 덧칠·다른 파랑으로 재색칠·배경 회색 사각형 노출 |
| 파비콘 | `stock-gosu.ico`. SVG 파비콘은 보완 항목 |
| OG 이미지 | 1200×630, `gradient.brand` 배경, 심볼 160 좌측, 제목 display-lg white, 하단 면책 문구 micro |
| 앱 아이콘 | `blue.500` 배경 + 흰 심볼, radius 22%(iOS 마스크는 OS 가 처리) |
| 빈 상태·온보딩 | 심볼 80, `brand-subtle` 배경 원 120 |

## 4. 워드마크
`stock-gosu` 소문자, Pretendard 700, 자간 -0.02em. 하이픈 유지. 한글 표기 "스톡고수" 는 문장 안에서만.

## 5. 브랜드 면 위 글자
`surface.brand`(blue.600) 위 white(4.66:1). `gradient.brand` 위 글자는 어두운 시작점(blue.700) 쪽에 두고, 밝은 끝(blue.300) 위에는 글자를 놓지 않는다.
