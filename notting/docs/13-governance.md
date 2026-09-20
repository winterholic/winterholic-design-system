# 13 · 운영 — 토큰을 바꾸는 법, 버전, 채택 기준 (notting)

## 1. 파일 구조

```
notting/
├─ README.md                 시작점·설치·문서 지도
├─ CLAUDE.md                 AI 에이전트가 이 시스템으로 UI 를 만들 때의 규칙
├─ CHANGELOG.md
├─ package.json              build 스크립트, exports
├─ tokens/
│  ├─ src/                   ★ 단일 진실. 여기만 편집한다
│  │  ├─ palette.json        원시 램프 6종 — 생성물. 손으로 안 고침
│  │  ├─ brand.json          coolors 원본 5색 + white/black
│  │  ├─ color.light.json    시맨틱 색(라이트) — surface·text·border·action·status + ai·citation·mark·diff·workflow·priority·decision·fidelity·code + interactive·accent·chart
│  │  ├─ color.dark.json     시맨틱 색(다크) — 라이트와 경로 1:1
│  │  ├─ dimension.json      space·size(control·icon·avatar·container·layout)·breakpoint·radius·border·focus
│  │  ├─ typography.json     font.* + typography.*(UI 22종 + prose 7종)
│  │  ├─ effects.json        shadow(+ai)·gradient·opacity·blur·z-index
│  │  ├─ motion.json
│  │  └─ component.json      범용 17종 + notting 전용 20종
│  ├─ scripts/
│  │  ├─ ramp.mjs            OKLCH 램프 생성 + WCAG 대비. notting 은 stone 곡선 추가
│  │  └─ palette-from-anchors.mjs   앵커 → palette.json
│  ├─ build.mjs              src → tokens.json + dist/*
│  ├─ tokens.json            합쳐진 DTCG (생성물)
│  └─ tokens.dark.json       (생성물)
├─ dist/                     생성물. 소비 앱은 여기만 import
│  ├─ tokens.css  typography.css  prose.css  tokens.js  tokens.d.ts
│  ├─ tailwind.preset.cjs  tokens.scss  tokens.figma.json
│  └─ contrast-report.json
├─ docs/                     00 부터 16. 정답지
├─ examples/preview.html     전 토큰·컴포넌트·notting 패턴 시각 확인
└─ assets/brand/             로고·파비콘·히어로
```

## 2. 토큰을 바꾸는 절차

1. **왜 필요한지 한 줄**로 적는다. 기존 토큰으로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 편집. 색이면 라이트·다크 **둘 다**.
3. `node tokens/build.mjs` — 참조 오류·라이트/다크 불일치·대비 미달이면 실패한다. 통과할 때까지 값을 조정한다(기준을 낮추지 않는다).
4. 새 색 조합(글자 on 면)을 쓰면 `build.mjs` 의 `pairs` 에 추가한다. notting 은 도메인 그룹(ai·citation·workflow…)마다 text-on-bg 와 solid-on-default 를 넣는 관행이다.
5. `docs/00-decision-guide.md` 에 행 추가, 해당 상세 문서 갱신. notting 개념이면 `docs/15` 도.
6. `examples/preview.html` 에 스와치·예시 추가.
7. `CHANGELOG.md` 기록, 버전 올림(§4).
8. 커밋: `notting: add color.fidelity.partial` 처럼 무엇이 바뀌었는지 이름으로.

### 원시 팔레트를 바꾸려면
`tokens/scripts/palette-from-anchors.mjs` 의 `ANCHORS` 를 고친 뒤:
```bash
node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
node tokens/build.mjs
```
앵커 단계를 바꾸면 그 램프의 모든 단계가 움직인다. 중립은 `stone: true`(채도 1/3) — 베이지로 돌아가고 싶으면 `neutral: true`.

### 새 램프를 더하려면
`ANCHORS` 에 한 줄 → 생성 → 시맨틱에서 참조. 시맨틱이 참조하지 않는 램프는 죽은 토큰이다. notting 은 6 램프로 닫혀 있다 — 새 도메인 색이 필요하면 먼저 periwinkle(AI)·amber(주의)·neutral 로 표현할 수 있는지 본다.

### 새 도메인 그룹을 더하려면 (예: `color.comment.*`)
1. 라이트·다크에 같은 경로로 `bg/border/text/icon/solid/on-solid` 중 필요한 것.
2. `pairs` 에 `text on bg` 4.5, `icon on bg` 3, `on-solid on solid` 4.5.
3. `component.json` 에 그 도메인 컴포넌트 토큰.
4. 00 표 + 15 매핑 + 16 상황 한 줄.

