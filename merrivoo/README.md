# Merrivoo Design System

메리부(Merrivoo, 나만의 크리스마스 평행우주 서비스)의 디자인 시스템. `winterholic-base` 의 토큰 구조(DTCG 단일 소스 → 빌드 → `dist/`)와 검증 철학을 계승하되, 모바일 게임형 장면 조립이라는 별개의 목적에 맞게 독립시켰다. CSS 접두는 `mv`.

> 방향: **종이 위 동화책, 그 안에 조립되는 세계.** 버건디 행동 · 샴페인 골드 프레임 · 아이보리 종이. 세계관이 바뀌어도 UI 얼굴(글자·버튼·상태 색)은 같고, 장면(배경·트리·장식)만 달라진다.

## 한눈에

| | |
|---|---|
| 토큰 | 498개(primitive 램프 8종 · semantic 100색 라이트/다크 1:1 · component). 대비 86쌍 빌드 검사 |
| 테마 | `data-theme` light(Paper)/dark(Night) + `data-world` 세계관 테마(장면 색·금박만 변경) |
| 서체 | 질문·본문 Pretendard / 타이틀·점수 Cormorant Garamond + MaruBuri(글리프별 폴백) |
| 레이아웃 | 휴대폰 320~599(cover, 장면이 화면을 채움) · 태블릿 600+(stage, 가운데 9:16 + 블러 채움, UI 도 장면 열 안) |
| 컴포넌트 | CSS `dist/components.css` + React `react/index.js`. 레지스트리 15종(`registry/components.json`) |
| 조립 엔진 | `engine/` 의존성 없는 ESM. composeScene · placeOrnaments(궁합 점수 → 위치) · 호환성 · 검증기 · DOM/Canvas 렌더러 |
| 기계 판독 | `dist/design-system.config.json`, `schema/*.schema.json`, `registry/components.json` |
| 데모 에셋 | `assets/demo/` CC0 SVG(세계 2 · 트리 3 · 장식 10, 테스트용) |
| 쇼케이스 에셋 | `assets/showcase/` 이 저장소용으로 새로 생성한 범용 동화책 일러스트(세계관 3 · 트리 3 · 장식 30 · 효과 5). 미리보기가 쓴다. 서비스 전용 세계관·콘텐츠·상용 에셋은 이 저장소에 없다 |
| 도구 | `tools/process_assets.py` 이미지 생성 결과 → 투명 PNG/WebP·분할·트리 마스크 |

## 시작

```bash
node tokens/build.mjs          # 토큰·CSS 빌드 + lint + 레지스트리 검증
npm test                       # 빌드 + 엔진·정적 테스트
node assets/demo/build-demo.mjs   # 데모 카탈로그 재생성
node assets/showcase/build-showcase.mjs <원본 디렉터리> --python <venv python>   # 쇼케이스 가공(원본 PNG 는 저장소에 없음)
```

```html
<link rel="stylesheet" href="dist/tokens.css"> <link rel="stylesheet" href="dist/typography.css"> <link rel="stylesheet" href="dist/components.css">
```

```js
import { composeScene, renderSceneDOM } from 'merrivoo-design-system/engine';
const scene = composeScene(catalog, { worldId, treeId, ornaments: [{ id, ornamentId, score }] });
renderSceneDOM(el, scene);          // 또는 React <SceneView scene={scene} /> , drawScene(ctx, scene, images)
```

문서 지도: [00 결정 가이드](docs/00-decision-guide.md) · [01 토큰](docs/01-tokens.md) · [02 타이포](docs/02-typography.md) · [03 레이아웃](docs/03-layout-mobile.md) · [04 컴포넌트](docs/04-components.md) · [05 모션](docs/05-motion.md) · [06 장면 조립](docs/06-scene-composition.md) · [07 에셋](docs/07-asset-pipeline.md) · [08 연동](docs/08-integration.md) · [09 운영](docs/09-governance.md). 미리보기: [`examples/preview.html`](examples/preview.html).

## 공개 범위

이 시스템은 공개다. 서비스 콘텐츠(실제 세계관·트리·상용 일러스트·질문·궁합 로직·API)는 비공개 Merrivoo 저장소에 있고, 비공개 쪽이 이 시스템을 가져다 쓴다(역방향 참조 없음). 자세한 경계: [09](docs/09-governance.md).
