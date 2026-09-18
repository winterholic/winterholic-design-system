# 08 · 접근성 바닥선

목표는 WCAG 2.2 AA. 토큰과 컴포넌트 규격에 이미 심어 두었으니 시스템대로 쓰면 대부분 통과한다. 아래는 코드에서 직접 챙겨야 하는 것.

## 1. 대비 (토큰이 보장)

| 대상 | 기준 | 시스템에서 |
|---|---|---|
| 본문 글자 | 4.5:1 | `text.primary/secondary/tertiary` 전부 통과. tertiary(4.76)가 하한 |
| 큰 글자(24px 이상 또는 18.66px bold) | 3:1 | display 에 `text.brand` 등 |
| 아이콘·테두리·포커스 링 | 3:1 | `status.*.icon`, `border.input-strict`, `focus-ring` 통과 |
| 비활성 | 예외 | `text.disabled` |
| 플레이스홀더 | 4.5:1 (글자다) | `text.placeholder` = neutral.600 |

빌드가 86쌍을 자동 검사한다(`dist/contrast-report.json`). 새 조합을 쓰면 `build.mjs` `pairs` 에 넣어 검사망에 올린다.

**주의 지점**
- `border.strong`(인풋 테두리) 은 2.43:1 이다. 엄격 기준이 필요하면 `border.input-strict`.
- 그라데이션 위 글자는 가장 밝은 지점 기준. 04 §4.
- 이미지 위 글자는 `gradient.scrim-bottom` 필수.

## 2. 포커스

- `typography.css` 가 `:focus-visible` 에 2px 링 + 2px offset 을 전역으로 건다. **`outline: none` 을 쓰지 않는다.** 모양을 바꾸려면 `:focus-visible` 에서 토큰으로 다시 그린다.
- 인풋은 안쪽 링(offset 0) 이 어울린다: `outline-offset: 0` 또는 `box-shadow: 0 0 0 2px var(--wh-color-border-focus)`.
- 포커스 순서 = 시각 순서. `tabindex` 양수 금지.
- 모달·드로어: 포커스 트랩, 닫히면 열었던 요소로 복귀.
- 드롭다운·메뉴: ↑↓ 이동, Home/End, Esc, 타이핑 점프.
- 커스텀 컴포넌트에서 `div onClick` 금지 → `<button>` 또는 `role="button" tabindex="0"` + Enter/Space 처리.
- 스킵 링크: 페이지 첫 요소로 "본문으로 건너뛰기"(포커스 시만 보임).

## 3. 터치·클릭 영역

- 최소 44×44 (`size.touch-target-min`). 시각 크기가 작아도 패딩·pseudo-element 로 확보.
- 인접 타깃 사이 최소 8px(`space.2`).
- 표 액션 아이콘 버튼(xs 24) 은 셀 패딩으로 44 확보되는지 확인.

## 4. 시맨틱 HTML

| 요소 | 규칙 |
|---|---|
| 제목 | `<h1>` 페이지당 1개, 단계 건너뛰지 않기. 모양은 클래스로 |
| 버튼 vs 링크 | 동작은 `<button>`, 이동은 `<a href>`. 새 탭은 아이콘 + `rel="noopener"` |
| 폼 | 모든 인풋에 `<label for>`. 그룹은 `<fieldset><legend>`. 오류는 `aria-invalid` + `aria-describedby` |
| 아이콘 버튼 | `aria-label` 필수. 장식 아이콘은 `aria-hidden="true"` |
| 이미지 | 내용 이미지 `alt` 서술, 장식 `alt=""` |
| 표 | `<th scope>`, `<caption>` 또는 `aria-label` |
| 라이브 영역 | 토스트 `role="status"`(정보) / `role="alert"`(오류). 로딩 `aria-busy` |
| 모달 | `role="dialog" aria-modal="true" aria-labelledby` |
| 랜드마크 | `<header> <nav> <main> <aside> <footer>` 각 1개(nav 는 `aria-label` 로 구분) |

## 5. 색 이외의 신호

- 상태는 색 + 아이콘 + 문구. 초록 도트만으로 "온라인" 표시 ❌ → 도트 + "온라인".
- 링크는 색 + 밑줄(최소 hover). 본문 안 링크는 항상 밑줄.
- 필수 표시 `*` 에 `aria-label="필수"` 또는 라벨 텍스트에 "(필수)".
- 차트는 색 + 패턴 또는 직접 라벨. 11 참조.

## 6. 모션·시간

- `prefers-reduced-motion` 은 토큰이 처리. 직접 `@keyframes` 를 쓰면 미디어 쿼리 추가(05 §5).
- 자동 재생 캐러셀·무한 애니메이션에는 정지 버튼.
- 토스트 자동 닫힘: 정보 4초, 오류 8초, 액션 있으면 닫힘 없음. 시간 제한 있는 세션은 연장 안내.

## 7. 반응형·확대

- 200% 확대에서 가로 스크롤 없이 읽힌다(`rem` 단위, `max-width` 사용, 고정 높이 컨테이너 금지).
- 320px 폭에서 콘텐츠 손실 없음.
- `user-scalable=no` 금지. 인풋 16px 로 iOS 자동 확대 방지.

## 8. 다크모드·고대비

- 다크 시맨틱도 같은 대비 기준을 통과한다(빌드 검사 대상).
- `prefers-contrast: more` 는 현재 별도 토큰이 없다. 필요해지면 `border.*` 를 한 단계 진하게 하는 오버라이드 블록을 `tokens.css` 에 추가한다(13 거버넌스).

## 9. 출시 전 체크

- [ ] Tab 만으로 모든 기능 도달·실행, 포커스 링 항상 보임
- [ ] 스크린리더로 페이지 제목·랜드마크·폼 라벨 읽힘 (NVDA/VoiceOver 1회)
- [ ] 200% 확대 가로 스크롤 없음
- [ ] 색 빼고(그레이스케일) 봐도 상태 구분됨
- [ ] 모든 이미지 alt, 모든 아이콘 버튼 aria-label
- [ ] 자동 검사 도구(axe DevTools 또는 Lighthouse 접근성) 심각·중대 0
- [ ] reduced-motion 켜고 애니메이션 확인
