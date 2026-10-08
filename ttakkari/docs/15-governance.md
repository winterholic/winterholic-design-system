# 15 · 운영: 바꾸는 법, 버전, 채택 기준 (Ttakkari)

## 1. 파일 구조

```
ttakkari/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ tokens/
│  ├─ src/                    ★ 토큰 단일 진실. 여기만 편집
│  │  ├─ palette.json         원시 램프 7종 + dark-tint(생성물. 손으로 고치지 않는다)
│  │  ├─ brand.json           브랜드 5색 + 중립 시드 8색 + white/black(사용자 시드 그대로)
│  │  ├─ color.light.json     시맨틱(라이트)
│  │  ├─ color.dark.json      시맨틱(다크). 라이트와 경로 1:1
│  │  ├─ dimension.json       space·size·breakpoint·radius·border·focus
│  │  ├─ typography.json      font.* + typography.* 24종
│  │  ├─ effects.json         shadow·pattern·opacity·z-index
│  │  ├─ motion.json
│  │  └─ component.json       컴포넌트 토큰
│  ├─ scripts/ramp.mjs · palette-from-anchors.mjs
│  ├─ build.mjs               src + components → tokens.json + dist/*
│  └─ tokens.json · tokens.dark.json (생성물)
├─ components/                ★ 구현(CSS 14 + tk.js). 빌드가 lint·충돌 검사 후 dist 로 묶는다
├─ dist/                      생성물. 소비 앱은 여기만 가져간다
│  tokens.css · typography.css · prose.css · components.css · aliases.css · tk.js
│  tokens.js · tokens.d.ts · tokens.global.js · tailwind.preset.cjs · tokens.scss · tokens.figma.json
│  monaco-theme.json · pwa.json · contrast-report.json
├─ docs/ 00~20                정답지
├─ examples/                  preview + 앱 템플릿 5종 + icons.js + examples.css
└─ assets/brand/              로고·파비콘·앱 아이콘·히어로 + 생성 스크립트
```

## 2. 바꾸는 절차

1. **왜 필요한지 한 줄.** 기존 토큰·컴포넌트로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 또는 `components/*.css` 편집. 색은 라이트·다크 **둘 다**.
3. `node tokens/build.mjs`: 참조 오류·라이트/다크 불일치·대비 미달·하드코딩·없는 변수·이름 충돌이면 실패한다. 통과할 때까지 **값을** 고친다(기준을 낮추지 않는다).
4. 새 글자-면 조합이면 `build.mjs` 의 `PAIRS` 에 넣는다.
5. `docs/00` 표에 행, 해당 상세 문서 갱신.
6. `examples/preview.html`(또는 템플릿)에 보이게 한다.
7. `npm test`(정적 검사 + 브랜드 자산), 화면을 바꿨으면 `npm run check:ui`(Chrome).
8. `CHANGELOG.md`, 버전(§4).

### 시드 색
사용자가 준 13색(`brand.*`·`seed.*`)은 이 시스템이 바꾸지 않는다(테스트가 막는다). 바뀌면 `brand.json` · `palette-from-anchors.mjs` 의 `ANCHORS` · `assets/brand/build-brand-assets.py` 세 곳을 같이 바꾸고 `npm run palette` → `npm run brand`.

### 새 컴포넌트
06 §25 조립 규칙 → `components/<묶음>.css`(lint·충돌 검사 통과) → 필요하면 `component.json` 토큰 → 06·07·08·09 에 마크업 계약 절 → preview 에 예시. 동작이 필요하면 `tk.js` 에 `initX(root)` 를 추가하고 `data-tk-*` 속성으로 연결, 같은 계약을 19 에 적는다(React 구현이 따른다).

### 새 작업 상태·정책·파일 계열
`color.run.<state>`·`policy.<name>`·`filetype.<type>` 를 라이트·다크에 → `build.mjs` 의 `RUN`·`POLICY`·`FILETYPE` 에 추가(대비 검사 자동) → CSS 의 `[data-state]`·`[data-policy]`·`[data-type]` 한 줄 → 08·09 표. 늘리기 전에 기존 것으로 표현할 수 있는지 먼저 본다. 상태가 많아질수록 아무 것도 눈에 띄지 않는다.

