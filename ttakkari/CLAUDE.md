# Ttakkari Design System — AI 에이전트 규칙

이 디렉터리(또는 이 시스템을 쓰는 Ttakkari 프론트 `winterholic-ttakkari/front`)에서 UI 를 만들거나 고칠 때 따른다.

## 시작할 때
1. `docs/00-decision-guide.md` 를 읽는다. 상황별 토큰·클래스가 표로 있다. 애매하면 `docs/17-situations.md`.
2. 새 화면이면 **`docs/21-page-archetypes.md` 에서 아키타입을 먼저 고르고** `examples/archetypes/` 의 예제를 복사해서 시작한다(저장소·PR·자료 노트·연구 지표·글쓰기·그래프·시장·창작·원격 조종·갤러리). 기본 영역 5종(chat·workspace·library·files·auth)과 셸은 `docs/14-page-patterns.md`.
3. 마크업은 `docs/06-components.md`(core) · `07-chat.md` · `08-run-approval.md` · `09-artifact-viewer.md` 의 계약을 그대로 쓴다.
4. React 로 만들면 `docs/19-react-integration.md`. tk.js 는 React 트리에서 쓰지 않고 같은 동작 계약을 구현한다.
5. 데이터·도구 화면 부품(표·차트·diff·캔버스·에디터·원격 화면)은 `docs/24-data-workbench-components.md`, 화면이 깨질 때와 새 화면 전에는 `docs/22-ui-error-prevention.md`, 그림 자리는 `docs/23-illustration-assets.md`.

## 반드시
- 값은 **토큰만**: `var(--tk-…)`, 컴포넌트 클래스(`.tk-*`), Tailwind 프리셋, 또는 `tokens.js` 의 `.var`.
- 색은 시맨틱만(`color.surface.* text.* border.* action.* status.* interactive.*` + `agent.* run.* policy.* filetype.* ink.* viewer.* highlight.* presence.*`).
- **Blue 는 사람의 행동, Mint 는 에이전트의 존재.** 민트 원색은 밝은 면 위 글자·얇은 선으로 쓰지 않는다(1.35:1). 라이트의 에이전트 글자는 `text.agent`.
- 코드·로그·터미널 출력은 두 테마 모두 잉크 면(`.tk-code`·`.tk-log`·`color.ink.*`).
- 상태는 ARIA 속성으로(`aria-current` `aria-selected` `aria-pressed` `aria-expanded` `aria-invalid` `aria-busy` `aria-disabled`), 도메인 상태는 `data-state`(작업 6상태)·`data-policy`(정책 4종)·`data-type`(파일 계열).
- 에이전트의 일은 Run card(+Steps·Log), 사람의 허락은 Approval card, 결과물은 Artifact card → Viewer. 스피너 하나·토스트 승인·새 탭 열기로 대신하지 않는다.
- 컴포저는 한글 조합 중(`isComposing`·keyCode 229) Enter 를 보내지 않고, 터치 Enter 는 줄바꿈이다.
- HTML 결과물은 별도 출처 `iframe sandbox` + `.tk-frame__bar`. `allow-scripts` 와 `allow-same-origin` 을 함께 주지 않는다.
- 결과물은 Artifact ID 로 연다. 에이전트가 준 경로로 URL·다운로드를 만들지 않는다. 정책 표시는 서버 판정 그대로.
- 다운로드는 언제나 원본("원본 다운로드"). 미리보기를 못 만들면 상태 패널 + 원본 다운로드.
- 아이콘 버튼에 `aria-label`, 이미지에 `alt`, iframe 에 `sandbox`·`title`. 포커스 링 유지. 터치 44px, 모바일 주 행동 48. 툴팁에만 있는 정보 금지(터치에서 안 뜬다).
- 모바일 퍼스트: lg 미만은 탭바·가운데 모달(`.tk-dialog`)·전체 화면 뷰어, `viewport-fit=cover`. 앱은 바텀 시트를 쓰지 않는다(2026-10-13 결정).
- **간격은 부모가 정한다**: `.tk-stack`·`.tk-cluster`·`.tk-grid` 의 `gap`. 자식에 `margin-top` 으로 간격을 만들지 않는다(이중 간격). 탭 패널 등 중간 래퍼 안에는 바깥 gap 이 닿지 않으므로 각 묶음에 간격 소유자를 둔다(22 B11).
- 데스크톱 데이터 화면은 본문 가용 폭으로 열을 정한다(21 §6). 각 탭·메뉴·상세를 열고 정보 배치와 셸 높이 변경 전후를 확인한다(22 §5). 가로 넘침 0 만으로 화면 완성도를 보장하지 않는다. `100dvh` 는 키보드 대응 보장도 아니다(03 §5·19 §6).
- **폭은 안쪽에서 정하지 않는다**: flex·grid 자식은 `min-width: 0`, 데이터가 들어가는 버튼·칩·배지의 라벨은 `<span>` 으로 감싼다(말줄임), 넘치는 표·코드·그래프는 그 상자만 가로 스크롤, 말줄임에는 `title`.
- 터치 컨트롤은 44(히트 영역 포함), 입력은 16, 글자는 12 이상. 화면 끝에 닿는 고정 요소는 safe-area(위·아래·**가로 모드 좌우**)를 안다.
- 그래프·차트·캔버스는 같은 화면 안에 목록·표 대안을 둔다. 색만으로 상태·증감을 말하지 않는다.
- 다크 분기(`dark:`·`prefers-color-scheme`)를 컴포넌트에 쓰지 않는다. 토큰이 처리한다.

## 하지 않는다
- hex·rgb()·색 이름·임의 px(13px·18px)·`z-index: 999`·`transition: all`·`ease-in-out`·`!important`.
- 민트 글로우·네온·그라데이션·글래스·반짝이(sparkles) 아이콘으로 'AI 느낌'.
- primary 버튼 둘. 끝난 작업을 크게 축하. 승인 요청을 빨강으로. 민감 자료를 빨강으로(plum).
- 기존 블록·글자 역할과 같은 이름의 새 클래스(빌드가 막는다: `.tk-grid` 사고).
- 토큰이 없다고 값을 새로 만들기. `docs/15` §2 절차로 추가하거나 `/* TODO(ds): 이유 */`.
- 사용자 시드 13색(`brand.*`·`seed.*`) 변경.

## 토큰·컴포넌트를 고칠 때
`tokens/src/*.json` 또는 `components/*.css`·`tk.js` 편집 → `node tokens/build.mjs`(실패 메시지를 **값으로** 해결. 레이아웃 lint 예외는 규칙 본문에 `/* lint-ok: 이유 */`) → `docs/00` 표와 해당 문서(24) → `examples/preview.html` 또는 `examples/archetypes/` → `npm test` → 화면이면 `npm run check:ui` 와 `npm run check:layout`(위반 0) → `CHANGELOG.md`.
`tokens/src/palette.json`·`tokens/tokens*.json`·`dist/` 는 생성물이라 직접 고치지 않는다.

## 완료 전 확인
```bash
node tokens/build.mjs                                                            # ok · … (all pass) · … lint clean
npm run check:layout                                                              # 레이아웃 검사 … ok · 위반 0
grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,ts,jsx}             # 0건(소비 프로젝트)
grep -rn "dark:" src                                                             # 0건
```
결과 줄을 응답에 붙인다.
