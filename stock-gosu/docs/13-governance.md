# 13 · 운영 (stock-gosu)

## 1. 파일 구조
```
stock-gosu/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ assets/brand/            파랑새 로고 svg·png·ico (front/docs 에서 복사)
├─ tokens/
│  ├─ src/
│  │  ├─ palette.json       생성물. 앵커 + 기존 Toss 값 고정(fixed)
│  │  ├─ brand.json · color.light.json · color.dark.json
│  │  ├─ dimension.json · typography.json · effects.json · motion.json · component.json
│  ├─ scripts/ramp.mjs · palette-from-anchors.mjs (ANCHORS 에 fixed 지원)
│  ├─ build.mjs             base 와 같은 구조 + chart-theme.ts · legacy-aliases.css · [data-market=us]
│  ├─ tokens.json · tokens.dark.json (생성물)
├─ dist/                    tokens.css · typography.css · tokens.js/.d.ts · tailwind.preset.cjs · tokens.scss
│                           tokens.figma.json · chart-theme.ts · legacy-aliases.css · contrast-report.json
├─ docs/ 00~15
└─ examples/preview.html
```

## 2. 토큰 변경 절차
base 13 §2 와 같다: 이유 한 줄 → `tokens/src` 편집(색은 라이트·다크 둘 다) → `node tokens/build.mjs` 통과 → 새 조합은 `build.mjs` `pairs` 에 추가 → `docs/00` 표 → `examples/preview.html` → `CHANGELOG` → 커밋 `tokens(stock-gosu): …`.

stock-gosu 추가 규칙
- **등락 관련 토큰**(`finance.*`, `chart.candle/sparkline/heat`)을 바꾸면 `[data-market=us]` 블록(`build.mjs`)과 `finance.us-*` 도 같이 본다.
- **차트 색**을 바꾸면 `dist/chart-theme.ts` 가 재생성된다. front 의 `src/lib/chartTheme.ts` 를 이 파일로 교체했다면 자동 반영, 아니면 수동 동기화(15).
- 기존 값을 고정한 램프(blue·gray 50~900, red/green/yellow 일부)는 `ANCHORS[*].fixed` 에 있다. 고정을 풀고 OKLCH 생성값으로 가려면 `fixed` 를 지운다 — 화면 전체 색이 미세하게 바뀌므로 별건으로.

## 3. 이름 규칙
base 13 §3 + CSS 접두 `--sg-`. Tailwind: `text-finance-up-text`, `bg-surface-default`. 유틸 클래스 `.sg-up/.sg-down/.sg-flat`(글자색), `.sg-price-lg` 등.

## 4. 버전
태그 `stock-gosu-vX.Y.Z`. 기준은 base 와 같다. 등락색 값 변경은 사용자가 즉시 알아차리므로 minor 이상.

## 5. 소비 프로젝트(front) 채택 기준
- [ ] `dist/tokens.css` + `typography.css` 로드, 그 다음 `legacy-aliases.css`(이관 중)
- [ ] `src/lib/chartTheme.ts` → `dist/chart-theme.ts` 로 교체, `currentChartTheme()` 사용
- [ ] `grep -rnE "#[0-9a-fA-F]{6}" src --include=*.{css,tsx}` 0건 (svg 제외)
- [ ] `grep -rn "var(--blue-\|var(--gray-" src` 0건 (원시 별칭 → 시맨틱)
- [ ] `grep -rn "font-size: *1[0-9]px" src/styles` 결과가 12·13·15·17·18 만
- [ ] 등락 표기에 부호 동반, 캔버스 위 tertiary 없음
- [ ] 다크 강제 후 순백 면 0
- [ ] `legacy-aliases.css` 제거 가능 → 이관 완료

## 6. base 와의 관계
구조·빌드·문서 목차는 `winterholic-base` 와 같다. 값이 다른 곳: 팔레트(Toss Blue·회색조), 캔버스(회색), 글자 스케일(13/15/17), radius(한 단계 큼), 컨트롤 44, 그림자 alpha, 그리고 금융 전용 그룹(`finance`, `chart.candle/heat/overlay`, `stock-row`, `price-cell`, `kpi`, `market-tag`, `tabbar`, `sheet`, `search`). base 를 고칠 때 구조 변경(빌드 스크립트·문서 목차)이면 여기도 맞춘다. 값 변경은 독립.

## 7. 결정 기록 (되돌릴 수 있게)
| 결정 | 근거 | 뒤집을 조건 |
|---|---|---|
| Toss 팔레트 값 유지(OKLCH 재생성 안 함) | 제품이 이미 이 값으로 돌고, 사용자 눈에 익음 | 브랜드 리뉴얼 |
| `action.primary` = blue.500 (흰 글자 3.71) 유지, `primary-strict` 추가 | 브랜드 인상 유지. 라벨 15/600 | 접근성 감사 요구 시 strict 를 기본으로 |
| `text.tertiary` gray.500 → gray.600 | 3.04 는 AA 미달. 캡션이 안 읽힘 | 없음 |
| `text.brand/link` blue.500 → blue.700 | 3.71 미달 | 없음 |
| `blue.600` #2272EB → #216FE8, `red.600` #E42939 → #E0263A | AA 를 0.01 놓치던 값 | 없음(눈으로 구분 불가) |
| green/yellow 단계 재배치(500→400, 500→300) | 실제 밝기 자리로. 별칭이 옛 이름을 이어 줌 | 없음 |
| 등락 글자 600 / 큰 숫자·차트 500 이원화 | 13px 빨강 #F04452 는 3.71 | 없음 |
| 다크 primary = blue.400 + 어두운 글자 | 흰 글자는 어떤 파랑에서도 미달 | 없음 |
| 컨테이너 1180 (1080 폐기) | 코드가 쓰는 값 | 없음 |
| 시간 24시간제 | 장중 시각 비교 | 사용자 조사에서 12시간제 선호 확인 시 |
| 미국식 등락은 `data-market` 스코프 | 컴포넌트 무수정 | 없음 |

## 8. 알려진 한계
- 컴포넌트 코드 없음(규격만). front 의 `global.css` 클래스가 사실상 구현체 — 15 의 대응표로 맞춘다.
- Figma 수동 import.
- `prefers-contrast: more` 미지원.
- 캔들 차트는 recharts 기본에 없어 커스텀 shape 가 필요하다. 색만 토큰이 준다.
