# 13 · 운영 — 토큰을 바꾸는 법, 버전, 채택 기준

## 1. 파일 구조

```
winterholic-base/
├─ README.md                 시작점·설치·파일 지도
├─ CLAUDE.md                 AI 에이전트가 이 시스템으로 UI 를 만들 때의 규칙
├─ CHANGELOG.md
├─ package.json              build 스크립트, exports
├─ tokens/
│  ├─ src/                   ★ 단일 진실. 여기만 편집한다
│  │  ├─ palette.json        원시 램프 — 생성물. 손으로 안 고침
│  │  ├─ brand.json          coolors 원본 6색 + white/black
│  │  ├─ color.light.json    시맨틱 색(라이트)
│  │  ├─ color.dark.json     시맨틱 색(다크) — 라이트와 경로 1:1
│  │  ├─ dimension.json      space·size·breakpoint·radius·border·focus
│  │  ├─ typography.json     font.* + typography.* 스타일
│  │  ├─ effects.json        shadow·gradient·opacity·blur·z-index
│  │  ├─ motion.json
│  │  └─ component.json      컴포넌트 토큰(3계층)
│  ├─ scripts/
│  │  ├─ ramp.mjs            OKLCH 램프 생성 + WCAG 대비 계산
│  │  └─ palette-from-anchors.mjs   앵커 → palette.json
│  ├─ build.mjs              src → tokens.json + dist/*
│  ├─ tokens.json            합쳐진 DTCG (생성물)
│  └─ tokens.dark.json       (생성물)
├─ dist/                     생성물. 소비 앱은 여기만 import
│  ├─ tokens.css  typography.css  tokens.js  tokens.d.ts
│  ├─ tailwind.preset.cjs  tokens.scss  tokens.figma.json
│  └─ contrast-report.json
├─ docs/                     00 부터 13. 정답지
└─ examples/preview.html     전 토큰·컴포넌트 시각 확인
```

## 2. 토큰을 바꾸는 절차

1. **왜 필요한지 한 줄**로 적는다. 기존 토큰으로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 편집. 색이면 라이트·다크 **둘 다**.
3. `node tokens/build.mjs` — 참조 오류·라이트/다크 불일치·대비 미달이면 실패한다. 통과할 때까지 값을 조정한다(기준을 낮추지 않는다).
4. 새 색 조합을 쓰면 `build.mjs` 의 `pairs` 에 추가해 검사망에 올린다.
5. `docs/00-decision-guide.md` 에 행 추가, 해당 상세 문서 갱신.
6. `examples/preview.html` 에 스와치·예시 추가.
7. `CHANGELOG.md` 기록, 버전 올림(§4).
8. 커밋: `tokens: add color.status.pending` 처럼 무엇이 바뀌었는지 이름으로.

### 원시 팔레트를 바꾸려면
`tokens/scripts/palette-from-anchors.mjs` 의 `ANCHORS` 를 고친 뒤:
```bash
node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
node tokens/build.mjs
```
앵커 단계(`step`)를 바꾸면 그 램프의 모든 단계가 움직인다. 시맨틱이 참조하는 단계의 대비가 빌드에서 걸리면 시맨틱 매핑을 같이 조정한다.

### 새 램프(색상)를 더하려면
`ANCHORS` 에 한 줄 추가 → 생성 → 시맨틱에서 참조. 원시 램프만 추가하고 시맨틱이 참조하지 않으면 죽은 토큰이다. 차트 categorical 확장이 아니면 대부분 필요 없다.

## 3. 토큰 이름 규칙

`[카테고리].[역할 또는 스케일].[속성].[상태]`

