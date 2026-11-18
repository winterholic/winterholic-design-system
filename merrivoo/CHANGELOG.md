# Changelog

## 0.3.1 — 2026-11-19
- 컴포넌트: `OrnamentPicker` 에 `layout="strip"`(한 줄 가로 스크롤·스냅). 장면을 가리지 않는 얇은 하단 트레이용. 항목 `badge`(예: 희귀) 표시.
- 장면: 선택 강조(`data-selecting`) 중에도 꼭대기 장식(`data-zone="topper"`)은 흐리게 하지 않는다(트리의 일부로 읽힘).
- 엔진: 토퍼(꼭대기 장식) 가로 위치가 항상 0.5 였던 문제 — 트리 manifest `topAnchor.x` 를 따른다(꼭대기가 한쪽으로 휜 트리에서 별이 허공에 뜨던 문제).
- 수정: `Signboard` 의 `fetchpriority` → `fetchPriority`(React 19 경고).

## 0.3.0 — 2026-11-18
- 엔진: `placeIncremental` — 저장된 장식 자리는 고정하고 새 장식만 빈 자리에 넣는다. `composeScene` 의 `state.placed`(저장 자리)·`state.background`·`state.environment`·`state.foreground`(개인별 변형).
- 컴포넌트: `Signboard`(세계관 간판). 이미지 본체 + HTML 제목, 한 줄 우선·자동 축소·두 줄 대체, textBox·잉크 색 규격.
- 테스트: 증분 배치 1→100개 위치 불변·겹침·이탈, placed 조립.

## 0.2.0 — 2026-11-18
- 미리보기 전면 개편: 휴대폰 틀에서 라이브 장면, 6개 화면 흐름, 9:16 포스터, 트리 3종 × 장식 0·5·20·50, 점수별 자리, 토큰·컴포넌트, 이전과 비교.
- 쇼케이스 에셋 추가(`assets/showcase`): 세계관 3 · 트리 3 · 장식 30 · 효과 5, 가공 스크립트, 카탈로그 검증 테스트.
- 엔진: `composeScene` 에 `treeLift` 옵션(하단 UI·글자 자리 확보).

## 0.1.0 — 2026-11-18
- 최초 공개: 토큰 498개(대비 86쌍), 세계관 테마 3종, 컴포넌트 CSS 10파일 + lint, 레지스트리 15종, 조립 엔진(compose·placement·compat·validate·fit·dom·canvas), React 바인딩, JSON Schema 4종, 에셋 가공 도구, CC0 데모 에셋.
- 엔진 수정: 점수 → 자리(prominence)를 높이 72% · 중앙 28% 로, 토퍼를 먼저 배치, 최소 크기를 긴 변 기준으로, 장식이 적으면 최대 1.5배로 크게.
- CSS 수정: 닫힌 시트 백드롭이 클릭을 가로채던 문제(`.mv-scene-ui > :where(:not(.mv-backdrop))`).
