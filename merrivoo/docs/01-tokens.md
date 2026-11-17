# 01 · 토큰

## 구조
`tokens/src/*.json`(DTCG, 단일 소스) → `node tokens/build.mjs` → `dist/`. 3계층:
1. **Primitive**: `palette.json`(OKLCH 램프 8종: burgundy·gold·sand·fir·indigo·sky·red·amber, 앵커에서 생성)과 `brand.json`(시드 색). 화면 코드는 쓰지 않는다.
2. **Semantic**: `color.light.json`/`color.dark.json`(경로 1:1, 100색). `surface·text·border·action·status·interactive·accent·scene`.
3. **Component**: `component.json`. 반드시 semantic/dimension 을 참조한다(`{color.surface.glass}`).

빌드가 검사하는 것: 참조 해석·순환, 라이트/다크 경로 불일치, 글자·행동·상태 대비(86쌍), 세계관 테마가 허용 토큰만 바꾸는지, `components/*.css` lint(hex·임의 px·시간·z-index·없는 변수·`!important`·`transition: all`), 레지스트리의 class·token 실재.

## 파일
| 파일 | 내용 |
|---|---|
| `dimension.json` | space(4px) · size(control 28/36/44/52/60, touch-target-min 44, container, scene, ornament) · breakpoint 375/431/600/1025 · radius 4~32 · border-width · focus |
| `typography.json` | font family/weight/size/line-height/letter-spacing + 17개 타이포 스타일 |
| `effects.json` | shadow(+dark) · gradient · opacity · blur · z-index(scene 0~70, ui 100~) |
| `motion.json` | duration · easing · distance · scale |
| `theme.worlds.json` | 세계관 테마: `scene.glow`·`scene.ground-shadow`·`scene.tint`·`border.gold` |

## 테마
- `data-theme="light|dark"`(기본은 시스템). light=Paper, dark=Night. 컴포넌트에 `dark:` 분기 없음.
- `data-world="snow-village|star-colony|night-office"` — 장면 색만. UI 얼굴은 모든 세계관에서 같다.

## 접두와 호환
접두는 `mv`. `winterholic-base` 와 시맨틱 경로(`color.surface.*` …)를 같게 유지해 컴포넌트 개념이 호환되지만, 두 시스템을 한 페이지에서 섞지 않는다.
