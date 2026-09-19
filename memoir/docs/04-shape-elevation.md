# 04 · 모양·깊이 (memoir) — radius · 테두리 · 그림자 · 글래스 · 그라데이션 · 불투명도 · 블러

design-guide: "깊이는 그림자가 아니라 톤 레이어링으로. 둥근 모서리는 안전한 인상." 종이를 겹쳐 놓은 느낌이 목표다.

## 1. radius
| 토큰 | px | 언제 |
|---|---|---|
| `none` | 0 | 캘린더 셀, 전폭 배너, 화면 끝에 붙은 이미지, 에디터 본문 |
| `xs` | 4 | 인라인 코드, 체크박스, 언어 배지(각진), 스켈레톤 글자, 명령어 mono 상자, kbd |
| `sm` | 6 | 툴팁, 드롭다운 항목 hover, 슬래시 메뉴 항목 |
| `md` | 8 | **버튼·인풋(filled)·미리보기 카드·드롭다운 상자·PIN 칸·북마크 OG 이미지**. 기본(design-guide 8) |
| `lg` | 12 | 메모 카드·코드 블록·북마크 카드·토스트·배너·⋯ 메뉴 상자 |
| `xl` | 16 | 벤토 박스·영상 썸네일·모달·폴더 타일·카테고리 드롭다운·시트 상단 |
| `2xl` | 24 | 히어로 카드·글래스 플로팅 바·온보딩 카드 |
| `full` | | 칩·태그·검색창·FAB·아바타·활성 메뉴 항목(세그먼트)·New 버튼·오늘 날짜 원 |

### 규칙
- **부모 radius − 안쪽 패딩 = 자식 radius**(음수면 4). 카드 12 안 패딩 24 → 코드 블록 12 도 무방(패딩이 커서 안쪽이 더 둥글어 보이지 않는다). 벤토 16 안 미리보기 카드 8.
- 필(full)은 작고 가로로 긴 것(칩·검색·New)에만. 폼 버튼은 8. 한 화면에 필 버튼과 8 버튼이 섞이지 않게(New 는 헤더라 예외).
- 바텀시트는 상단 두 모서리만 16.
- 에디터 안 이미지 12, 인용 0(왼쪽 바).

## 2. 테두리 — 없음이 기본 (No-Line)
| 허용 | 토큰 | 값 |
|---|---|---|
| 접근성 경계(흰 이미지·`prefers-contrast`) | `border.ghost` | outline-variant 15% 1px |
| 인풋 밑줄 | `border.strong` → 포커스 `border.interactive` | 1px → 2px |
| 캘린더 그리드 | `border.default` | 1px neutral.200 |
| 보안 카드 띠·인용 바 | `border-width.accent` + `status.secure.solid` / `border.strong` | 4px |
| 체크박스·라디오 | `border.input-strict` | 1px neutral.500 |
| 포커스 링 | `border.focus` | 2px indigo |
| 아바타 겹침 | `surface.default` | 2px |

`border: 1px solid #e5e7eb` 류가 나오면 면 차이로 바꾼다: 흰 카드는 `zone` 위에, 카드 안 구획은 `zone-deep`, 리스트 항목은 24 여백. `hr` 금지. 표는 zebra(`zone`)로.

## 3. 그림자 — 톤으로 깊이, 그림자는 플로팅에만
| 토큰 | 값 | 언제 | 뜬 높이 |
|---|---|---|---|
| `none` | | **카드 기본**. 면 차이로만 | 0 |
| `soft` | 0 2 12 · ink 5% (기존 shadow-soft) | 클릭 가능한 카드 hover, 세그먼트 활성 항목, 드래그 중 블록, 작은 드롭다운 | 2 |
| `ambient` | 0 12 40 · ink 6% (design-guide) | FAB, 플로팅 툴바, 카테고리 드롭다운, ⋯ 메뉴, 토스트, 팝오버 | 12 |
| `modal` | 0 24 64 −8 · ink 8% | 모달·와이드 모달·시트 | 24 |
| `inner` | inset 0 1 3 · 5% | 눌린 칩·인풋 채움면(선택) | 안 |
| `focus` | 0 0 0 3 · indigo 25% | 검색창·filled 인풋 포커스 링(밑줄이 없는 둥근 인풋) | 링 |

### 규칙
- 그림자 색은 항상 ink 틴트 `#231917`. 검정 그림자는 차갑고 탁하다.
- 한 화면에 그림자 단계 두 개까지(hover soft + 모달).
- 카드 hover 는 `soft` 등장만. `translateY`·`scale` 없음(종이가 뜨는 게 아니라 밝아지는 시스템).
- 다크에서 `shadow-dark.*`(검정 35~65%)로 자동 교체. 면 차이가 주 신호이므로 그림자는 보조.

```css
.card { box-shadow: var(--mm-shadow-none); transition: box-shadow var(--mm-motion-duration-fast) var(--mm-motion-easing-in-out); }
.card.tap:hover { box-shadow: var(--mm-shadow-soft); }
.fab { box-shadow: var(--mm-shadow-ambient); }
.search:focus-within { box-shadow: var(--mm-shadow-focus); }
```

