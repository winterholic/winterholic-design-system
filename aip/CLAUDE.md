# AIP Design System — AI 에이전트 규칙

이 디렉터리(또는 이 시스템을 쓰는 AIP 제품: 홈페이지·Docs·MakeAIP·Playground)에서 UI 를 만들거나 고칠 때 따른다.

## 시작할 때
1. `docs/00-decision-guide.md` 를 읽는다. 상황별 토큰·클래스가 표로 있다.
2. 화면이 어느 제품인지 정하고 `examples/` 의 가장 가까운 템플릿(home·docs·makeaip·playground)을 복사해서 시작한다. 셸·간격은 `docs/13-page-patterns.md`.
3. 컴포넌트 마크업은 `docs/06-components.md`(core), 문서 화면이면 `docs/07-documentation.md`. 여기 있는 마크업 계약을 그대로 쓴다.
4. 구조 그림이면 `docs/12-diagrams.md`. 상황이 애매하면 `docs/16-situations.md`.

## 반드시
- 값은 **토큰만**: `var(--aip-…)`, 컴포넌트 클래스(`.aip-*`), Tailwind 프리셋, 또는 `tokens.js` 의 `.var`.
- 색은 시맨틱만(`color.surface.* text.* border.* action.* status.* interactive.*` + `highlight.* code.* lifecycle.* diagram.*`).
- 글자는 `typography` 클래스(`.aip-body-md` 등) 중 하나. 문서 본문은 `<article class="aip-doc">` 에 Markdown 렌더 결과를 넣고 `prose.css` 에 맡긴다.
- 컴포넌트는 **기본 클래스가 정답**이다(`.aip-button` = secondary·md). modifier 는 정말 다를 때만.
- 상태는 ARIA 속성으로(`aria-current` `aria-selected` `aria-expanded` `aria-invalid` `aria-busy`). 동작은 `aip.js` 의 `data-aip-*` 속성으로 연결.
- 콜아웃은 GFM 다섯 이름(note·tip·important·warning·caution)만.
- 같은 코드의 언어별 예시는 Code Tabs + `data-aip-sync="language"`, 값은 `ts`·`py`.
- 문서 페이지: h1 하나 + `.aip-doc-lead`, h2·h3 에 안정 id, 그림마다 텍스트 설명, 정의는 Spec block, 인자는 Parameter rows.
- 다이어그램 노드는 `data-role`(intent·runtime·execution·permission·frontend·backend·data·external·note), 선은 `data-edge`.
- 아이콘 버튼에 `aria-label`. 이미지에 `alt`. 포커스 링 유지. 터치 44px.
- 다크 분기(`dark:`·`prefers-color-scheme`)를 컴포넌트에 쓰지 않는다. 토큰이 처리한다.

## 하지 않는다
- hex·rgb()·색 이름·임의 px(13px·18px)·`z-index: 999`·`transition: all`·`ease-in-out`·`!important`.
- AIP Tangerine·Yellow 를 흰 면 위 글자로. 노랑을 경고로. 빨강·초록을 다이어그램 노드 면으로.
- primary 버튼 둘. 그라데이션·글로우·글래스·보라 네온. 카드 상시 그림자. 문서 안 카드. h5 이상 깊이.
- 외부 코드 하이라이트 테마 CSS(매핑은 prose.css·components.css 에 있다).
- AIP 의 정의 문법을 정본처럼 쓰기. 예제 코드에는 "illustrative" 를 붙인다(AIP 문법은 미정).
- 토큰이 없다고 값을 새로 만들기. `docs/14` §2 절차로 추가하거나 `/* TODO(ds): 이유 */`.

## 토큰·컴포넌트를 고칠 때
`tokens/src/*.json` 또는 `components/*.css` 편집 → `node tokens/build.mjs`(참조·라이트/다크·대비·lint 실패 메시지를 값으로 해결) → `docs/00` 표와 해당 문서 → `examples/preview.html` → `npm test` → `CHANGELOG.md`.
`tokens/src/palette.json`·`tokens/tokens*.json`·`dist/` 는 생성물이라 직접 고치지 않는다.

## 완료 전 확인
```bash
node tokens/build.mjs                                                          # ok · … (all pass) · … lint clean
grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,jsx,vue,svelte}   # 0건(소비 프로젝트)
grep -rn "dark:" src                                                           # 0건
```
결과 줄을 응답에 붙인다.
