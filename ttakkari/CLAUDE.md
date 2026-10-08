# Ttakkari Design System — AI 에이전트 규칙

이 디렉터리(또는 이 시스템을 쓰는 Ttakkari 프론트 `winterholic-ttakkari/front`)에서 UI 를 만들거나 고칠 때 따른다.

## 시작할 때
1. `docs/00-decision-guide.md` 를 읽는다. 상황별 토큰·클래스가 표로 있다. 애매하면 `docs/17-situations.md`.
2. 화면이 어느 영역인지 정하고 `examples/` 의 가장 가까운 템플릿(chat·workspace·library·files·auth)을 기준으로 시작한다. 셸은 `docs/14-page-patterns.md`.
3. 마크업은 `docs/06-components.md`(core) · `07-chat.md` · `08-run-approval.md` · `09-artifact-viewer.md` 의 계약을 그대로 쓴다.
4. React 로 만들면 `docs/19-react-integration.md`. tk.js 는 React 트리에서 쓰지 않고 같은 동작 계약을 구현한다.

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
- 모바일 퍼스트: lg 미만은 탭바·바텀 시트·전체 화면 뷰어, `viewport-fit=cover`.
- 다크 분기(`dark:`·`prefers-color-scheme`)를 컴포넌트에 쓰지 않는다. 토큰이 처리한다.

## 하지 않는다
- hex·rgb()·색 이름·임의 px(13px·18px)·`z-index: 999`·`transition: all`·`ease-in-out`·`!important`.
- 민트 글로우·네온·그라데이션·글래스·반짝이(sparkles) 아이콘으로 'AI 느낌'.
- primary 버튼 둘. 끝난 작업을 크게 축하. 승인 요청을 빨강으로. 민감 자료를 빨강으로(plum).
- 기존 블록·글자 역할과 같은 이름의 새 클래스(빌드가 막는다: `.tk-grid` 사고).
- 토큰이 없다고 값을 새로 만들기. `docs/15` §2 절차로 추가하거나 `/* TODO(ds): 이유 */`.
- 사용자 시드 13색(`brand.*`·`seed.*`) 변경.

## 토큰·컴포넌트를 고칠 때
`tokens/src/*.json` 또는 `components/*.css`·`tk.js` 편집 → `node tokens/build.mjs`(실패 메시지를 **값으로** 해결) → `docs/00` 표와 해당 문서 → `examples/preview.html` → `npm test` → 화면이면 `npm run check:ui` → `CHANGELOG.md`.
`tokens/src/palette.json`·`tokens/tokens*.json`·`dist/` 는 생성물이라 직접 고치지 않는다.

## 완료 전 확인
```bash
node tokens/build.mjs                                                            # ok · … (all pass) · … lint clean
grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,ts,jsx}             # 0건(소비 프로젝트)
grep -rn "dark:" src                                                             # 0건
```
결과 줄을 응답에 붙인다.