- 원시: 값 이름(`blue.500`, `space.4`). **의미 금지**(`blue.brand` ❌).
- 시맨틱: 역할 이름(`color.action.primary.bg`). **값 금지**(`color.action.blue` ❌).
- 컴포넌트: `component.<이름>.<부위 또는 size>.<속성>`.
- 상태 접미: `-hover` `-active` `-disabled`. 모드(light/dark)는 이름에 넣지 않는다(파일로 분리).
- 스케일: t-shirt(`xs sm md lg xl 2xl`) 는 크기 감각, 숫자(`50 … 950`, `space.4`)는 정량. 한 그룹에서 섞지 않는다.
- CSS 변수: `--wh-` + 경로를 `-` 로 이은 것. `.`→`-`. 예: `--wh-color-text-primary`.
- Tailwind: 색은 `text-text-primary`, `bg-surface-default` 처럼 경로 그대로.

## 4. 버전

semver. 이 저장소의 `winterholic-base` 는 다른 프로젝트가 `git submodule` 또는 파일 복사로 가져가므로 태그로 관리한다: `base-v1.2.0`.

| 변경 | 버전 |
|---|---|
| 토큰 **삭제·이름 변경**, 값의 의미 변경(예: `radius.md` 8→12) | major |
| 토큰 추가, 컴포넌트 규격 추가, 문서 보강 | minor |
| 대비 미세 조정(같은 단계 안), 오탈자, 빌드 스크립트 수정 | patch |

이름 변경은 바로 지우지 않고 한 major 동안 `$deprecated: "→ 새이름"` 으로 남긴다. 빌드는 deprecated 토큰도 내보낸다.

## 5. 소비 프로젝트의 채택 기준

프로젝트가 "이 시스템을 쓴다" 고 말하려면:
- [ ] `dist/tokens.css` + `typography.css` 로드 (또는 Tailwind 프리셋)
- [ ] 소스에 hex 0건: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.{css,scss,tsx,jsx,vue,svelte}` (svg·테스트 제외)
- [ ] 소스에 스케일 밖 px 0건: `grep -rnE "\b(1[0-9]|2[0-9]|3[0-9])px" src/` 결과가 전부 토큰 값(12·16·20·24·32·36)인지 확인
- [ ] `dark:` 분기 0건
- [ ] `z-index: [0-9]` 직접 값 0건
- [ ] 화면마다 로딩·빈·오류 상태 존재
- [ ] `docs/08` 출시 전 체크 통과

임시로 어길 때는 `/* TODO(ds): 이유 */` 주석. `grep -rn "TODO(ds)"` 가 부채 목록이다.

## 6. 다른 디자인 시스템을 파생할 때

이 저장소는 여러 디자인 시스템을 담는다(`winterholic-base` 가 첫 번째). 새 시스템(`winterholic-<이름>/`)을 만들 때:
1. `winterholic-base` 를 복사한다.
2. `brand.json` 과 `ANCHORS` 만 바꾸고 팔레트를 재생성한다. 시맨틱 구조는 유지한다 — 그래야 컴포넌트 코드가 시스템 간에 호환된다.
3. `dimension·typography·motion` 은 브랜드가 요구할 때만 바꾼다.
4. CSS 변수 접두(`PREFIX`)는 `wh` 로 두어 소비 코드가 시스템을 바꿔도 그대로 돌게 한다. 두 시스템을 한 페이지에서 동시에 쓸 일이 있으면 그때 접두를 나눈다.

## 7. 알려진 한계·미결

- Figma 연동은 `tokens.figma.json` 을 Tokens Studio 로 **수동 import** 하는 수준. 자동 동기화 파이프라인 없음.
- 컴포넌트 **코드**(React 등)는 이 저장소에 없다. 규격만 있다. 컴포넌트 라이브러리는 소비 프로젝트 또는 별도 패키지에서 이 토큰으로 구현한다.
- `prefers-contrast: more` 토큰 없음(08 §8).
- 램프 생성기의 채도 곡선은 앵커 채도 기준 선형 감쇠다. 특정 단계가 눈에 안 맞으면 `L_STEPS` 나 감쇠 계수(`1.35`)를 조정하고 전 램프를 다시 뽑는다. 개별 hex 수정 금지.
