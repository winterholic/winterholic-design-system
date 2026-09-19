# 10 · 아이콘·이미지 (stock-gosu)

## 1. 아이콘 라이브러리
**Lucide**(`lucide-react`) 하나만 쓴다. 24px 그리드, 선 두께 2px 아웃라인, MIT. 다른 세트(Heroicons·Material·FontAwesome)를 섞으면 획 두께가 달라 즉시 티가 난다. 기존 코드의 이모지·유니코드 `⋯` 문자 아이콘은 Lucide 로 통일한다. 단 **등락 화살표 `▲▼` 는 문자로 유지**(글자와 정렬되고 스크린리더 대응이 쉽다).

Lucide 에 없는 아이콘(캔들·호가창 등)은 같은 규격(24 그리드, 2px 선, round cap/join, 채움 없음)으로 직접 그린다.

## 2. 크기
| 토큰 | px | 언제 | 짝 |
|---|---|---|---|
| `icon.xs` | 12 | 등락 화살표·배지 안·정렬 표시·외부 링크 | label-sm, caption, change |
| `icon.sm` | 16 | sm 컨트롤 안, 표 정렬, 메뉴 항목, 칩 X, 인라인 ⓘ | label-md(sm 버튼), body-3 |
| `icon.md` | 20 | **기본**. md 컨트롤 안, 검색창, 리스트, 인풋 접사, 배너 | label-md, body-2 |
| `icon.lg` | 24 | 하단 탭바, 헤더 액션, lg 컨트롤 | label-lg |
| `icon.xl` | 32 | 빈 상태(작은), 피처 카드, 차트 오류 | title-3 |
| `icon.2xl` | 48 | 빈 상태(기본), 온보딩 | title-2 이상 |

- 글자 옆 아이콘은 글자 크기 × 1.25 근처 단계(13px 글자 → 16, 15px → 20).
- 선 두께: 16 이하 2(기본), 32 이상 1.5, 12 는 2.5 허용.
- `currentColor` 로 색을 받는다. 아이콘에 색을 직접 박지 않는다.

## 3. 색
| 상황 | 색 토큰 |
|---|---|
| 글자 옆 | 그 글자와 같은 색(`currentColor`) |
| 독립 아이콘 버튼(ghost) | `text.secondary`, hover `text.primary` |
| 헤더·툴바 아이콘 | `text.secondary` |
| 비활성 | `text.disabled` |
| 상태 아이콘 | `status.<s>.icon` |
| 등락 화살표 | `finance.<d>.solid` |
| 하단 탭 활성 / 비활성 | `text.brand`(채움) / `text.tertiary` |
| 관심 ★ 켜짐 / 꺼짐 | `yellow.300` #FFB200 채움 / `text.tertiary` 선 |
| 잠금·보안 | `text.secondary` |
| 장식(피처 카드) | `text.brand` + 배경 원 `surface.brand-subtle` 40/48 |
| 차트 오류·빈 | `text.tertiary` |

## 4. 아이콘 + 라벨
- 간격 `space.1-5` 6(버튼) / `space.2` 8(리스트·메뉴). xs·sm 컨트롤은 4.
- 아이콘은 **왼쪽**. 오른쪽은 진행 방향(chevron-right, external-link, arrow-right)과 드롭다운 chevron-down 만.
- 아이콘 전용 버튼: 정사각형, `aria-label`, 툴팁 필수. 3개 이상 나열되면 라벨을 붙인다.
- 의미가 모호한 아이콘(설정 vs 필터 vs 더보기)은 라벨 없이 쓰지 않는다. 확실한 것: search, x, chevron, plus, star, bell, refresh.