## 3. 토큰 이름 규칙

`[카테고리].[역할 또는 스케일].[속성].[상태]`

- 원시: 값 이름(`teal.500`, `space.4`). 의미 금지.
- 시맨틱: 역할 이름(`color.action.ai.bg`). 값 금지(`color.action.purple` ❌).
- 도메인 그룹은 **제품 개념 이름**(`workflow.in-progress`, `fidelity.dropped`, `citation.stale-bg`). 제품 문서(`C:\notting\docs\initial-plan.md`)의 용어를 그대로 쓴다 — 여기서 이름을 바꾸면 코드·문서·UI 가 갈라진다.
- 컴포넌트: `component.<이름>.<부위 또는 size>.<속성>`. 블록은 `block-<타입>`.
- 상태 접미: `-hover` `-active` `-disabled` `-stale`. 모드는 이름에 넣지 않는다.
- CSS 변수: `--nt-` + 경로. Tailwind: `bg-ai-bg`, `text-citation-text`, `bg-workflow-done-bg`.

## 4. 버전

semver. 태그 `notting-vX.Y.Z`.

| 변경 | 버전 |
|---|---|
| 토큰 삭제·이름 변경, 값의 의미 변경, 도메인 그룹 구조 변경 | major |
| 토큰·컴포넌트·문서 추가 | minor |
| 대비 미세 조정, 오탈자, 빌드 수정 | patch |

이름 변경은 한 major 동안 `$deprecated: "→ 새이름"` 으로 남긴다.

## 5. 소비 프로젝트의 채택 기준

프로젝트가 "notting 디자인 시스템을 쓴다" 고 말하려면:
- [ ] `dist/tokens.css` + `typography.css` + `prose.css` 로드 (또는 Tailwind 프리셋 + prose.css)
- [ ] 에디터·읽기 모드·Ask 답변 본문에 `.nt-doc`
- [ ] 소스에 hex 0건: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.{css,scss,tsx,jsx,vue,svelte}` (svg·테스트 제외)
- [ ] 스케일 밖 px 0건
- [ ] `dark:` 분기 0건
- [ ] `z-index: [0-9]` 직접 값 0건
- [ ] 외부 코드 하이라이트 테마 CSS 0건(`prose.css` 매핑만)
- [ ] 화면마다 로딩·빈·오류 + **오프라인·충돌·읽기 전용** 상태 존재(15 §8)
- [ ] AI 가 만든 모든 것에 `ai.*` 색 + sparkles 또는 AI 배지
- [ ] 손실이 있는 모든 변환 경로에 보고서(06 §28) 연결
- [ ] `docs/08` 출시 전 체크 통과

임시로 어길 때는 `/* TODO(ds): 이유 */`. `grep -rn "TODO(ds)"` 가 부채 목록.

## 6. 다른 시스템과의 관계

- notting 은 winterholic-base 를 **복사해 파생**했다(base 13 §6). 시맨틱 구조(surface·text·border·action·status·interactive·accent·chart)와 dimension·motion 은 base 와 호환된다. 접두는 `nt`(한 페이지에서 base 와 같이 쓸 일이 있어 분리).
- base 와 다른 점: 카드 기본 그림자 없음(테두리), `line-height.prose` 1.7, `border-width.marker` 3, 중립 stone 곡선, `typography.prose-*`, `shadow.ai`, `z-index.sidebar`, 도메인 색 그룹 9종, 컴포넌트 20종, `dist/prose.css`.
- 이 문서들은 **자립**한다. base 를 읽지 않아도 notting 만으로 답이 나와야 한다. base 를 참조하는 문장은 이 §6 뿐이다.

## 7. 알려진 한계·미결

- 컴포넌트 **코드**(React·Tiptap 확장)는 여기 없다. 규격만.
- `prose.css` 의 하이라이트 매핑은 Prism(`.token.*`)·highlight.js(`.hljs-*`) 두 클래스 체계만. Shiki 는 CSS 변수 테마로 `code.*` 를 연결해야 한다(미작성).
- `in-progress` 반 채움 아이콘 SVG 는 소비 프로젝트가 그린다.
- `prefers-contrast: more` 없음.
- 문서 안 차트·데이터베이스 뷰(Phase 3)의 토큰 없음. Table/Board 다중 뷰가 오면 `workflow` 를 일반 `select` 속성 색으로 확장해야 한다(색 8종 팔레트 필요 — 그때 chart.categorical 을 재사용할지 결정).
- 댓글·멘션·presence(Phase 3) 없음.
- 램프 생성기 채도 곡선은 선형 감쇠. 개별 hex 수정 금지.
