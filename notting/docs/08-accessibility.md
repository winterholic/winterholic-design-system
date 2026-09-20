# 08 · 접근성 바닥선 (notting)

목표는 WCAG 2.2 AA. 토큰과 컴포넌트 규격에 심어 두었으니 시스템대로 쓰면 대부분 통과한다. 아래는 코드에서 직접 챙겨야 하는 것. 에디터·드래그·스트리밍처럼 notting 에 특유한 항목은 §3·§5·§6.

## 1. 대비 (토큰이 보장)

| 대상 | 기준 | 시스템에서 |
|---|---|---|
| 본문 글자 | 4.5:1 | `text.primary/secondary/tertiary` 흰·종이 면 위 전부 통과. tertiary(4.95 / 4.75)가 하한 |
| 큰 글자 | 3:1 | display·prose-title |
| 아이콘·테두리·포커스 링·마커 | 3:1 | `status.*.icon` `fidelity.*.solid` `priority.*` `citation.marker` `drop-indicator` `focus-ring` 통과 |
| 코드 하이라이트 | 4.5:1 | `code.keyword/string/number/function/comment` 을 `code.bg` 위에서 빌드가 검사(라이트·다크) |
| 하이라이트 위 글자 | 4.5:1 | `mark.highlight-text` on `mark.highlight` |
| 근거 칩 | 4.5:1 | `citation.text` on `bg`·`bg-hover`·stale |
| 도메인 필 | 4.5:1 | `workflow/decision/fidelity.*.text` on `.bg` 전부 |
| 비활성 | 예외 | `text.disabled` |

빌드가 210쌍을 검사한다(`dist/contrast-report.json`). 새 조합을 쓰면 `build.mjs` `pairs` 에 넣는다.

**주의 지점**
- `border.strong`(인풋) 2.43:1. 엄격 기준이면 `input-strict`.
- `text.tertiary` 를 `surface.sunken` 위에 두면 4.20 으로 미달. **sunken 면 위 작은 글자는 `secondary`**(표 헤더·kbd 가 그렇다).
- `brand` 그라데이션 periwinkle 끝에 흰 글자 2.81. 글자는 시작점 쪽.
- 커버 이미지 위 제목은 `scrim-bottom` 필수.

## 2. 포커스

- `typography.css` 가 `:focus-visible` 에 2px 링 + offset 2 를 전역으로. `outline: none` 금지.
- 인풋·에디터 블록은 안쪽 링(offset 0).
- 포커스 순서 = 시각 순서. `tabindex` 양수 금지.
- 모달·팔레트·드로어: 트랩, 닫히면 열었던 요소로 복귀. **패널(고정)은 트랩하지 않는다** — 에디터와 오갈 수 있어야 한다.
- 슬래시 메뉴·멘션 목록: `aria-expanded` + `aria-activedescendant`, 포커스는 에디터에 남고 ↑↓ 로 가상 포커스.
- 스킵 링크: "본문으로 건너뛰기" + "사이드바로" 두 개.

## 3. 에디터

| 항목 | 규칙 |
|---|---|
| 루트 | `role="textbox" aria-multiline="true" aria-label="{페이지 제목} 본문"` |
| 블록 핸들 | `<button aria-label="블록 옵션">`, 메뉴 `role="menu"`. hover 로만 보이지 않게 **포커스 시에도** 표시 |
| 드래그 | 키보드 대안 필수: 핸들 포커스 → Alt+↑/↓ 이동, Alt+←/→ 들여쓰기. 이동 결과를 `aria-live="polite"` 로 "블록을 3번째로 옮겼어요" |
| 블록 선택 | Esc 로 텍스트 편집 ↔ 블록 선택, Shift+↑↓ 확장, 선택 수를 live 로 |
| 슬래시 메뉴 | 열림·항목 수를 live 로 |
| 플레이스홀더 | `data-placeholder` 는 장식. 실제 라벨은 `aria-label` |
| 인라인 툴바 | `role="toolbar"`, 버튼 `aria-pressed`. 키보드 선택 시 안 뜨므로 단축키 목록을 도움말에 |
| task 체크박스 | `<input type="checkbox">` 그대로(커스텀 div 금지). 라벨은 항목 텍스트 |
| 코드 블록 | `<pre><code>` + 언어 `aria-label`. 복사 버튼 `aria-label="코드 복사"` |
| 콜아웃 | 아이콘 `aria-hidden`, 상태형은 `role="note"` |
| 토글 | `<details><summary>` 네이티브 |
| 표 | `<table>` + `<th scope>`. 헤더 행 필수 |

