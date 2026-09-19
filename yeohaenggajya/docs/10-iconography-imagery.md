# 10 · 아이콘·이미지·아트워크 (여행가쟈)

## 1. 아이콘
**Lucide**(`lucide-react`, 이미 의존성) 24 그리드 2px. 모노크롬(ink 또는 currentColor). 헤더 우측 보조 아이콘은 1개까지(토스 Navigation 원칙). 이모지 금지(민화 무드와 충돌).

크기: `xs` 12 (배지 안·chevron 작은) · `sm` 16 (칩·리스트 chevron·인풋 액션) · `md` 20 (버튼 안·시트 액션) · `nav` 22 (탭바) · `lg` 24 (헤더 액션·GachaCta) · `xl` 32 (빈 상태 작은) · `2xl` 48 (온보딩).

색: 글자 옆 = currentColor. 헤더·탭바 비활성 ink-3, 활성 빨강(탭바)·ink(헤더). 장식 `aria-hidden`.

| 뜻 | Lucide |
|---|---|
| 홈 · 도감 · 마이 | `house` · `book-open` · `user` |
| 뒤로 · 닫기 | `arrow-left` · `x` |
| 검색·필터 | 아이콘 대신 **낙관 도장 아트워크**(paper-bar stamp). 보조로 `search` |
| 공유(까치) | `send` (문구 "까치 보내기") |
| 코스·지도 | `route` · `map-pin` |
| 방문 인증 | 도장 `Stamp` 컴포넌트(아이콘 아님) |
| 즐겨찾기 | `bookmark` |
| 설정·계정 연결 | `settings` · `link` |
| 남은 횟수 | `PullCounter`(도트) |
| 카메라·던지기(AR) | `camera` · `hand` |
| 정보(확률 안내) | `info` |
| 정렬·뷰 | `arrow-up-down` · `layout-grid` |
| 외부 지도 | `external-link` |
| 오류·성공 | `circle-x` · `circle-check`(테두리 색 + ink 아이콘) |
| 세트 완주 | 도장 傳 또는 `award` |

## 2. 아트워크 (아이콘보다 우선)
이 시스템의 시각 언어는 아이콘이 아니라 **아트워크**다. 있으면 아트워크, 없으면 Lucide.
| 자산 | 위치 | 용도 |
|---|---|---|
| 필터 바 프레임 | `public/ui/filter-frame.webp` (1024×139, 9-slice 22 36 30 24 / 7 12 10 8) | 한지 필터 바 테두리. `fill` 금지, `background-clip: padding-box` |
| 낙관 도장 | `public/ui/filter-stamp.webp` | 필터 바 돋보기 도장 28 |
| 캡슐 | `Capsule` CSS(돔·띠·베이스) | 시그니처. 이미지 아님 |
| 민화 일러스트 | `public/dex/`, `docs/dex-art-samples` | 도감 셀·카드 아트. 해·산·동물 모티프 |
| 카드 프레임 | `public/borders/` `public/cards/` | 등급별 카드 장식 |
| 배지·세트 | `public/badges/` `public/sets/` | 세트 완주·인증 도장 |
| 로고 | `public/brand/` | 14 |

아트워크 규칙: 재채색·늘리기 금지, 크기만. 아트워크 내부 색은 토큰 대상이 아니다(에셋 경계). 9-slice 는 슬라이스와 테두리 폭이 짝.

## 3. 사진 (한국관광공사 OpenAPI)
| 항목 | 규칙 |
|---|---|
| 카드 사진 | 카드 폭 64%, radius 4, `object-fit: cover`, 등급 프레임 안 |
| 코스·장소 사진 | 16:9 또는 4:3, radius 8, hanji-2 플레이스홀더 |
| 출처 표기 | `ImageCredit` caption 11 ink-2, 사진 우하단 또는 아래("사진 · 한국관광공사"). 법적 필수(13-legal) |
| 실패 | 민화 플레이스홀더 일러스트(회색 X 금지) |
| 로딩 | `loading="lazy"`, 크기 지정, next/image, hanji-2 자리 |
| 무대 | 사진 위 글자 없음(카드 밖) |
| 다크 | 해당 없음 |

## 4. 도감 아트 규칙
- 셀 108 안 일러스트 정사각, 민화 톤(한지 배경 + 단청 3색 이내 + 먹선).
- 잠긴 셀: 같은 일러스트 실루엣 opacity .55 + 도장 없음. 회색조 변환 금지(민화 색 유지).
- 등급별 카드 프레임 아트는 `public/borders/`. 프레임 색은 `rarity.<r>.accent`, 아트 자체는 고정.

## 5. 지도
OpenStreetMap iframe 미리보기(코스) + 네이버/카카오 외부 링크. iframe 은 래퍼(radius 8, ink 2px)로 경계만 토큰. 내부는 서드파티(토큰 강제 안 함). SDK 교체 시 같은 래퍼.

## 6. OG·공유 이미지
`public/og-default.png` 기본. 결과 공유 OG 는 카드 + 로고 + "여행가쟈" 워드마크, 한지 배경, 1200×630. 등급 풀네임 포함, 시즌 키워드(Unique) 포함.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 이모지 아이콘 | Lucide 또는 도장 아트워크 |
| 컬러 아이콘 세트 | 모노크롬 ink |
| 헤더 우측 아이콘 3개 | 1개 + 시트 |
| 잠긴 셀 회색조 | 일러스트 opacity .55 |
| 사진 실패 회색 X | 민화 플레이스홀더 |
| 아트워크 재채색 | 크기만 |
| 사진 출처 생략 | ImageCredit |
