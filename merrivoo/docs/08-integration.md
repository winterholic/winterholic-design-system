# 08 · 연동(소비 서비스)

## 가져오는 방법 — 기존 모노레포 관례(vendor 복사)에 맞춤
이 시스템은 `private: true` 이고 레지스트리에 올리지 않는다. 소비 서비스는 필요한 폴더(`dist engine react schema tools registry package.json`)를 `vendor/merrivoo-design-system/` 로 **커밋 SHA 를 고정해** 가져온다(sparse checkout 스크립트 + lock 파일 + 해시 검증, Merrivoo 저장소의 `scripts/sync-design-system.mjs`). vendor 는 읽기 전용이다. 고치려면 이 저장소에서 고치고 SHA 를 올린다. 로컬 경로 참조는 개발 중에만 쓰고 최종 lock 에 남기지 않는다.

## API
```js
import { composeScene, placeOrnaments, treeCompat, validateCatalog, fitScene, drawScene, loadImages, collectImageSrcs } from 'merrivoo-design-system/engine';
import { SceneView, Stage, Button, ChoiceCard, QuestionPanel, BottomSheet, OrnamentPicker, ScoreMeter, … } from 'merrivoo-design-system/react';
```
- `composeScene(catalog, state, {treePx})` → `{layers, overflow, rejected, diagnostics, tree}`. `state.treeScale` 로 트리를 줄이고 `state.treeLift`(장면 높이 대비 0~0.3)로 밑동을 올려 하단 UI·글자 자리를 확보할 수 있다.
- `<Stage scene bgSrc>` 가 뷰포트에 맞추고(cover/stage) children 을 UI 레이어로 얹는다. `<SceneView interactive onOrnamentClick>`.
- 포스터: `loadImages` → `drawScene(ctx, scene, images, {width:1080,height:1920})` → 글자는 토큰 서체로 덧그림 → `canvas.toBlob`. 공유는 `navigator.canShare({files})` 가 되면 Web Share, 아니면 다운로드 + "길게 눌러 저장" 안내(인앱 브라우저 대비).
- 타입: `engine/index.d.ts`, `react/index.d.ts`.

## 스타일 불러오기 순서
`tokens.css` → `typography.css` → `components.css` → 서비스 CSS. 서비스 CSS 도 토큰만 쓴다.

## 데이터 분리
카탈로그(JSON)·질문·점수 로직·카피는 서비스 소유. 엔진은 `{worldId, treeId, ornaments:[{id, ornamentId, score}]}` 만 알면 되고 저장소(Supabase 등)를 모른다.
