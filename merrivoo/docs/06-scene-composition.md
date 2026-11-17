# 06 · Scene Composition

## 레이어(z-index 토큰 `scene-*`)
background 0 → environment 10 → atmosphere 20 → shadow 29 → tree 30 → lighting 40 → ornaments 50 → foreground 60 → grade 65 → fx-top 70 → UI 100+. 가림 관계상 필요하면 같은 레이어 안에서 `z` 로 세분한다(장식은 아래쪽일수록 앞).

## 좌표
- 장면 논리 크기 1080×1920(9:16). 에셋 좌표는 모두 0~1 정규화.
- 트리 안 좌표 `(u, v)`: u 는 트리 폭, v 는 트리 높이 기준 0~1. 장식 폭은 "트리 폭의 비율"(`baseWidth`). 장면 좌표 = `treeLeft + u·treeW`, `treeTop + v·treeH`.
- 트리 크기 = `min(heightFrac·H·aspect, world.treeWidth·W)`(`treeSize`). `treeAnchor` 는 밑동 중앙.

## 매니페스트(스키마 `schema/*.schema.json`)
- **World**: background, treeAnchor, treeWidth, groundShadow, light, grade, effects, theme, compat.trees.
- **Tree**: file, aspect, heightFrac, mask(알파에서 뽑은 48열 0/1 실루엣), tags, compat.worlds.
- **Ornament**: kind(hang·perch·ground·topper), anchor(걸이 고리), baseWidth, placements, tier(common·world), worlds, requires/excludesTreeTags.
공통 필드: 고유 id · 파일 경로 · 버전(semver) · 라이선스 · 레이어.

## 호환성
세계관×트리는 `native | allowed | forbidden`, 적지 않은 조합은 forbidden(목록이 곧 계약). `composeScene` 은 forbidden 조합을 던진다. 장식은 `worlds`(`['*']` = 전체)와 트리 태그 규칙으로 걸러지고 거부 사유가 `scene.rejected` 에 남는다. `validateCatalog` 는 교차 참조, 세계관마다 호환 트리 ≥2 · 사용 가능 장식 ≥8 을 요구한다.
같은 배경에서 다른 트리가 자연스럽게 서도록: 접지 그림자(트리 폭 기준), 세계관 `grade`(multiply 보정), 전구(트리 실루엣을 따라 생성), 모든 트리 에셋이 같은 광원·시점·선 굵기로 생성되었다([07](07-asset-pipeline.md)).

## 배치 `placeOrnaments(tree, items, options)`
입력 `[{id, ornament, score}]`. 같은 입력·seed → 같은 결과.
1. **토퍼**: 점수 85+ 중 토퍼 허용 장식 하나를 가장 먼저 꼭대기에.
2. **자리 중요도** `P = 0.72·(1−높이) + 0.28·(1−중앙에서 멀어짐)` — 높을수록·가운데일수록 소중. 목표 `P(score) = 0.06 + 0.9·(score/100)^1.15`. 점수 높은 것부터 목표 P 에 가장 가까운 빈 자리를 고른다. 낮은 점수는 아래 가장자리, 35점 미만 + 바닥 허용 장식은 트리 밑 구석.
3. **밀도**: 장식이 적으면 최대 1.5배로 크게, 많으면 0.93배씩 줄이며 전부 들어갈 때까지. 최소 크기는 **긴 변** 기준 18px(`minRenderPx`). 최소에서도 안 들어가면 겹침 허용을 10%→20% 로 완화, 그래도 안 되면 `overflow` 로 돌려준다(지우지 않는다 → UI 가 "+N개 더 있어요").
4. **검증**(`diagnose`): 장식 상자의 62%+ 가 실루엣 안, 겹침 쌍 25% 초과 0, 트리 박스 이탈 0, 최소 크기. 서비스 저장소 실험실이 장식 0·5·20·50개 × 트리별로 보여 준다.

실측(서비스 카탈로그 11종 트리, treePx 260): 20개 전부 통과, 50개는 10종이 전부 배치(최소 18.6~23px), 가장 가는 "나뭇가지 하나"만 45개 + 5개 overflow.