## 4. 시맨틱 HTML

| 요소 | 규칙 |
|---|---|
| 제목 | 앱 화면 `<h1>` 1개. 문서 안에서는 페이지 제목이 `<h1>`, 문서 h1 은 `<h2>` 부터(스크린리더 아웃라인) — 시각은 `prose-h1`. 클래스와 태그 분리 |
| 버튼 vs 링크 | 동작 `<button>`, 이동 `<a href>`. 근거 칩은 이동이므로 `<a>` |
| 트리 | `role="tree"` / `treeitem` / `aria-expanded` / `aria-level` |
| 보드 | 컬럼 `role="list"` + 카드 `listitem`. 드래그 키보드 대안(Space 집기, ←→ 컬럼, Space 놓기) |
| 폼 | `<label for>`, `aria-invalid` + `aria-describedby` |
| 아이콘 버튼 | `aria-label` 필수 |
| 라이브 영역 | 토스트 `role="status"`/`"alert"`. 저장 상태 `aria-live="polite"`(변할 때만). **AI 스트리밍은 `aria-live` 금지** — 토큰마다 읽는다. 완료 시 한 번 "답변 완료, 근거 3개" |
| 모달 | `role="dialog" aria-modal aria-labelledby` |
| 랜드마크 | `<header>`(툴바) `<nav>`(사이드바 `aria-label="페이지"`) `<main>`(에디터) `<aside>`(패널 `aria-label`) |

## 5. 색 이외의 신호

- 상태 필: 색 + 아이콘(원 채움 정도) + 라벨. 15 §6.
- 왕복 등급: 색 + 도트 + 등급 이름 + 개수.
- diff: 색 + `+ − ~` 기호.
- 우선순위: 색 + 막대 개수.
- AI 가 만든 것: 색(periwinkle) + sparkles 아이콘 + "AI" 라벨·배지. 셋 중 둘 이상.
- 근거 오래됨: 색 + 툴팁 문구 + 아이콘 `history`.
- 링크: 밑줄.
- 차트: 11.

## 6. 모션·시간

- `prefers-reduced-motion` 은 토큰이 처리. 직접 `@keyframes` 는 05 §5.
- AI 스트리밍 커서·shimmer 는 reduced-motion 에서 정지.
- 토스트: 4초/8초/액션 있으면 무한. 저장 실패 배너는 닫기 전까지.
- 자동 저장 디바운스는 사용자에게 시간 제한이 아니다(항상 로컬 보관).

## 7. 반응형·확대

- 200% 확대에서 가로 스크롤 없이(코드 블록·표는 자체 스크롤). `rem`·`max-width`.
- 320px 폭에서 에디터 편집 가능(gutter 숨김, 길게 누르기).
- `user-scalable=no` 금지. 에디터 16px.

## 8. 다크모드·고대비

- 다크 시맨틱도 같은 기준 통과(빌드 검사).
- `prefers-contrast: more` 토큰 없음. 필요해지면 `border.*` 한 단계 진하게 + `text.tertiary` → `secondary` 오버라이드 블록(13).

## 9. 출시 전 체크

- [ ] Tab 만으로 사이드바 → 툴바 → 에디터 → 패널 도달, 포커스 링 항상 보임
- [ ] 키보드만으로 블록 만들기·이동·들여쓰기·삭제, 슬래시 메뉴 사용
- [ ] 스크린리더로 페이지 제목·랜드마크·트리·속성 읽힘 (NVDA/VoiceOver 1회)
- [ ] AI 답변 스트리밍 중 스크린리더가 폭주하지 않음, 완료 알림 1회
- [ ] 200% 확대 가로 스크롤 없음
- [ ] 그레이스케일로 봐도 상태·등급·AI 여부 구분됨
- [ ] 모든 이미지 alt, 모든 아이콘 버튼 aria-label
- [ ] axe 또는 Lighthouse 심각·중대 0
- [ ] reduced-motion 켜고 확인
- [ ] 다크에서 `#fff` 면·hex 0건 (`grep`)
