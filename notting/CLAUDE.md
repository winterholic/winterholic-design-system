# notting — AI 에이전트 규칙

이 디렉터리(또는 이 시스템을 쓰는 notting 프로젝트)에서 UI 를 만들거나 고칠 때 따른다.

## 시작할 때
1. `docs/00-decision-guide.md` 를 읽는다. 상황별 토큰이 표로 있다.
2. 만드는 것이 notting 개념(블록·근거·왕복 보고서·Context Pack·이슈·ADR·revision)이면 `docs/15-product-mapping.md` 에서 그 개념의 규격을 찾는다.
3. 화면 유형이 `docs/12-page-patterns.md` 에 있으면 그 골격에서 시작한다.
4. 컴포넌트 규격은 `docs/06-components.md`(§17 부터 notting 전용). 없는 컴포넌트는 §34 조립 규칙.
5. 상황이 애매하면 `docs/16-situations.md` A~N.

## 반드시
- 색·간격·글자·radius·그림자·z-index·duration 은 **토큰만**. `var(--nt-…)`, Tailwind 프리셋 클래스, 또는 `tokens.js` 의 `.var`.
- 색은 **시맨틱**(`color.surface.*` `text.*` `border.*` `action.*` `status.*` `interactive.*` + 도메인 `ai.*` `citation.*` `mark.*` `diff.*` `workflow.*` `priority.*` `decision.*` `fidelity.*` `code.*`)만. 원시 램프(`--nt-teal-500`)는 차트 초과·정적 이미지 예외에서만.
- 글자는 `typography.*` 스타일(`.nt-body-md` 등) 중 하나. 문서 본문(에디터·읽기·Ask 답변)은 컨테이너에 `.nt-doc` 를 걸고 `prose.css` 에 맡긴다.
- **AI 가 만든 것은 반드시 periwinkle 로 표시한다**(`ai.*` 면·라벨·아이콘 중 둘 이상 + sparkles). 사람이 만든 것에는 periwinkle 을 쓰지 않는다.
- **손실을 숨기지 않는다.** Markdown 변환 경로에는 보고서(06 §28)가 연결되고, 손실 1건이면 모달, 0건이면 토스트.
- **근거 없는 AI 답변을 AI 면에 담지 않는다.** 근거 부족은 중립 면.
- 컴포넌트는 상태 6종(default·hover·active·focus-visible·disabled·loading)을 전부 구현한다.
- 화면은 로딩·빈·오류에 더해 **오프라인·충돌·읽기 전용**을 답한다(`docs/15` §8).
- 포커스 링을 지우지 않는다. 아이콘 버튼에 `aria-label`. 터치 44px. 드래그에는 키보드 대안.
- 다크모드 분기(`dark:`, `prefers-color-scheme`)를 컴포넌트에 쓰지 않는다. 토큰이 처리한다.

## 하지 않는다
- hex(`#…`), `rgb()`, 임의 px(13px·18px·25px), `z-index: 999`, `transition: all`, `ease-in-out` 키워드.
- primary 버튼 두 개 나란히(primary + ai 는 허용). ai 버튼에 sparkles 없이. 노란 배지에 흰 글자. `#1EA896` 글자색(2.96:1 미달 → `text.brand`).
- 정지 카드에 그림자. 문서 안 카드. 문서 안 h4. 외부 코드 하이라이트 테마 CSS. AI 스트리밍에 `aria-live`.
- 파이 차트, 이중 y축, 그라데이션 버튼.
- 토큰이 없다고 값을 새로 만들지 않는다. 가까운 토큰을 쓰거나 `docs/13` 절차로 추가한다. 급하면 `/* TODO(ds): 이유 */`.

## 토큰을 고칠 때
`tokens/src/*.json` 만 편집 → `node tokens/build.mjs` → 실패 메시지(참조·라이트/다크 불일치·대비)를 값을 고쳐 해결 → `docs/00` 표 갱신(notting 개념이면 `docs/15` 도) → `examples/preview.html` 갱신 → `CHANGELOG.md`.
`tokens/src/palette.json` 과 `dist/` 는 생성물이라 직접 편집하지 않는다.

## 완료 전 확인
```bash
node tokens/build.mjs                                   # 토큰을 건드렸다면
grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.{css,scss,tsx,jsx,vue}   # 0건
grep -rn "dark:" src/                                   # 0건
grep -rn "prism\|highlight.js\|hljs.*\.css" src/        # 0건 (테마 CSS)
```
결과 줄을 응답에 붙인다.
