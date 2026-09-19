# Changelog

## yeohaenggajya-v1.0.0 — 2026-09-19

첫 버전. 원본 `frontend/src/styles/tokens.css`(73 변수) + `.claude/skills/design-system`(SKILL + references 5편) + `components/*.module.css` 실측을 winterholic 형식으로 기록. **디자인 값 변경 없음**(legacy-aliases 대조 73/73 일치).

- 원시: 한지 5·단청 8·잉크 4·한국색 8·홀로 5·무대 3 (램프 생성 안 함).
- 시맨틱: surface·text(decorative 분리)·border(먹선)·action(red/blue/ghost/danger)·rarity 6종×(accent·text·glow·solid)·status·chip·interactive·band·fx·chart. 무대 톤 1:1.
- 치수: sp 1~12, control(30/40/50/52), capsule 5단계×1.18, card 200, dex-cell 108, 기둥 w-* 4 + phone/frame/cta, 헤더 52·띠 6, radius(+frame 32·paper-bar 10), 먹선 두께 5단계.
- 타이포: 서체 7 역할 고정, 스타일 19(heading·body·ui·button·brush·rank·mono·seal·hand·caption).
- 효과: 그림자 stamp/paper/foil/holo/deep(+무대), 오방색 띠·홀로 그라데이션, 한지 텍스처, z-index(fx·capsule·tabbar·cta·sheet·stage).
- 모션: 180/320/700 + 키프레임 11종 주기·회전·스케일.
- 컴포넌트 토큰 30종.
- 빌드: `[data-tone="dark"]` 스코프(시스템 다크 무시), legacy-aliases.css(원본 변수명 전부), `.yg-band`·`.yg-hanji-scroll` 유틸, 대비 92쌍.
- 문서 16편(11 = 등급·연출, 15 = 원본 점검 14항목·정정 권고 3줄, 16 = 상황 사전), AI 규칙, 미리보기.
