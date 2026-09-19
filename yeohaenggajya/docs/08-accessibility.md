# 08 · 접근성 (여행가쟈)

Bright Line 9 "접근성은 기본값"이고, 규칙 충돌 시 **접근성 > 등급·카피 정합 > 색·배경** 순으로 이긴다. 원본 `references/copy-and-a11y.md §B` 가 정본. 여기는 이 시스템 값으로 구체화한 것.

## 1. 대비 (빌드가 92쌍 검사, 한지·한지-bright 기준)
| 대상 | 기준 | 시스템에서 |
|---|---|---|
| 본문·제목 | 4.5 | `ink`(15.3) `ink-2`(8.9) `ink-3`(5.2, 하한) |
| `ink-4` | | **글자 금지**(2.5). 원본 21곳 사용은 부채(15) |
| 강조 글자 `text.brand` | 4.5 | 빨강 4.44 on hanji / 4.80 on bright → 카드(bright) 위 또는 14px 800 이상 |
| 링크 | 4.5 | 파랑 5.8 + 밑줄 |
| 버튼 글자 | 4.5 | hanji.bright on 빨강 4.8 / 파랑 6.3. Myeongjo 14/800 |
| 등급 라벨 | 3(비텍스트) / 4.5(텍스트) | rare 파랑·epic 진빨강·unique 보라 통과. **legend 금(1.4)·common 갈색(3.6)은 한지 위 글자로 미달** → 라벨 글자는 ink, 색은 테두리·띠. 무대에서는 금 10.7 |
| 노랑·금·jade·persimmon | | 글자 단독 금지. 띠·아이콘·글로우 |
| 칩 테두리·글자 | 3 | red 4.8·blue 6.3·jade 3.75·plum 6.7 통과, yellow 는 deep(2.9) → 아이콘·굵기 동반 |
| 포커스 링 | 3 | 파랑 5.8 |
| 먹선 | 3 | ink 15 |
| 무대 위 글자 | 4.5 | hanji.bright on #1A1611 16.5 |

## 2. 색 이외의 신호
- **등급은 풀네임 텍스트 병기**(색만 금지). 카드 프레임 색 + Cinzel 라벨 + 한국어명 + 한자 도장 네 겹.
- Unique 는 색 + 시즌 키워드("겨울 철원").
- 연출 강도가 등급 정보를 나르면 텍스트 보완(BannerRank `aria-live`).
- 링크 밑줄. 활성 탭 밑줄 + `aria-selected`. 활성 네비 `aria-current`.
- 오방색 띠·도장은 장식 → `aria-hidden`.

## 3. 시맨틱·ARIA (원본 표)
| 요소 | 규칙 |
|---|---|
| 인터랙티브 | `<button>`/`<a>`/`<input>`/`<dialog>`. `<div onClick>` 금지. 중첩 금지(`<a>` 안 `<button>`) — 카드 전체 링크는 `::after { inset: 0 }` |
| 이름 순서 | `aria-labelledby` > `aria-label` > `<label>` > placeholder > 내용. placeholder 는 라벨 대체 아님 |
| 폼 | `<form>` + `type="submit"`. 단순 버튼 `type="button"` 명시 |
| 탭 | `role="tablist"/"tab"` + `aria-selected` + 비활성 패널 `hidden`. 아이콘 탭 `aria-label` |
| 모달 | `<dialog>` + `showModal()`(포커스 이동·제한·ESC 자동) |
| 시트 | `role="dialog" aria-modal` + 포커스 관리 + 닫기 버튼 |
| 아코디언 | `<details>/<summary>` 또는 `aria-expanded` + `aria-controls` + `hidden` |
| 스위치 | `role="switch"` + `aria-checked`(켜짐/꺼짐) |
| 라디오·체크 | `<fieldset><legend>` + `<label>` |
| 로딩 | `aria-busy`. 토스트·배너 `role="status" aria-live="polite"` |
| 캡슐 | `role="img" aria-label="Rare 캡슐"` 또는 장식이면 `aria-hidden` |
| 카드 뒤집기 | `<button aria-pressed>` 또는 `aria-expanded`, Enter/Space |
| 도감 셀 | `<button aria-label="보령 · Rare · 수집함">`, 잠금 `aria-disabled` + 이유 |
| 이미지 | 정보 이미지 `alt="머드축제 保寧 풍경"`, 장식 `alt=""`, 텍스트 옆 중복 아이콘 `alt=""`, 아이콘 버튼 `aria-label="검색"`(단어만) |
| 로고 | `alt="여행가쟈"`, 옆에 텍스트 있으면 `alt=""` |
| 랜드마크 | 셸 `<header>` `<main>` `<nav aria-label="주 메뉴">` |

## 4. 포커스·키보드
- `:focus-visible` 파랑 2px offset 3 전역. `outline: none` 금지.
- 포커스 순서 = 시각 순서. 셸: 띠(장식) → 헤더 → 본문 → CTA → 탭바.
- 다이얼로그·시트 포커스 트랩, 닫힘 후 복귀. 무대 연출 중 포커스는 "건너뛰기"(있을 때).
- 카드 flip·캡슐 개봉 Enter/Space. 도감 그리드 방향키 이동 권장.
- 스킵 링크 "본문으로".

## 5. 터치
44×44 최소(`size.touch-target-min`). 버튼 md 40 은 BottomCta 패딩·행 높이로 확보, 헤더 액션 44, 탭바 항목 ≥44, 칩 28 은 상하 8 패딩 영역. 인접 8. 스와이프(시트 닫기)는 버튼 대안.

## 6. 모션
전역 가드(1ms)로 모든 애니메이션 자동 보호. 연출은 정보를 색·라벨로 대체. 자동 진행(무대 3막)은 reduced-motion 에서도 진행하되 흔들림 없이. 무한 반복(부유·펄스)은 홈 캡슐·Legendary 셀·무대만.

## 7. 확대·반응형
375 손실 없음(Bright Line 10). 200% 확대 시 프레임 셸 안 가로 스크롤 없음(`w-*` 기둥 + rem). 카피는 한 줄에 — 넘치면 문구를 줄인다. `user-scalable=no` 금지.

## 8. 검사
- Storybook `addon-a11y` 위반 0건(스토리마다). 미설치면 이 체크리스트 수동 + "동적 a11y 미검증" 보고.
- `npm run lint`(jsx-a11y). 안 돌면 보고(통과 가정 금지).
- axe color-contrast 가 `--ink-4` 를 잡는다 — 부채 항목이라 새 코드는 ink-2 이상.

## 9. 출시 전 체크
- [ ] 등급 풀네임 병기, 알파벳 단독 0
- [ ] `<div onClick>` 0, 중첩 인터랙티브 0
- [ ] 아이콘 버튼 `aria-label`, 이미지 alt
- [ ] 다이얼로그 `<dialog>`·시트 포커스 관리
- [ ] Tab 순회 + 포커스 링 항상 보임
- [ ] `ink-4` 글자 0(신규 코드)
- [ ] 375 한 줄 카피, 200% 확대
- [ ] a11y 애드온·lint 통과 또는 미검증 보고
- [ ] reduced-motion 에서 등급·결과가 텍스트로 전달
