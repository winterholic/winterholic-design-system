# winterholic-base — AI 에이전트 규칙

이 디렉터리(또는 이 시스템을 쓰는 프로젝트)에서 UI 를 만들거나 고칠 때 따른다.

## 시작할 때
1. `docs/00-decision-guide.md` 를 읽는다. 상황별 토큰이 표로 있다.
2. 만드는 화면 유형이 `docs/12-page-patterns.md` 에 있으면 그 골격에서 시작한다.
3. 컴포넌트 규격은 `docs/06-components.md`. 여기 없는 컴포넌트는 §16 조립 규칙.

## 반드시
- 색·간격·글자·radius·그림자·z-index·duration 은 **토큰만** 쓴다. CSS 변수 `var(--wh-…)`, Tailwind 프리셋 클래스, 또는 `tokens.js` 의 `.var`.
- 색은 **시맨틱**(`color.surface.*` `color.text.*` `color.border.*` `color.action.*` `color.status.*` `color.interactive.*`)만. 원시 램프(`--wh-blue-500`)는 차트 초과·정적 이미지 예외에서만.
- 글자는 `typography.*` 스타일(`.wh-body-md` 등) 중 하나. 즉석 `font-size` 조합 금지.
- 컴포넌트는 상태 6종(default·hover·active·focus-visible·disabled·loading)을 전부 구현한다.
- 화면은 로딩(스켈레톤)·빈 상태·오류 상태를 함께 만든다(`docs/07`).
- 포커스 링을 지우지 않는다(`outline: none` 금지). 아이콘 버튼에 `aria-label`. 터치 44px.
- 다크모드 분기(`dark:`, `prefers-color-scheme`)를 컴포넌트에 쓰지 않는다. 토큰이 처리한다.

## 하지 않는다
- hex(`#…`), `rgb()`, 임의 px(13px·18px·25px), `z-index: 999`, `transition: all`, `ease-in-out` 키워드.
- primary 버튼 두 개 나란히. 노란 배지에 흰 글자. `#2081C3` 글자색(4.21:1 미달 → `text.brand`).
- 파이 차트, 이중 y축, 그라데이션 버튼, 카드 안 카드.
- 토큰이 없다고 값을 새로 만들지 않는다. 가까운 토큰을 쓰거나 `docs/13` 절차로 추가한다. 급하면 `/* TODO(ds): 이유 */`.

## 토큰을 고칠 때
`tokens/src/*.json` 만 편집 → `node tokens/build.mjs` → 실패 메시지(참조·라이트/다크 불일치·대비)를 값을 고쳐 해결 → `docs/00` 표 갱신 → `examples/preview.html` 갱신 → `CHANGELOG.md`.
`tokens/src/palette.json` 과 `dist/` 는 생성물이라 직접 편집하지 않는다.

## 완료 전 확인
```bash
node tokens/build.mjs                                   # 토큰을 건드렸다면
grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.{css,scss,tsx,jsx,vue}   # 0건
grep -rn "dark:" src/                                   # 0건
```
결과 줄을 응답에 붙인다.