## 5. 금융 화면 아이콘 매핑
| 뜻 | Lucide |
|---|---|
| 검색 | `search` |
| 관심(즐겨찾기) | `star` (채움 토글) |
| 알림 / 알림 설정 | `bell` / `bell-ring` |
| 홈 · 시장 · 섹터 · 자산 · 더보기 | `house` · `chart-candlestick` · `layout-grid` · `wallet` · `ellipsis` |
| 상승 / 하락 추세 | `trending-up` / `trending-down` |
| 차트 종류 | `chart-line` · `chart-candlestick` · `chart-bar` · `chart-area` |
| 기간·캘린더 | `calendar` |
| 정렬 / 정렬됨 | `arrow-up-down` / `arrow-up` `arrow-down` |
| 필터 | `sliders-horizontal` (❌ `filter` 깔때기는 오해가 잦다) |
| 새로고침·갱신 | `refresh-cw` (로딩 중에만 회전) |
| 일시정지 / 재개 | `pause` / `play` |
| 정보(지표 설명) | `info` 16 |
| 외부 링크(공시·뉴스) | `external-link` 12·16 |
| 공유 | `share-2` |
| 비교 | `git-compare` |
| 포트폴리오 비중 | `pie-chart` |
| 뉴스 / 공시 | `newspaper` / `file-text` |
| 매수 / 매도 | 아이콘 없이 텍스트. 굳이 쓰면 `plus-circle` / `minus-circle` |
| 계정·설정·로그아웃 | `user` · `settings` · `log-out` |
| 다크모드 | `sun` / `moon` |
| 장 마감·시간 | `clock` |
| 지연·경고 / 오류 / 성공 / 안내 | `triangle-alert` / `circle-x` / `circle-check` / `info` |
| 닫기 · 뒤로 · 더보기 | `x` · `arrow-left` · `ellipsis` |
| 복사 / 복사됨 | `copy` → `check` |
| 펼치기·접기 | `chevron-down` / `chevron-up`, 트리 `chevron-right` |
| 드래그 손잡이 | `grip-vertical` |
| 잠금 / 해제 | `lock` / `lock-open` |
| 업로드 / 다운로드(내보내기) | `upload` / `download` |
| 보기 / 숨기기(비밀번호) | `eye` / `eye-off` |
| 검색 결과 없음·빈 상태 | `search-x`, `inbox`, `star`(관심 없음), `line-chart`(차트 없음) |

등락 화살표: `▲`(U+25B2) `▼`(U+25BC) 12px, 숫자와 4px, `aria-hidden` + 부모 `aria-label` 에 "상승/하락".

## 6. 로고
파랑새 심볼(`assets/brand/stock-gosu.svg`). 규격은 14. 헤더 28, 모바일 심볼만 24, 파비콘 `stock-gosu.ico`. 워드마크 "stock-gosu" Pretendard 700 소문자, 심볼 오른쪽 8.

## 7. 종목 로고·이미지
| 항목 | 규칙 |
|---|---|
| 종목 로고 | 24/32/40 원형, `border.subtle` 1px(흰 로고 대비), 폴백 `brand-subtle` + 첫 글자 `text.brand`. 실패 자동 폴백 |
| 뉴스 썸네일 | 16:9, radius 8, `surface.sunken-strong` 플레이스홀더, 위 제목은 `scrim-bottom`, `loading="lazy"`, 크기 지정 |
| 리포트 표지 | 3:4, radius 12 |
| 차트 공유 이미지 | 1200×630(OG), 라이트 테마 고정, 로고 우하단, 면책 문구 포함 |
| 실패 | `sunken-strong` + `image-off` 아이콘 `text.tertiary` |
| 포맷 | WebP/AVIF, `srcset` 1x/2x |
| 다크 | 사진 그대로, 스크린샷·일러스트는 다크 버전 또는 `brightness(0.9)`. 흰 배경 PNG 로고는 원형 마스크 + 테두리 |

## 8. 일러스트 (빈 상태·온보딩)
- 색 3개 이내: `blue.100` `blue.300` `gray.200`, 선 `blue.700` 1.5px. 상승 차트 곡선·돋보기·별 모티프.
- 크기: 빈 상태 160×120, 온보딩 240×180.
- 지폐·금화·로켓·불꽃처럼 "수익 보장"을 연상시키는 이미지는 쓰지 않는다(정보·분석 서비스 정체성).
- 없으면 아이콘 48 + 배경 원 80(`surface.brand-subtle`)으로 충분하다.
