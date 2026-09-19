# 04 · 모양·깊이 (여행가쟈) — 먹선 · 도장 그림자 · 오방색 띠

이 시스템의 질감은 **먹선 + 오프셋 그림자(도장·종이)** 다. 부드러운 blur 그림자는 연출(무대)에서만. 종이가 겹쳐 들린 느낌을 만든다.

## 1. radius
| 토큰 | px | 언제 |
|---|---|---|
| `none` | 0 | 오방색 띠, 무대 배경, 표 셀 |
| `xs` | 4 | 도장 사각, 드롭다운 항목, 등급 라벨 각진(3) |
| `sm` | 8 | **버튼·입력·도감 셀·탭바 항목·토스트·드롭다운 상자** |
| `md` | 12 | **카드(고정)**·시트·다이얼로그·card-shell |
| `lg` | 20 | 탭바 컨테이너(모바일)·큰 패널 |
| `frame` | 32 | 폰 프레임 셸 전용 |
| `paper-bar` | 10 | 한지 필터 바(9-slice 아트워크) |
| `full` | 999 | 칩·배지·프로그레스·데스크톱 탭바·플로팅 필터·도장 원형 |
| 캡슐 | `capsule.dome-radius` `base-radius` | 돔 `50% 50% 8% 8% / 90% 90% 8% 8%`, 베이스 `8% 8% 50% 50% / 8% 8% 80% 80%` |

규칙
- 카드는 12 고정. 카드 안 이미지는 카드 − 프레임(3) − 패딩(12) ≈ 4 → `xs`.
- 도감 셀 8, 안쪽 라인 6(8 − 2).
- 버튼 8 이 기본. 필(999)은 칩·플로팅 원형 버튼만. 필 버튼을 CTA 에 쓰지 않는다.
- 먹선이 있는 요소는 radius 가 작을수록 도장·종이 느낌이 산다. 20 이상은 탭바·프레임뿐.

## 2. 먹선 (테두리)
| 토큰 | px | 언제 |
|---|---|---|
| `thin` | 1 | faint 외곽(데스크톱 네비), 도감 셀 안쪽 라인, 리스트 구분 |
| `chip` | 1.5 | 칩·입력·등급 배지·드롭다운 |
| `ink` | 2 | **버튼·카드 shell·캡슐·탭바·프레임·도감 셀·시트** |
| `caret` | 2.5 | 꺾쇠(paper-bar) |
| `card` | 3 | 결과 카드 등급 프레임 |
| `focus` | 2 | 포커스 링 offset 3 |

색은 `border.ink`(검정)가 기본. 등급 의존 프레임만 `rarity.<r>.accent`. 리스트 구분은 `border.subtle`(hanji-dark).
- 먹선과 그림자는 세트다: 먹선 없는 도장 그림자는 떠 보이지 않는다.
- 단청색 테두리는 "선택·강조·등급"일 때만. 기본은 검정.

## 3. 그림자 — 오프셋이 질감
| 토큰 | 값 | 언제 |
|---|---|---|
| `stamp` | 3px 3px 0 빨강 | primary 버튼·도장·플로팅 필터·토스트 |
| `stamp-blue` | 3px 3px 0 파랑-deep | 파랑 버튼 |
| `stamp-ink` | 3px 3px 0 ink-3 | ghost 버튼 |
| `stamp-pressed` | 1px 1px 0 | 눌림(translate 1,1 과 함께) |
| `stamp-disabled` | 1px 1px 0 ink-3 | 비활성 + opacity .72 |
| `paper` | 0 2px 0 ink + 4px 4px 0 빨강 | 카드·시트·드롭다운 — 종이가 들린 느낌 |
| `paper-lg` | 0 4px 0 ink + 6px 6px 0 빨강 | 폰 프레임 셸·다이얼로그 |
| `foil` | 0 0 24 금 50% + 0 0 64 금 25% | 호일 글로우 — Legendary 도감 셀·연출 |
| `holo` | 0 0 32 빨강 40% + 0 0 64 금 30% | 홀로 글로우 — 연출 |
| `deep` | 0 12 32 검정 40% | 무대 위 카드 |
| `none` | | 기본 면(먹선만) |

