# 13 · 운영 (stock-gosu) — 파일 구조, 토큰 변경 절차, 이름 규칙, 버전, 채택 기준, 결정 기록

## 1. 파일 구조
```
stock-gosu/
├─ README.md                 시작점·설치·문서 지도
├─ CLAUDE.md                 AI 에이전트 규칙
├─ CHANGELOG.md · package.json
├─ assets/brand/             파랑새 로고 svg·png·ico (front/docs 에서 복사)
├─ tokens/
│  ├─ src/                   ★ 단일 진실. 여기만 편집한다
│  │  ├─ palette.json        원시 램프 — 생성물. 앵커 + 기존 Toss 값 고정(fixed)
│  │  ├─ brand.json          브랜드 4색 + white/black
│  │  ├─ color.light.json    시맨틱 색(라이트) — surface·text·border·action·finance·status·interactive·chart
│  │  ├─ color.dark.json     시맨틱 색(다크) — 라이트와 경로 1:1
│  │  ├─ dimension.json      space·size(control·icon·avatar·container·layout)·breakpoint·radius·border·focus
│  │  ├─ typography.json     font.* + typography.* 21종
│  │  ├─ effects.json        shadow(+dark)·gradient·opacity·blur·z-index
│  │  ├─ motion.json         duration·easing·distance·scale
│  │  └─ component.json      컴포넌트 토큰 24종
│  ├─ scripts/
│  │  ├─ ramp.mjs            OKLCH 램프 생성 + WCAG 대비 계산
│  │  └─ palette-from-anchors.mjs   ANCHORS(fixed 지원) → palette.json
│  ├─ build.mjs              src → tokens.json + dist/*. 라이트/다크 1:1·대비 106쌍 검사. + chart-theme.ts·legacy-aliases.css·[data-market=us]
│  ├─ tokens.json · tokens.dark.json   생성물
├─ dist/                     생성물. 소비 앱은 여기만 import
│  ├─ tokens.css  typography.css  tokens.js  tokens.d.ts  tokens.scss  tokens.figma.json  tailwind.preset.cjs
│  ├─ chart-theme.ts         recharts raw 색(라이트·다크) + axisProps·gridProps·seriesColor
│  ├─ legacy-aliases.css     기존 global.css 변수명 → --sg-*
│  └─ contrast-report.json
├─ docs/ 00~16               정답지
└─ examples/preview.html     전 토큰·컴포넌트 시각 확인(라이트/다크/미국식 토글)
```

## 2. 토큰을 바꾸는 절차
1. **왜 필요한지 한 줄**로 적는다. 기존 토큰으로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 편집. 색이면 **라이트·다크 둘 다**. `finance.*` 를 바꾸면 `finance.us-*` 와 `build.mjs` 의 `[data-market=us]` 블록도.
3. `node tokens/build.mjs` — 참조 오류·라이트/다크 불일치·대비 미달이면 실패한다. 통과할 때까지 값을 조정한다(기준을 낮추지 않는다).
4. 새 색 조합(글자 on 배경)을 쓰면 `build.mjs` 의 `pairs` 에 추가해 검사망에 올린다.
5. `docs/00-decision-guide.md` 에 행 추가, 해당 상세 문서 갱신, `docs/16-situations.md` 에 상황이 있으면 추가.
6. `examples/preview.html` 에 스와치·예시 추가 → Playwright 또는 브라우저로 라이트/다크/375 확인.
7. `CHANGELOG.md` 기록, 버전 올림(§4).
8. 커밋 `tokens(stock-gosu): add color.status.pending` 처럼 무엇이 바뀌었는지 이름으로.

### 원시 팔레트를 바꾸려면
`tokens/scripts/palette-from-anchors.mjs` 의 `ANCHORS` 를 고친 뒤:
```bash
node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json && node tokens/build.mjs
```
`fixed` 에 있는 단계는 생성값 대신 고정된다(기존 Toss 값). 고정을 풀고 OKLCH 값으로 가려면 `fixed` 에서 빼되 별건으로(화면 전체 색이 미세하게 바뀐다).

### 새 램프를 더하려면
`ANCHORS` 에 한 줄 → 생성 → 시맨틱에서 참조. 시맨틱이 참조하지 않는 램프는 죽은 토큰이다. 차트 categorical 확장이 아니면 대부분 필요 없다.

### 차트 색을 바꾸면
`dist/chart-theme.ts` 가 재생성된다. front 가 이 파일을 쓰면 자동 반영. 수동 복사본이 있으면 동기화(15).

## 3. 이름 규칙
`[카테고리].[역할 또는 스케일].[속성].[상태]`
- 원시: 값 이름(`blue.500`, `space.4`). 의미 금지.
- 시맨틱: 역할 이름(`color.finance.up.text`). 값 금지.
- 컴포넌트: `component.<이름>.<부위 또는 size>.<속성>`.
- 상태 접미 `-hover` `-active` `-disabled`. 모드(light/dark)는 파일로 분리.
- 스케일: t-shirt(`xs…2xl`)는 크기 감각, 숫자(`50…950`, `space.4`)는 정량. 한 그룹에서 섞지 않는다.
- CSS 변수 `--sg-` + 경로를 `-` 로. 예 `--sg-color-finance-up-text`.
- Tailwind: `text-finance-up-text`, `bg-surface-default`, `h-control-md`, `z-dropdown`.
- 유틸 클래스 `.sg-up/.sg-down/.sg-flat`(등락 글자색), `.sg-up-solid/.sg-down-solid`, `.sg-price-lg` 등 타이포.
- 등락 방향 데이터 속성 `data-tick="up|down"`, 시장 스코프 `data-market="us"`, 테마 `data-theme`.

