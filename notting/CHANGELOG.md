# Changelog

## notting-v1.2.0 — 2026-09-20

- 온보딩 4단계, 로그인·초대, 대표 빈 상태, 오프라인·읽기 전용·충돌·오류, 가져오기 3상태를 실제 렌더 화면으로 추가
- `SetupShell`, `StepIndicator`, `EmptyState`, `Coachmark`, `SetupChecklist`, `ResultState` 조립 규칙 문서화
- 데스크톱·모바일, 라이트·다크, 키보드 포커스, reduced motion을 경험 템플릿에 반영
- 기록지기 캐릭터를 환영·첫 워크스페이스·404에만 사용하는 장면 규칙 추가
- 기본 미리보기에서 경험 템플릿 갤러리로 바로 이동하는 링크 추가

## notting-v1.1.0 — 2026-09-20

- 기존 잉크 타일·문서 줄·verdigris 근거 마커 로고 기하는 변경 없이 유지
- iOS용 `apple-touch-icon-180.png`, PWA/Android용 `app-icon-maskable-512.png`, 16~256 멀티사이즈 ICO 추가
- 로고 세계관을 확장한 기록지기 캐릭터와 투명 PNG·WebP·정사각 아바타 추가
- 캐릭터의 역할·색·표정·크기·AI 근거 불빛 사용 규칙을 브랜드 문서에 추가
- preview 브랜드 영역에서 심볼·단색형·전체 아이콘 규격·캐릭터를 함께 검수하도록 갱신

## notting-v1.0.0 — 2026-09-20

첫 버전. `C:\notting\docs\initial-plan.md`(Draft v0.1) 를 읽고 winterholic-base 구조로 파생·확장.

- 팔레트: coolors 후보 7개 중 "Floral White · Black · Vibrant Coral · Verdigris · Soft Periwinkle" 선정, 주색 **Verdigris `#1EA896`**. Periwinkle 을 AI·근거 전용, Coral 을 위험·손실 전용으로 역할 분리. 성공 Leaf Green, 경고 Marigold 보강. 중립은 hue 80 `stone` 곡선(채도 1/3) 신규.
- 원시 램프 6종 × 11단계 OKLCH 생성. teal 500 고정(원색 2.96:1 이라 액션 600·글자 700).
- 시맨틱 색 라이트·다크 1:1: surface·text(+ai)·border(+ai)·action(+ai)·status·interactive·accent·chart + **도메인 그룹 9종** `ai` `citation` `mark` `diff` `workflow`(이슈 6상태) `priority` `decision`(ADR 5상태) `fidelity`(왕복 등급 5) `code`(하이라이트 7).
- 간격·크기: base 스케일 유지 + `layout.page-toolbar 48` `sidebar 260` `sidebar-collapsed 0` `panel 320` `editor 760` `editor-wide 1080` `block-gutter 32` `indent 24` `cover 240/160`, `border-width.marker 3`.
- 타이포: Pretendard + JetBrains Mono(항상 로드), `line-height.prose 1.7`, UI 스타일 22종(`mono-label` `kbd` 추가) + **문서 스타일 7종** `prose-title/h1/h2/h3/body/code/caption`.
- 효과: ink 계열 그림자 + `shadow.ai`, 그라데이션 `brand` `context` `paper` `ink` `scrim-bottom` `fade-bottom`, `opacity.ghost-block` `stale`, `z-index.sidebar`.
- 모션: `duration.stream-caret 800` `flash 1200`, `distance.panel`, `scale.drag`.
- 컴포넌트 토큰: 범용 17종 + notting 전용 20종(editor·block-callout/code/quote/toggle/table/image/divider·inline-code·inline-toolbar·slash-menu·command-palette·page-tree·page-toolbar·panel·property-row·status-pill·citation·ai-answer·context-pack·report·diff·search-result·save-indicator·issue-card·board·revision-list·backlink·kbd).
- 빌드: base 산출물 8종 + **`dist/prose.css`**(`.nt-doc` 문서 본문·콜아웃·토글·근거 칩·flash) + `typography.css` 에 `::selection` `mark` `kbd` 전역. 대비 검사 **210쌍**(코드 하이라이트·근거 칩·도메인 필·diff·우선순위 포함).
- 문서 17편: 00 결정표 · 01~14(base 골격을 notting 값으로 전면 재작성, 06 은 34절) · **15 제품 매핑**(기획서 개념 → UI 규격 대조, Gate 검증 항목) · **16 상황 사전**(A~J + K 에디터 · L 왕복 · M AI·근거 · N 이슈·revision) + CLAUDE.md + 미리보기.
- 자산: 잉크 타일 + 근거 마커 심볼(SVG 컬러·단색·락업 2종·파비콘 SVG/PNG/ICO·앱 아이콘 512·히어로 1600×900)을 `assets/brand/build-brand-assets.py` 하나로 생성.