## 4. 글래스 (기획서 + design-guide 통합)
| 토큰 | 값 | 언제 |
|---|---|---|
| `glass.bg-modal` + `glass.blur` | white 80% + 20px | 모달·드롭다운·⋯ 메뉴·플로팅 툴바·스크롤 시 헤더(blur 12) |
| `glass.bg-floating` + `glass.blur-strong` | white 40% + 24px | 대시보드 벤토(기획서 `bg-white/40 backdrop-blur-xl`) |
| 다크 | neutral.900 90% / 60% | 어두운 글래스는 더 불투명해야 글자가 산다 |

유틸 `.mm-glass-modal` `.mm-glass-floating`(typography.css). 글래스는 뒤에 색·블롭이 있어야 보인다 — 순백 캔버스 위에서는 그냥 흰 면이다. 벤토는 크림(다크 neutral.900) 또는 블롭 위에. `backdrop-filter` 성능 문제(저사양 모바일)면 `surface.raised` 를 불투명 흰 면으로 폴백하고 `shadow.ambient` 로 구분.

## 5. 그라데이션
design-guide: "무거운 그라데이션 금지. CTA 가 필요하면 primary → primary-container 미세 전환 하나."
| 토큰 | 색 | 각도 | 언제 | 위 글자 |
|---|---|---|---|---|
| `cta` | rose → pink.500 | 135 | 랜딩 CTA hover 만. 앱 버튼은 단색 | white |
| `blob-pink` / `blob-blue` | pink 40% → 0 / periwinkle 30% → 0 | radial | 랜딩·온보딩·로그인 배경 블롭. 크기 40~60vw, `filter: blur(60px)`, 2~3개, `blob` 18s 부유 | 위에 글자 직접 금지(카드·글래스 안에) |
| `paper` | paper → cream | 180 | 온보딩·빈 상태 카드 배경(거의 안 보임) | 그대로 |
| `scrim-bottom` | 투명 → ink 70% | 180 | 영상 썸네일 위 제목 | white |
| `fade-right` | 투명 → paper | 90 | 서브 헤더 칩 스크롤 끝 | |

```css
.landing-bg::before { content: ''; position: absolute; width: 50vw; height: 50vw; border-radius: 50%; background: var(--mm-gradient-blob-pink); filter: blur(60px); animation: mm-blob var(--mm-motion-duration-blob) var(--mm-motion-easing-in-out) infinite alternate; }
.chips-wrap::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 32px; background: var(--mm-gradient-fade-right); pointer-events: none; }
```
- 로고·워드마크·배지·KPI·카드에 그라데이션 금지(기존 로고 SVG 의 그라데이션 텍스트는 14 에서 교체).
- 다크: `paper`·`fade-right` 는 원시 참조라 밝게 남는다 → `surface.zone` 단색 / `linear-gradient(90deg, transparent, var(--mm-color-surface-canvas))`. `blob-*`·`scrim` 은 alpha 라 그대로.

## 6. 불투명도
| 토큰 | 값 | 언제 |
|---|---|---|
| `disabled` | 0.4 | 비활성 요소 전체 |
| `hover` / `pressed` | 0.04 / 0.08 | overlay 층(이미 흰 면 위 hover) |
| `scrim` | 0.4 | 모달 뒤 |
| `skeleton` | 0.6 | 스켈레톤 최저 |
| `locked` | 0.5 | 잠긴 보안 메모 미리보기(+ blur) |
| `ghost-border` | 0.15 | outline-variant 를 테두리로 쓸 때 |

## 7. 블러
| 토큰 | 값 | 언제 |
|---|---|---|
| `sm` | 4 | 스크림 뒤 미세 |
| `md` | 12 | 스크롤 시 헤더 글래스 |
| `lg` | 20 | 모달·드롭다운 글래스(design-guide 20) |
| `locked` | 8 | 잠긴 보안 메모 본문 |
벤토는 `glass.blur-strong` 24. 블롭 배경은 `filter: blur(60px)` 직접(토큰 밖, 랜딩 전용).

## 8. 이미지 모양
| 항목 | 규칙 |
|---|---|
| 북마크 OG | 96×64 radius 8 cover |
| 영상 썸네일 | 16:9 radius 16 |
| 에디터 이미지 | 최대 prose 폭, radius 12 |
| 아바타·마스코트 | 원형 |
| 폴더 타일 | 정사각 radius 16 |

## 9. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 카드 `border` + `shadow` | 둘 다 없음. zone 위 흰 면 |
| 리스트 `divide-y` | 24 여백 + hover 흰 면 |
| 버튼 radius 12·필 혼용 | 8. 헤더 New 만 필 |
| 검정 `rgba(0,0,0,.2)` 그림자 | `shadow.ambient` ink 틴트 |
| 카드 hover `translateY(-2px)` | `shadow.soft` 만 |
| 흰 캔버스 위 글래스 | 크림·블롭 위 |
| 그라데이션 버튼·로고 텍스트 | 단색 로즈 |
| 인풋 상자 테두리 | 밑줄 또는 채움면 |
| 다크에서 `gradient.paper` 그대로 | `surface.zone` |
| 벤토 안 카드에 그림자 | zone 면 |