## 4. 버전
semver, 태그 `stock-gosu-vX.Y.Z`.
| 변경 | 버전 |
|---|---|
| 토큰 삭제·이름 변경, 값의 의미 변경(radius.lg 12→16), 등락색 값 변경 | major / 등락색은 minor 이상 |
| 토큰 추가, 컴포넌트 규격 추가, 문서 보강 | minor |
| 대비 미세 조정(같은 단계 안), 오탈자, 빌드 스크립트 수정 | patch |
이름 변경은 한 major 동안 `$deprecated: "→ 새이름"` 으로 남긴다.

## 5. 소비 프로젝트(front) 채택 기준
- [ ] `dist/tokens.css` + `typography.css` 로드, 이관 중이면 그 다음 `legacy-aliases.css`
- [ ] `src/lib/chartTheme.ts` → `dist/chart-theme.ts` 교체, `currentChartTheme()` + 테마 변경 감지
- [ ] `grep -rnE "#[0-9a-fA-F]{6}" src --include=*.{css,tsx} | grep -v chart-theme` 0건(svg 제외)
- [ ] `grep -rn "var(--blue-\|var(--gray-\|var(--red-\|var(--green-\|var(--yellow-" src` 0건(원시 별칭 → 시맨틱)
- [ ] `grep -rnE "font-size: *[0-9]+px" src/styles` 결과가 12·13·15·17·18·20·24·28·32·40 만
- [ ] `grep -rn "dark:" src` 0건, `z-index: [0-9]` 직접 값 0건
- [ ] 등락 표기에 부호 동반, 13~15px 등락 글자는 `finance.*.text`
- [ ] 캔버스 위 tertiary·상태색 글자 없음
- [ ] 화면마다 로딩·빈·오류·장 마감·지연 상태 존재
- [ ] 다크 강제 후 순백 면 0, 차트 색 전환
- [ ] `docs/08` 출시 전 체크 통과
- [ ] `legacy-aliases.css` 제거 가능 → 이관 완료

임시로 어길 때는 `/* TODO(ds): 이유 */`. `grep -rn "TODO(ds)"` 가 부채 목록.

## 6. base 와의 관계
구조·빌드·문서 목차는 `winterholic-base` 와 같다. 값이 다른 곳: 팔레트(Toss Blue·회색조), 캔버스(회색), 글자 스케일(13/15/17), radius(한 단계 큼), 컨트롤 44, 그림자 alpha, 금융 전용 그룹(`finance`, `chart.candle/heat/overlay`, `stock-row`, `price-cell`, `kpi`, `market-tag`, `tabbar`, `sheet`, `search`). base 의 **구조** 변경(빌드 스크립트·문서 목차·검사 항목)은 여기도 맞춘다. **값** 변경은 독립. 세 시스템 모두 `docs/16-situations.md` 를 갖는다.

## 7. 결정 기록 (되돌릴 수 있게)
| 결정 | 근거 | 뒤집을 조건 |
|---|---|---|
| Toss 팔레트 값 유지(OKLCH 재생성 안 함) | 제품이 이미 이 값으로 돌고, 사용자 눈에 익음 | 브랜드 리뉴얼 |
| `action.primary` = blue.500 (흰 글자 3.71) 유지, `primary-strict` 추가 | 브랜드 인상 유지. 라벨 15/600 | 접근성 감사 요구 시 strict 를 기본으로 |
| `text.tertiary` gray.500 → gray.600 | 3.04 는 AA 미달 | 없음 |
| `text.brand/link` blue.500 → blue.700 | 3.71 미달 | 없음 |
| `blue.600` #2272EB → #216FE8, `red.600` #E42939 → #E0263A | AA 를 0.01 놓치던 값 | 없음(눈으로 구분 불가) |
| green/yellow 단계 재배치(500→400, 500→300) | 실제 밝기 자리로. 별칭이 옛 이름을 이어 줌 | 없음 |
| 등락 글자 600 / 큰 숫자·차트 500 이원화 | 13px 빨강 #F04452 는 3.71 | 없음 |
| 캔버스 gray.100 유지 + "캔버스 위 글자는 primary/secondary 만" | 흰 카드가 떠 보이는 구조가 정체성 | 없음 |
| 다크 primary = blue.400 + 어두운 글자 | 흰 글자는 어떤 파랑에서도 미달 | 없음 |
| 컨테이너 1180 (문서 1080 폐기) | 코드가 쓰는 값 | 없음 |
| 시간 24시간제 | 장중 시각 비교 | 사용자 조사에서 12시간제 선호 확인 시 |
| 미국식 등락은 `data-market` 스코프 | 컴포넌트 무수정 | 없음 |
| 버튼 md 좌우 패딩 18 → 16 | 4 그리드 통일. 원본 코드 조정 허용(사용자 결정 2026-09-19) | 없음 |
| 세그먼트 3종 → 1종(36, 터치 44) | 중복 제거 | 없음 |
| 순위 리스트 실시간 재정렬 애니메이션 금지 | 읽기 방해 | 없음 |
| 차트 시리즈 9번째부터 '기타' | CVD 검증된 8색 유지 | 없음 |

## 8. 알려진 한계·미결
- 컴포넌트 **코드**(React)는 이 저장소에 없다. 규격만. front 의 `global.css` 클래스가 사실상 구현체 — 15 대응표로 맞춘다.
- Figma 수동 import(`tokens.figma.json` → Tokens Studio).
- `prefers-contrast: more` 미지원(08 §8 에 대안).
- 캔들 차트는 recharts 기본에 없어 커스텀 shape 가 필요. 색만 토큰이 준다.
- 로고 자산: 투명 배경 SVG·단색·로크업·다크용 미제작(14).
