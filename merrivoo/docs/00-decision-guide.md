# 00 · 결정 가이드 — 상황별 정답표

| 상황 | 쓸 것 | 값/규칙 |
|---|---|---|
| 페이지 배경(UI) | `color.surface.canvas` | 종이 `#FBF5E8` / 다크 `indigo.950` |
| 카드·시트·입력 면 | `color.surface.default` · `raised` | 크림 `#FFFBF0` |
| 장면 위 글자 판 | `color.surface.glass` + `border.gold` + `blur.glass` | 반투명 크림 90% |
| 본문 글자 | `color.text.primary` / `secondary` / `tertiary` | 대비 4.5:1 보장 |
| 브랜드 글자·링크 | `color.text.brand` | burgundy.800 / 다크 gold.300 |
| 주 버튼 | `.mv-btn` (primary) lg·xl | 52·60px, 한 화면 하나 |
| 보조 버튼 | `.mv-btn--secondary` | 금 테두리 |
| 선택 카드 | `.mv-choice` | 체크 아이콘 + 두꺼운 테두리 + 금 후광 |
| 질문 문장 | `.mv-question` / `.mv-question__text` | 20px 600, 최대 4줄 |
| 세계관 이름·결과 제목 | `.mv-universe-card__title` (display) | 34px→태블릿 42px, 최대 2줄 |
| 점수 숫자 | `.mv-score__value` | Cormorant 56px 라이닝 숫자 |
| 입력 | `.mv-field__input` | 높이 52, 글자 16px 이상 |
| 시트 / 모달 | `.mv-sheet` / `.mv-modal` | 시트가 기본, 모달은 짧은 결정만 |
| 오류·빈·로딩 | `.mv-state` / `.mv-spinner` / `.mv-skeleton` | 모든 화면에 함께 |
| 그림자 | `shadow.sm/md/lg/xl`(따뜻한 갈색), 선택 후광 `shadow.gold` | 검정 그림자 금지 |
| 간격 | `space.*` 4px 그리드 | 카드 안 20, 요소 사이 12~16 |
| 시간 | `motion.duration.fast 120 / normal 220 / slow 360`, 장면 `scene-enter 900 / scene-reveal 1400` | easing `soft-out`·`spring` |
| 세계관 색 | `[data-world]` → `color.scene.*`, `border.gold` | 그 외 색 변경 금지 |
| 장식 자리 | `placeOrnaments` | 점수 높을수록 위·가운데 |
| 포스터 글자 위치 | 위 12% · 아래 18% 비움 | 인스타그램 스토리 UI |