규칙
- 오프셋 그림자(`Npx Npx 0`)는 hover 로 커지지 않는다. 눌림에서 1px 로 줄고 요소가 1px 이동한다(도장 찍는 손맛).
- blur 그림자(foil·holo·deep)는 `data-tone="dark"` 안 또는 Legendary 셀 펄스에서만.
- 한 화면에 오프셋 그림자 색은 빨강 하나 + (파랑 버튼 있을 때) 파랑.
- 데스크톱 프레임 `paper-lg` 는 화면에 하나.

```css
.btn { border: 2px solid var(--yg-color-border-ink); box-shadow: var(--yg-shadow-stamp); transition: transform var(--yg-motion-duration-fast) var(--yg-motion-easing-out), box-shadow var(--yg-motion-duration-fast) var(--yg-motion-easing-out); }
.btn:active { box-shadow: var(--yg-shadow-stamp-pressed); transform: translate(var(--yg-motion-distance-press), var(--yg-motion-distance-press)); }
.card { border: 3px solid var(--yg-color-rarity-rare-accent); border-radius: var(--yg-radius-md); box-shadow: var(--yg-shadow-paper); }
```

## 4. 오방색 띠 · 그라데이션
| 토큰 | 언제 | 규격 |
|---|---|---|
| `band` | 앱 상단(6px)·캡슐 띠(8%)·카드 띠·결과 배너 | 빨·파·노·흰·검 20% 하드 스톱, 90deg |
| `title-underline` | 홈 타이틀 밑줄 | 빨→파→노, 3px, 90deg, 글자 폭만큼 |
| `holo-sheen` | 호일 광택 이동(holoShift) | 120deg, background-size 300%, 무대 |
| `holo-rainbow` | Legendary 무지개 홀로(conic, holoRotate 8s) | 무대 |
| `stage-vignette` | 무대 배경(radial) | 가운데 #241E17 → 가장자리 #110E0A |
| `hanji-fade` | 가로 스크롤(칩·캐러셀) 끝 | 90deg, 24px |

띠 외의 그라데이션은 무대 전용. 한지 화면의 면·버튼·카드에 그라데이션 금지.

## 5. 한지 텍스처
body 에 두 겹 radial 점(`texture.dot-*`: hanji-deep 6%·4%, 18/22px). 데스크톱 책상은 hanji-2 + 빨강 5%·먹 4% 격자 96. 카드 표면(hanji-bright)에는 텍스처 없음 — 종이 위 종이는 매끈하다.

한지 필터 바(`.paper-bar`)는 아트워크 9-slice(`border-image: url(/ui/filter-frame.webp) 22 36 30 24 / 7px 12px 10px 8px`) — 원본 규칙: `fill` 없이, 슬라이스와 테두리 폭은 짝, `background-clip: padding-box`.

## 6. 불투명도·블러
| 토큰 | 값 | 언제 |
|---|---|---|
| `disabled` | 0.72 | 버튼 비활성(원본) |
| `disabled-general` | 0.5 | 그 외 비활성 |
| `scrim` | 0.6 | 시트·다이얼로그 스크림(ink) |
| `locked-cell` | 0.55 | 도감 잠긴 셀 일러스트 |
| `twinkle-min` | 0.3 | fxTwinkle 최저 |
| `blur.glow` | 40 | aura 블러 |
| `blur.md` | 12 | 시트 뒤 무대 |

## 7. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `box-shadow: 0 4px 12px rgba(0,0,0,.1)` 카드 | `shadow.paper` 오프셋 |
| hover 로 그림자 키우기 | 변화 없음. active 만 눌림 |
| 먹선 없는 버튼 | 2px ink + 도장 그림자 |
| 필(999) CTA | radius 8 |
| 카드 radius 16 | 12 고정 |
| 단청 테두리를 기본으로 | 검정 먹선, 단청은 선택·등급 |
| 한지 화면에 글로우 | 무대(`data-tone="dark"`)만 |
| 회색 그라데이션 스켈레톤 | hanji-2 단색 |
| 카드 표면에 텍스처 | 캔버스만 |
