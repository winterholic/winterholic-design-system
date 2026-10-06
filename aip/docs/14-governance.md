# 14 · 운영: 바꾸는 법, 버전, 채택 기준 (AIP)

## 1. 파일 구조

```
aip/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ tokens/
│  ├─ src/                    ★ 토큰 단일 진실. 여기만 편집
│  │  ├─ palette.json         원시 램프 7종(생성물. 손으로 고치지 않는다)
│  │  ├─ brand.json           Brand Palette 5색 + white/black
│  │  ├─ color.light.json     시맨틱(라이트)
│  │  ├─ color.dark.json      시맨틱(다크). 라이트와 경로 1:1
│  │  ├─ dimension.json       space·size·breakpoint·radius·border·focus
│  │  ├─ typography.json      font.* + typography.* 26종
│  │  ├─ effects.json         shadow·pattern·opacity·z-index
│  │  ├─ motion.json
│  │  └─ component.json       컴포넌트 토큰
│  ├─ scripts/ramp.mjs · palette-from-anchors.mjs
│  ├─ build.mjs               src + components → tokens.json + dist/*
│  └─ tokens.json · tokens.dark.json (생성물)
├─ components/                ★ 컴포넌트 구현(CSS 12 + aip.js). 빌드가 lint 후 dist 로 묶는다
├─ dist/                      생성물. 소비 앱은 여기만 가져간다
│  tokens.css · typography.css · prose.css · components.css · aip.js
│  tokens.js · tokens.d.ts · tokens.global.js · tailwind.preset.cjs · tokens.scss · tokens.figma.json
│  diagram.mermaid.json · contrast-report.json
├─ docs/ 00~18                정답지
├─ examples/                  preview + 제품 템플릿 4종
└─ assets/brand/              로고·파비콘·앱 아이콘·히어로 + 생성 스크립트
```

## 2. 바꾸는 절차

1. **왜 필요한지 한 줄.** 기존 토큰·컴포넌트로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 또는 `components/*.css` 편집. 색은 라이트·다크 **둘 다**.
3. `node tokens/build.mjs`: 참조 오류·라이트/다크 불일치·대비 미달·하드코딩 값이면 실패한다. 통과할 때까지 **값을** 고친다(기준을 낮추지 않는다).
4. 새 글자-면 조합이면 `build.mjs` 의 `PAIRS` 에 넣는다.
5. `docs/00` 표에 행, 해당 상세 문서(06·07·12) 갱신.
6. `examples/preview.html`(또는 템플릿)에 보이게 한다.
7. `npm test` (토큰·컴포넌트·문서·브랜드 자산 검사).
8. `CHANGELOG.md`, 버전(§4).

### 원시 팔레트
`tokens/scripts/palette-from-anchors.mjs` 의 `ANCHORS` 를 고치고 `npm run palette`. 브랜드 5색 hex 는 AIP 가 정한 값이라 이 시스템에서 바꾸지 않는다. 바뀌면 `brand.json`·`ANCHORS`·`assets/brand/build-brand-assets.py` 세 곳을 같이 바꾼다.

### 새 컴포넌트
06 §20 조립 규칙 → `components/<묶음>.css`(lint 통과) → 필요하면 `component.json` 토큰 → 06/07 에 마크업 계약 절 → preview 에 예시. 동작이 필요하면 `aip.js` 에 `initX(root)` 를 추가하고 `data-aip-*` 속성으로 연결한다.

### 다이어그램 개념 추가
`color.diagram.<role>` 를 라이트·다크에 → `build.mjs` 의 `ROLES` 에 추가(대비 검사 + Mermaid classDef 자동) → `components/diagram.css` 에 `[data-role]` 한 줄 → 12 §2 표. 개념을 늘리기 전에 기존 개념으로 표현할 수 있는지 먼저 본다. 아홉을 넘기면 색 문법이 무너진다.

## 3. 이름 규칙

`[카테고리].[역할].[속성].[상태]`
- 원시: 값 이름(`blue.600`, `space.4`). 의미 금지.
- 시맨틱: 역할 이름(`color.action.primary.bg`). 색 이름 금지(`color.action.blue` ❌).
- 도메인 그룹은 AIP 개념어(`diagram.intent`, `lifecycle.beta`). AIP 구현 세부(문법 키워드·내부 모듈명)는 토큰 이름에 넣지 않는다.
- 컴포넌트 클래스: `.aip-<이름>`, 부위 `__`, 변형 `--`. 상태는 ARIA 속성.
- 컴포넌트 내부 지역 변수: `--aip-_<이름>`(밑줄 시작, 외부 계약 아님).

## 4. 버전

semver, 태그 `aip-vX.Y.Z`.

| 변경 | 버전 |
|---|---|
| 토큰·클래스 삭제·이름 변경, 의미 변경, 마크업 계약 변경 | major |
| 토큰·컴포넌트·문서 추가 | minor |
| 값 미세 조정, 버그·문서 수정 | patch |

이름 변경은 한 major 동안 `$deprecated: "→ 새이름"` 으로 남긴다.

## 5. 채택 기준(소비 프로젝트)

"AIP 디자인 시스템을 쓴다"고 말하려면:
- [ ] `dist/tokens.css` + `typography.css` + `components.css` 로드(문서 제품은 `prose.css` 도), 동작은 `aip.js` 또는 같은 계약의 구현
- [ ] 소스에 hex 0건: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,jsx,vue,svelte}`
- [ ] `dark:`·`prefers-color-scheme` 분기 0건
- [ ] `z-index: [0-9]` 직접값 0건, 스케일 밖 px 0건
- [ ] 외부 코드 하이라이트 테마 CSS 0건
- [ ] Primary 버튼 화면당 1개
- [ ] 문서 페이지: h1 하나 + lead, 안정 id, 그림마다 텍스트 설명, View as Markdown
- [ ] 09 §8 출시 전 확인

임시로 어길 때는 `/* TODO(ds): 이유 */`.

## 6. 다른 시스템과의 관계

winterholic-base 의 구조(토큰 3계층·빌드·문서 체계)를 따르되 **자립**한다. 이 문서들만으로 답이 나와야 하고 base 를 읽을 필요가 없다. 차이: 접두 `aip`, 컴포넌트 **구현**(components/ → dist/components.css·aip.js), 그라데이션 토큰 없음, 중립 `charcoal` 곡선, 다크 면 단계 925·975, 도메인 그룹 4종(highlight·code·lifecycle·diagram), prose 의 GFM alert·Shiki 연결, Mermaid 테마 생성, 컴포넌트 CSS lint.

## 7. 알려진 한계·미결

- **AIP 고유 문법은 미정(OPEN)이다.** 예제의 코드는 레이아웃 시연용이며 AIP 의 정의 형식을 정하지 않는다. 문법이 정해지면 바뀌는 것은 예제 텍스트뿐이고 컴포넌트·토큰은 그대로다.
- **라이선스 미정.** `package.json` 에 license 를 적지 않았다(AIP 원칙 문서상 OPEN). Lucide 아이콘은 ISC.
- 컴포넌트는 프레임워크 없는 CSS + 바닐라 JS 다. React/Vue 래퍼는 소비 프로젝트가 이 마크업 계약대로 만든다.
- 검색은 UI 와 키보드 모델까지다. 색인·랭킹은 제품 몫.
- Mermaid 테마는 CSS 변수를 못 읽어 테마 전환 시 다시 렌더해야 한다.
- 강제 색상 모드 전용 스타일 없음(09 §9).
