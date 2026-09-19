# 10 · 아이콘·이미지 (stock-gosu)

## 1. 아이콘 라이브러리
**Lucide** 하나. 24 그리드, 2px 선. 기존 코드에 이모지·유니코드 화살표(▲▼)·`⋯` 문자가 섞여 있다 → 등락 화살표는 유지(글자와 정렬되고 스크린리더 대응이 쉽다), 나머지(더보기·닫기·검색·설정)는 Lucide 로 통일한다.

## 2. 크기
`xs` 12 (배지·등락 화살표·정렬 표시) · `sm` 16 (sm 컨트롤·메뉴·표 헤더) · `md` 20 (**기본**, md 컨트롤·검색창·리스트) · `lg` 24 (하단 탭바·헤더 액션) · `xl` 32 (빈 상태 작은) · `2xl` 48 (빈 상태).

선 두께: 16 이하 2, 32 이상 1.5. 색은 `currentColor`.

## 3. 색
| 상황 | 토큰 |
|---|---|
| 글자 옆 | 글자와 같은 색 |
| 헤더·툴바 아이콘 버튼 | `text.secondary`, hover `text.primary` |
| 하단 탭 활성 / 비활성 | `text.brand` (채움) / `text.tertiary` |
| 등락 화살표 | `finance.<d>.solid` |
| 관심 ★ 켜짐 / 꺼짐 | `yellow.300` #FFB200 채움 / `text.tertiary` 선 |
| 상태 | `status.<s>.icon` |
| 빈 상태 | `text.brand` + 배경 원 `brand-subtle` |

## 4. 금융 화면 아이콘 매핑
| 뜻 | Lucide |
|---|---|
| 검색 | `search` |
| 관심(즐겨찾기) | `star` (채움 토글) |
| 알림 / 알림 설정 | `bell` / `bell-ring` |
| 홈 · 시장 · 섹터 · 자산 · 더보기 | `house` · `chart-candlestick` · `layout-grid` · `wallet` · `ellipsis` |
| 상승 / 하락 추세 | `trending-up` / `trending-down` |
| 차트 종류 | `chart-line` · `chart-candlestick` · `chart-bar` · `chart-area` |
| 기간·캘린더 | `calendar` |
| 정렬 | `arrow-up-down`, 정렬됨 `arrow-up`/`arrow-down` |
| 필터 | `sliders-horizontal` |
| 새로고침·갱신 | `refresh-cw` (회전 애니메이션은 로딩 중에만) |
| 정보(지표 설명) | `info` 16 |
| 외부 링크(공시·뉴스) | `external-link` 12·16 |
| 공유 | `share-2` |
| 비교 | `git-compare` 또는 `columns-2` |
| 포트폴리오 비중 | `pie-chart` |
| 뉴스 | `newspaper` |
| 공시 | `file-text` |
| 매수 / 매도 | 아이콘 없이 텍스트. 굳이 쓰면 `plus-circle` / `minus-circle` |
| 계정 | `user` · `settings` · `log-out` |
| 다크모드 | `sun` / `moon` |
| 장 마감·시간 | `clock` |
| 경고·지연 | `triangle-alert` |
| 닫기 · 뒤로 | `x` · `arrow-left` |

등락 화살표는 아이콘이 아니라 문자 `▲`(U+25B2) `▼`(U+25BC). 크기 12, 숫자와 4px, `aria-hidden` + 부모 `aria-label` 에 "상승/하락" 포함.

## 5. 로고 (14 참조)
파랑새 심볼. 헤더 28, 파비콘 `stock-gosu.ico`. 워드마크 "stock-gosu" Pretendard 700 소문자, 심볼 오른쪽 8px.

## 6. 종목 로고·이미지
| 항목 | 규칙 |
|---|---|
| 종목 로고 | 24/32/40 원형, `border.subtle` 1px(흰 로고 대비), 폴백 첫 글자 |
| 뉴스 썸네일 | 16:9, radius 8, `surface.sunken-strong` 플레이스홀더, 위 제목은 `scrim-bottom` |
| 리포트 표지 | 3:4, radius 12 |
| 차트 이미지 공유 | 1200×630(OG), 라이트 테마 고정, 로고 우하단, 면책 문구 포함 |
| 로딩 | `loading="lazy"`, 크기 지정 |
| 다크 | 로고 배경 `surface.default`, 흰 배경 PNG 로고는 원형 마스크 + 테두리 |

## 7. 일러스트
빈 상태·온보딩에 아이콘 48 + 배경 원 80 으로 충분하다. 일러스트를 그리면 색 3개 이내(`blue.100` `blue.300` `gray.200`), 선 `blue.700` 1.5px, 상승 차트 곡선 모티프. 지폐·금화·로켓 같은 "수익 보장" 연상 이미지는 쓰지 않는다.
