# 08 · 접근성 (memoir)

목표 WCAG 2.2 AA. No-Line·글래스·핑크 원색이라는 memoir 의 선택이 접근성과 충돌하는 지점을 토큰이 미리 막는다.

## 1. 대비 (빌드가 116쌍 검사)
| 대상 | 기준 | 시스템에서 |
|---|---|---|
| 흰·크림·zone 면 위 글자 | 4.5 | `text.primary/secondary/tertiary` 전부 통과. tertiary 는 크림 위 6.2 |
| 핑크·블러시 배경 위 글자 | 4.5 | `text.on-pink`(wine) 만. 흰 글자 금지 |
| 로즈 버튼 | 4.5 | 흰 글자 6.48 |
| 페리윙클 활성 메뉴 | 2.9 (UI 컴포넌트 3 근접) | 흰 글자 2.95. 라벨 14px/600 이상 + 체크 아이콘 동반. 엄격하면 `surface.interactive` 를 indigo 로 |
| 코드 블록 | 4.5 | `code.text` on `code.bg` 통과, comment 3 이상 |
| 링크 | 4.5 | indigo 6.44 + 밑줄(hover 시라도) |
| 포커스 링 | 3 | indigo |
| 고스트 테두리 | 예외 | 장식. 구획은 면 차이로 |

**No-Line 의 함정**: 면 차이(#FFF9F8 vs #FFFFFF, 1.04:1)는 저시력·저품질 디스플레이에서 안 보인다. 구획이 **정보**일 때(선택 상태·그룹 경계)는 면 차이에만 의존하지 않는다. 제목·간격·아이콘을 같이 준다. `prefers-contrast: more` 에서는 `border.ghost` 를 켜는 것을 권장(13 §6).

**글래스**: 뒤 내용이 비치면 글자 대비가 흔들린다. 모달은 80%(글자 있는 면), 벤토는 40% 이지만 글자 뒤에는 글래스 안 흰 미리보기 카드를 둔다.

## 2. 포커스·키보드
- `:focus-visible` 링 2px indigo 전역. `outline: none` 금지.
- 카테고리 드롭다운: 트리거 Enter/Space, ↑↓ 이동, Esc, `role="menu"`.
- 서브 헤더 칩: Tab 이동, Space 토글, `aria-pressed`(다중) / `role="tablist"`(단일).
- 카드 전체 클릭은 `<a>` 또는 `role="link"`, 안의 버튼은 별도 탭 스톱.
- 에디터: 슬래시 메뉴 ↑↓ Enter Esc, 블록 이동 Alt+↑↓, 포맷 단축키. 툴바 버튼 `aria-label`.
- 모달 포커스 트랩, 닫힘 후 트리거 복귀. 바텀시트도 같음.
- PIN: 자동 이동하되 Backspace 로 이전 칸, 붙여넣기 6자리 분배.
- 스킵 링크 "본문으로".

## 3. 터치
- 44 최소. 칩 28 은 서브 헤더 높이 44 안에서 상하 패딩으로 확보. 코드 카드 복사 xs 28 도 44 영역.
- FAB 56. 모바일 헤더 아이콘 버튼 44.

## 4. 시맨틱
| 요소 | 규칙 |
|---|---|
| 헤더 | `<header>` + `<nav aria-label="카테고리">`. 서브 헤더는 `<nav aria-label="필터">` 또는 `role="toolbar"` |
| 카드 | `<article>` + 제목 `<h3>`. 리스트는 `<ul>` |
| 코드 블록 | `<pre><code class="language-js">`, 복사 버튼 `aria-label="코드 복사"`, 복사 후 `role="status"` "복사됨" |
| 명령어 행 | `<code>` + 설명 `<p>` |
| 북마크 | `<a href target="_blank" rel="noopener">` + 새 탭 아이콘 + `aria-label` 에 도메인 |
| 영상 | 썸네일 `alt` = 제목, 길이 `<time>` |
| 보안 잠김 | 블러된 본문 `aria-hidden`, 자물쇠 버튼 `aria-label="인증하고 열기"` |
| 캘린더 | `<table>` + `<th scope>`, 오늘 `aria-current="date"`, 셀 버튼 `aria-label="9월 19일, 메모 2개"` |
| 체크리스트 | `<input type="checkbox">` + `<label>` |
| 에디터 | `contenteditable` + `role="textbox" aria-multiline`, 블록 손잡이 `aria-label` |
| 토스트 | `role="status"` / 오류 `role="alert"` |
| 저장 상태 | `aria-live="polite"` 한 곳(서브 헤더) |
| 로고 | `<a aria-label="memoir 나의 공간으로">` |

## 5. 색 이외의 신호
- 활성 칩: 색 + `aria-pressed`. 활성 메뉴: 색 + 체크 아이콘.
- 링크: 색 + 밑줄.
- 잠금: 블러 + 자물쇠 아이콘 + 문구.
- 카테고리 색 원: 색 + 이모지·아이콘.
- 히트맵: 셀 툴팁 + 숫자.

## 6. 모션
reduced-motion 에서 shake·blob·lock 0. 블롭은 정지. 랜딩 리빌 없음. 2FA 오류는 밑줄 + 문구가 전달.

## 7. 확대·반응형
200% 확대에서 헤더 두 줄이 겹치지 않게(메인 헤더 검색이 아이콘으로 접힘). 375 손실 없음. 인풋 16.

## 8. 출시 전 체크
- [ ] 핑크 배경 위 흰 글자 0건
- [ ] `border-b`·`divide-y`·`hr` 로 구획한 곳 0건 (캘린더 제외)
- [ ] Tab 만으로 헤더 → 드롭다운 → 칩 → 카드 → 카드 안 버튼 → FAB 순회
- [ ] 스크린리더로 카드 제목·태그·날짜, 잠긴 메모, 캘린더 셀 읽힘
- [ ] 200% 확대, 375px
- [ ] axe 심각·중대 0
- [ ] reduced-motion 에서 2FA 오류가 문구로 전달됨
