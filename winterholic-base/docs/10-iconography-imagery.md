# 10 · 아이콘·이미지

## 1. 아이콘 라이브러리

**Lucide** (`lucide-react` / `lucide-vue-next` / `lucide-static`) 하나만 쓴다. 24px 그리드, 선 두께 2px 아웃라인, 1,500개 이상, MIT. 다른 세트(Heroicons·Material·FontAwesome)를 섞으면 획 두께가 달라 즉시 티가 난다.

Lucide 에 없는 아이콘은 같은 규격(24 그리드, 2px 선, round cap/join, 채움 없음)으로 직접 그린다.

## 2. 크기

| 토큰 | px | 언제 | 짝 |
|---|---|---|---|
| `icon.xs` | 12 | 배지·캡션 옆·인라인 상태 | label-sm, caption |
| `icon.sm` | 16 | sm 컨트롤 안, 표 정렬 화살표, 메뉴 항목, body-sm 옆 | label-md(sm 버튼), body-sm |
| `icon.md` | 20 | **기본**. md 컨트롤 안, 본문 옆, 인풋 접사, 사이드바 | label-md, body-md |
| `icon.lg` | 24 | 헤더·내비 아이콘 버튼, lg 컨트롤, 배너 | label-lg, heading |
| `icon.xl` | 32 | 빈 상태(작은), 피처 카드 아이콘 | heading-3 |
| `icon.2xl` | 48 | 빈 상태(기본), 온보딩 | heading-4 이상 |

- 글자 옆 아이콘은 **글자 크기 × 1.25** 가 기준(14px 글자 → 16 아이콘... 실제로는 스케일에 맞춰 16 또는 20).
- 선 두께: 16 이하는 `stroke-width: 2`(기본) 유지. 32 이상은 1.5 로 줄이면 가벼워 보인다. 12 는 `2.5` 도 허용.
- `currentColor` 로 색을 받는다. 아이콘에 색을 직접 박지 않는다.

## 3. 색

| 상황 | 색 토큰 |
|---|---|
| 글자 옆 아이콘 | 그 글자와 같은 색(`currentColor`) |
| 독립 아이콘 버튼(ghost) | `text.secondary`, hover `text.primary` |
| 비활성 | `text.disabled` |
| 상태 아이콘 | `status.<s>.icon` |
| 사이드바 활성 | `selected-text` (라벨과 같이) |
| 장식 아이콘(피처 카드) | `text.brand` 위에 배경 원 `surface.brand-subtle` 40 또는 48 |

## 4. 아이콘 + 라벨

- 간격 `space.2`(8). xs·sm 컨트롤에서는 `space.1-5`(6).
- 아이콘은 **왼쪽**. 오른쪽은 진행 방향(chevron-right, external-link, arrow-right)일 때만.
- 아이콘 전용 버튼: 정사각형, `aria-label`, 툴팁 필수. 3개 이상 나열되면 라벨을 붙이는 게 낫다.
- 의미가 모호한 아이콘(설정 vs 필터 vs 더보기)은 라벨 없이 쓰지 않는다. 확실한 것: search, x(닫기), chevron, plus, trash, check, menu.

## 5. 자주 쓰는 매핑

| 뜻 | Lucide 이름 |
|---|---|
| 닫기 | `x` |
| 더보기 메뉴 | `ellipsis` (가로) · 세로는 `ellipsis-vertical` |
| 추가 | `plus` |
| 삭제 | `trash-2` |
| 편집 | `pencil` |
| 검색 | `search` |
| 필터 | `sliders-horizontal` (❌ `filter` 깔때기는 오해가 잦다) |
| 정렬 | `arrow-up-down`, 정렬됨 `arrow-up`/`arrow-down` |
| 설정 | `settings` |
| 알림 | `bell` |
| 사용자 | `user`, 여러 명 `users` |
| 성공 | `circle-check` |
| 경고 | `triangle-alert` |
| 오류 | `circle-x` 또는 `octagon-alert` |
| 정보 | `info` |
| 외부 링크 | `external-link` (링크 오른쫀 12·16) |
| 복사 / 복사됨 | `copy` → `check` |
| 로딩 | `loader-circle` + 회전 |
| 펼치기/접기 | `chevron-down` / `chevron-up` (아코디언), `chevron-right` (트리·breadcrumb) |
| 뒤로 | `arrow-left` |
| 업로드 / 다운로드 | `upload` / `download` |
| 보기/숨기기 | `eye` / `eye-off` |
| 다크모드 | `sun` / `moon` |
| 드래그 손잡이 | `grip-vertical` |
| 즐겨찾기 | `star` (채움 토글) |
| 좋아요 | `heart` |
| 캘린더 | `calendar` |
| 시간 | `clock` |
| 홈 | `house` |

## 6. 로고

- 정본 파일은 `assets/brand/`에 있다. 새로 그리지 말고 `logo-mark.svg`, `logo-lockup.svg`, `logo-lockup-inverse.svg` 중 상황에 맞는 것을 쓴다.
- 워드마크 `winterholic`은 Pretendard 700, 자간 -0.02em, 소문자다.
- 기본 심볼은 여섯 갈래 얼음 결정과 `W` 결합부다. 컬러 버전의 팔레트와 면 배치를 임의로 바꾸지 않는다.
- 최소 높이 24(헤더), 심볼 단독은 20. 좌우 여백은 로고 높이의 1/2 이상 비운다.
- 파비콘은 `assets/brand/favicon.svg`를 우선하고, PNG 폴백은 16·32·48px을 제공한다.
- 캐릭터·히어로·장식까지 포함한 전체 규칙은 [14 브랜드 자산](14-brand-assets.md)을 따른다.

## 7. 이미지

| 항목 | 규칙 |
|---|---|
| 비율 | 카드 썸네일 16:9 또는 4:3, 아바타 1:1, 히어로 21:9(데스크톱) / 4:5(모바일). `aspect-ratio` 로 고정해 로딩 중 점프 방지 |
| radius | 부모 radius − 패딩. 카드 상단 꽉 찬 이미지는 카드와 같은 radius(상단만) |
| 로딩 중 | 배경 `surface.sunken`(또는 `brand.steel` 8% = `opacity.placeholder-image`), `loading="lazy"`, 크기 지정 |
| 실패 | `surface.sunken` + `image-off` 아이콘 `text.tertiary` |
| 위 글자 | `gradient.scrim-bottom` 필수, 글자 white |
| 포맷 | WebP/AVIF, `srcset` 1x/2x, 히어로는 `fetchpriority="high"` |
| 다크 | 사진은 그대로, 일러스트·스크린샷은 다크 버전 또는 `brightness(0.9)` |

## 8. 일러스트 (빈 상태·온보딩)

- 색 3개 이내: `brand.mist` `brand.ice` `blue.100`, 선은 `blue.700` 1.5px.
- 크기: 빈 상태 160×120, 온보딩 240×180. 그 이상은 화면을 잡아먹는다.
- 사람 얼굴·복잡한 장면 피한다. 사물·추상 형태로.
- 없으면 아이콘 48 + 배경 원 80(`surface.brand-subtle`)으로 충분하다. 억지로 그리지 않는다.
