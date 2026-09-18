# Changelog

## base-v1.1.3 — 2026-09-18

- 반복 회전하던 단일 결정 팔 구조를 폐기하고, 여섯 갈래를 각각 다른 형태·명도·면 방향으로 직접 설계.
- 중앙 바람개비 인상을 제거하고 히어로 결정처럼 방향성 있는 빛, 반투명 외피, 깊은 내부 저면을 구성.
- 컬러·단색 락업과 작은 크기 전용 축약 파비콘을 새 실루엣에 맞춰 다시 제작.

## base-v1.1.2 — 2026-09-18

- 심볼의 평평한 아이콘 인상을 없애고, 히어로 결정처럼 밝은 외피·중간 청색·깊은 저면이 맞물리는 다층 프리즘 구조로 재설계.
- 세로축은 길게, 대각축은 조금 짧게 조정하고 굵은 흰 구획선을 제거해 입체감과 정제도를 높임.
- 컬러·단색 락업과 SVG/PNG/ICO 파비콘·앱 아이콘을 새 결정으로 다시 렌더링.

## base-v1.1.1 — 2026-09-18

- 기본 심볼을 히어로 이미지와 같은 길고 투명한 여섯 갈래 결정으로 다시 설계.
- 중앙 육각형과 `W`를 제거해 얼음 결정 실루엣과 밝은 중심이 먼저 읽히도록 수정.
- 로고 락업과 파비콘·앱 아이콘을 새 심볼로 통일. 윈티와 브랜드 히어로는 유지.
- 별도 브랜드 미리보기를 없애고 기존 `examples/preview.html` 첫 영역에 자산을 통합.

## base-v1.1.0 — 2026-09-18

- 여섯 갈래 얼음 결정과 `W`를 결합한 컬러·단색 로고, 가로·반전 락업 추가.
- SVG 파비콘과 16·32·48px PNG, 512px 앱 아이콘 추가.
- 얼음 정령 캐릭터 `윈티` 투명 PNG와 겨울 호수 브랜드 히어로 이미지 추가.
- 장식용 얼음 결정과 반복 가능한 서리 패턴 SVG 추가.
- 브랜드 자산 사용 규칙과 전용 미리보기 추가(후속 v1.1.1에서 기존 `examples/preview.html`로 통합).

## base-v1.0.0 — 2026-09-18

첫 버전.

- 팔레트: coolors 후보 중 Bright Snow · Ash Grey · Pearl Aqua · Frozen Lake · Steel Blue 조합 선정, Twilight Indigo 심색 추가. 경고 Tuscan Sun, 위험 Raspberry Red, 차트 보조 Periwinkle·Bubblegum.
- 원시 램프 10종 × 11단계를 OKLCH 로 생성(`tokens/scripts/ramp.mjs`). 브랜드 원색은 정확한 hex 로 램프 안에 고정.
- 시맨틱 색 토큰 라이트·다크 1:1(surface·text·border·action·status·interactive·accent·chart).
- 간격(4px 그리드 17단계)·크기(control·icon·avatar·container·layout)·브레이크포인트·radius·border·focus.
- 타이포: Pretendard, 크기 11단계, 굵기 4, 행간 6, 자간 5, 역할 스타일 20종.
- 그림자 7 + 다크 7, 그라데이션 5, 불투명도·블러·z-index.
- 모션 duration 6 · easing 5 · distance · scale.
- 컴포넌트 토큰 16종.
- 빌드: tokens.json · CSS 변수(라이트/다크/reduced-motion) · typography.css · JS/TS · Tailwind 프리셋 · SCSS · Figma Tokens Studio · 대비 리포트. 라이트/다크 경로 일치와 86쌍 WCAG 대비를 빌드에서 강제.
- 문서 14편(결정 가이드·색·타이포·간격·모양·모션·컴포넌트·상태·접근성·다크·아이콘·데이터시각화·페이지 패턴·운영) + AI 규칙(CLAUDE.md) + 미리보기 페이지.
