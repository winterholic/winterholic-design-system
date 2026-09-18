# Changelog

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