## 3. 이름 규칙

`[카테고리].[역할].[속성].[상태]`
- 원시: 값 이름(`blue.600`, `space.4`). 의미 금지.
- 시맨틱: 역할 이름(`color.action.primary.bg`). 색 이름 금지.
- 도메인 그룹: Ttakkari 개념어(`agent`·`run`·`policy`·`filetype`·`ink`·`viewer`·`presence`). 구현 세부(서버 모듈명·정책 키 이름)는 넣지 않는다.
- 컴포넌트 클래스: `.tk-<블록>`, 부위 `__`, 변형 `--`. 상태는 ARIA, 도메인 상태는 `data-state`·`data-policy`·`data-type`.
- 블록 이름은 다른 블록·글자 역할과 겹치면 안 된다(빌드가 막는다).
- 컴포넌트 내부 지역 변수: `--tk-_<이름>`(밑줄 시작, 외부 계약 아님). 외부 계약 변수는 `--tk-zoom`·`--tk-progress` 둘뿐.

## 4. 버전

semver, 태그 `ttakkari-vX.Y.Z`.

| 변경 | 버전 |
|---|---|
| 토큰·클래스 삭제·이름 변경, 의미 변경, 마크업 계약 변경 | major |
| 토큰·컴포넌트·문서 추가 | minor |
| 값 미세 조정, 버그·문서 수정 | patch |

이름 변경은 한 major 동안 `$deprecated: "→ 새이름"` 으로 남긴다.

## 5. 채택 기준(소비 프로젝트: winterholic-ttakkari front)

"Ttakkari 디자인 시스템을 쓴다"고 말하려면:
- [ ] `dist/tokens.css` + `typography.css` + `components.css` 로드(문서 뷰어·에이전트 Markdown 이 있으니 `prose.css` 도). 시드 이름을 쓰는 코드가 있으면 `aliases.css`
- [ ] 소스에 hex 0건: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.{css,scss,tsx,jsx,ts}`(manifest·테스트 제외)
- [ ] `dark:`·`prefers-color-scheme` 분기 0건
- [ ] `z-index: [0-9]` 직접값 0건, 스케일 밖 px 0건
- [ ] Primary 버튼 화면당 1개
- [ ] 컴포저가 한글 조합 중 Enter 를 보내지 않는다(19 §3)
- [ ] HTML 결과물은 별도 출처 sandbox iframe(09 §3)
- [ ] 모든 화면에 로딩·빈·오류·오프라인 상태(10)
- [ ] 11 §8 출시 전 확인

임시로 어길 때는 `/* TODO(ds): 이유 */`.

## 6. 다른 시스템과의 관계

winterholic-base·aip 의 구조(토큰 3계층·빌드·문서 체계·컴포넌트 lint)를 따르되 **자립**한다. 이 문서들만으로 답이 나와야 한다. 차이: 접두 `tk`, 시드 13색 고정 + 별칭, 라이트·다크 중립을 따로 뽑은 sage·graphite, 잉크 면, 도메인 그룹 7종, 채팅·실행·승인·결과물·뷰어 컴포넌트, Monaco 테마·PWA 색 생성, 이름 충돌 검사.

## 7. 알려진 한계·미결

- 컴포넌트는 CSS + 바닐라 JS 다. React 컴포넌트는 소비 앱(winterholic-ttakkari front)이 이 마크업·동작 계약대로 만든다(19). React 패키지로 묶을지는 미정.
- Figma 연동은 `tokens.figma.json` 을 Tokens Studio 로 수동 import 하는 수준.
- PDF.js·SheetJS·Monaco·react-markdown 플러그인의 구체 버전은 소비 앱이 정한다. 이 시스템은 모양 계약만 준다.
- 강제 색상 모드 전용 스타일 없음(11 §9).
- iOS standalone PWA 의 키보드·safe-area 동작은 기기 확인이 필요하다(확인 필요).
