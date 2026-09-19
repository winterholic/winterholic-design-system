# 04 · 모양·깊이 (memoir)

## 1. radius
| 토큰 | px | 언제 |
|---|---|---|
| `xs` | 4 | 인라인 코드·체크박스·언어 배지(각진 사각) |
| `sm` | 6 | 툴팁·드롭다운 항목 |
| `md` | 8 | **버튼·인풋·미리보기 카드·드롭다운 상자** (design-guide 8) |
| `lg` | 12 | 메모 카드·코드 블록·북마크 카드 |
| `xl` | 16 | 벤토 박스·영상 카드·모달·폴더 타일 |
| `2xl` | 24 | 히어로·글래스 플로팅 바·온보딩 |
| `full` | | 칩·태그·검색창·FAB·아바타·활성 메뉴 항목 |

부모 − 패딩 = 자식. 카드 12 안 코드 블록은 12 도 무방(패딩 24 라 시각적으로 안쪽이 더 둥글어 보이지 않는다). 필(full)은 작고 가로로 긴 것(칩·검색·New 버튼)에만.

## 2. 테두리 — 없음이 기본
| 허용 | 토큰 |
|---|---|
| 접근성 경계 | `border.ghost` outline 15%, 1px |
| 인풋 밑줄 | `border.strong` 1px → 포커스 `border.interactive` 2px |
| 캘린더 그리드 | `border.default` 1px |
| 보안 카드 띠 | `border-width.accent` 4px `status.secure.solid` |
| 체크박스 | `border.input-strict` 1px |

`border: 1px solid #e5e7eb` 류가 나오면 면 차이로 바꾼다: 흰 카드는 `zone` 위에, 카드 안 구획은 `zone-deep`.

## 3. 그림자 — 톤으로 깊이
| 토큰 | 언제 | 값 |
|---|---|---|
| `none` | 카드 기본 | |
| `soft` | 클릭 가능한 카드 hover·드롭다운 (기존 `shadow-soft`) | 0 2 12 ink 5% |
| `ambient` | FAB·플로팅 바·팝오버·카테고리 드롭다운 (design-guide) | 0 12 40 ink 6% |
| `modal` | 모달·와이드 모달 | 0 24 64 ink 8% |
| `inner` | 눌린 칩·인풋 채움면 | |
| `focus` | 검색창·필 인풋 포커스 링 | indigo 25% 3px |

그림자 색은 항상 ink 틴트(`#231917`). 검정 그림자는 차갑다. 다크에서는 `shadow-dark.*` 로 alpha 가 올라간다.

## 4. 글래스 (design-guide + 기획서)
| 토큰 | 값 | 언제 |
|---|---|---|
| `glass.bg-modal` + `glass.blur` | white 80% + 20px | 모달·드롭다운·플로팅 액션 바·스크롤 시 헤더 |
| `glass.bg-floating` + `glass.blur-strong` | white 40% + 24px | 대시보드 벤토 |
글래스는 뒤에 색·블롭이 있어야 보인다. 순백 위에서는 그냥 흰 면이다.

## 5. 그라데이션
| 토큰 | 언제 |
|---|---|
| `cta` rose → pink.500 | 랜딩 CTA hover 만. 앱 버튼은 단색 |
| `blob-pink` / `blob-blue` (radial) | 랜딩 배경 블롭(기존 blob-float 애니메이션). 크기 40~60vw, 블러 60 이상, 2~3개 |
| `paper` paper → cream | 온보딩·빈 상태 카드 배경 |
| `scrim-bottom` | 영상 썸네일 위 제목 |
| `fade-right` | 서브 헤더 칩 스크롤 끝 |
design-guide: "무거운 그라데이션 금지". 위 다섯 개 외에 만들지 않는다.

## 6. 불투명도·블러
`opacity.locked` 0.5 + `blur.locked` 8px → 잠긴 보안 메모 미리보기. `opacity.ghost-border` 0.15. `blur.md` 12 헤더, `blur.lg` 20 모달.

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 카드 `border` + `shadow` | 둘 다 없음. zone 위 흰 면 |
| 버튼 radius 12·필 혼용 | 8. 헤더 New 만 필 |
| 검정 `rgba(0,0,0,.2)` 그림자 | `shadow.ambient` ink 틴트 |
| 흰 캔버스 위 글래스 | 크림·블롭 위 |
| 그라데이션 버튼 | 단색 로즈 |
| 인풋 상자 테두리 | 밑줄 또는 채움면 |
