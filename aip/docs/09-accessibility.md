# 09 · 접근성 (AIP)

선택 사항이 아니다. 아래 중 **빌드·테스트가 막는 것**과 **사람이 확인할 것**을 나눠 적었다.

## 1. 기계가 막는 것

| 항목 | 어디서 | 기준 |
|---|---|---|
| 글자 대비 | `node tokens/build.mjs` | 4.5:1 (라이트·다크 310쌍: 모든 면 위 글자, 버튼 전 상태, 콜아웃 안 링크, 코드 구문 7종, 다이어그램 노드 글자) |
| 비텍스트 대비 | 같음 | 3:1 (인풋 경계·체크박스·포커스 링·다이어그램 테두리와 선·줄 번호) |
| 하드코딩 값 | 같음(components lint) | hex·rgb·px·ms·z-index 숫자 0건 |
| 아이콘 버튼 이름 | `npm test` | `.aip-icon-button` 에 `aria-label` |
| 이미지 대체 텍스트 | `npm test` | examples 의 `<img>` 전부 `alt` 속성(장식이면 빈 값) |
| 키보드 동작 | `scripts/aip-interaction.check.mjs`(Chrome) | 탭 화살표·메뉴 Esc 포커스 복귀·다이얼로그 포커스 복귀·검색 ⌘K·복사 결과 |

## 2. 포커스

- 전역 `:focus-visible` = 2px `interactive.focus-ring` + offset 2px. **지우지 않는다.** 바꿀 때도 같은 두께·색을 유지한다.
- 인풋은 바깥 링 대신 안쪽 2px(테두리 + inset). 탭·코드 탭·TOC·메뉴 항목처럼 촘촘한 곳은 offset 을 음수로 안쪽에 그린다.
- 모든 페이지 첫 요소는 `.aip-skip-link`(첫 Tab 에 나타남) → `main#main`(`tabindex="-1"`).
- 다이얼로그·드로어·검색은 닫히면 연 요소로 포커스가 돌아간다.

## 3. 키보드

| 컴포넌트 | 키 |
|---|---|
| Tabs·Code Tabs | ←→ 이동 = 선택, Home·End. 탭 목록에 Tab 한 번 |
| Segmented·Radio | ←→↑↓ (네이티브) |
| Dropdown | ↓·↑ 로 열기, ↑↓ Home End, 글자 점프, Enter, Esc(트리거로 복귀), Tab(닫기) |
| Dialog·Drawer | Tab 이 안에 갇힘, Esc 닫기 |
| Search | ⌘K·Ctrl+K·`/` 열기, ↑↓, Enter, Esc |
| 코드 블록·표 래퍼·다이어그램 | `tabindex="0"` 이라 포커스 후 화살표로 가로 스크롤 |
| Tooltip | 포커스에 즉시, Esc 로 닫힘 |

## 4. 색에만 의존하지 않는다

| 상태 | 색 외의 신호 |
|---|---|
| 콜아웃 종류 | 아이콘 + 제목 단어 |
| 링크 | 밑줄(본문) 또는 → (단독) |
| 활성 탭·현재 페이지·현재 TOC | 2~3px 막대 + 굵기 |
| 오류 인풋 | 아이콘 + 문구 + `aria-invalid` |
| diff | `+` `−` 기호 |
| 성숙도·상태 배지 | 단어 |
| required/optional | 단어 |
| 다이어그램 개념 | 노드 라벨 + 모양(데이터 원통, external 점선) + 범례 + 텍스트 설명 |
| 거부 선 | 점선 + "deny" 라벨 |

## 5. 시맨틱 구조

- 랜드마크: `header` · `nav[aria-label]`(여러 개면 이름이 달라야 한다: Main·Documentation·On this page·Breadcrumb) · `main` · `aside` · `footer`.
- 제목은 h1 하나, 순서대로.
- 선택지 묶음은 `fieldset`+`legend`, 정의는 `dl`, 순서는 `ol`, 그림은 `figure`.
- 상태는 ARIA 속성(`aria-current` `aria-selected` `aria-expanded` `aria-invalid` `aria-busy`). 클래스로 상태를 따로 만들지 않는다.
- 결과·확인 문구는 `role="status"`(정중한 알림). 실패 중 즉시 알려야 하는 것만 `role="alert"`.

## 6. 터치·크기

- 터치 대상 최소 44px. sm(32)·xs(24) 버튼과 복사 버튼은 `pointer: coarse` 에서 보이지 않는 히트 영역이 8px 씩 커진다.
- 폼 인풋은 16px(iOS 확대 방지). 글자 하한 12px.
- 200% 확대에서 가로 스크롤 없이(표·코드·다이어그램 래퍼 제외) 읽힌다.

## 7. 모션

`prefers-reduced-motion` 은 05 §3. 자동 재생·깜빡임 없음.

## 8. 출시 전 사람이 확인할 것

- [ ] 키보드만으로 문서 → 검색 → 결과 열기 → 코드 복사 → 언어 탭 바꾸기
- [ ] VoiceOver/NVDA 로 TOC·코드 탭·파라미터 목록이 구조대로 읽힌다
- [ ] 다크·라이트 각각 콜아웃·코드·다이어그램을 눈으로 확인
- [ ] 390px 폭에서 가로 스크롤 0(`examples/*.html` 은 검사 스크립트가 측정)
- [ ] 강제 색상 모드(Windows High Contrast)에서 포커스와 버튼 경계가 보인다

## 9. 알려진 한계

- `prefers-contrast: more` 전용 토큰은 없다(기본 대비가 이미 AA 이상).
- 강제 색상 모드는 브라우저 기본 처리에 맡겼다. inset box-shadow 로 그린 콜아웃 바는 사라지지만 아이콘·제목 단어가 남는다.
