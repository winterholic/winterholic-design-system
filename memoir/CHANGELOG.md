# Changelog

## memoir-v1.0.0 — 2026-09-19

첫 버전. 기획서 §5 + design-guide.md + tailwind.config.ts 를 winterholic-base 구조로 통합·보완.

- 팔레트: 핑크·블루·잉크 기존 값 고정(`fixed`), 램프 6종. 로즈 `#A1385E` 를 액션색, 핑크 `#FF82A9` 를 강조 전용으로 역할 분리(핑크 위 흰 글자 2.33 미달).
- 종이 층 surface(canvas·zone·zone-deep·default·raised·cream·blush) + No-Line 테두리 예외 목록. 캔버스를 순백에서 `#FFF9F8` 로.
- 시맨틱 색 라이트·다크 1:1(따뜻한 다크 신규). chip·category(10종)·code(하이라이트)·status.secure 그룹 추가.
- 타이포: Jakarta + Pretendard 폴백, 역할 스타일 21종(display·headline·editor·label·pin·logo 포함).
- 간격·컨테이너(에디터 prose 680, 캘린더 full)·헤더 60/44·radius·그림자 4단계·글래스 2종·블롭 그라데이션·모션(shake·lock)·z-index.
- 컴포넌트 토큰: 버튼·FAB·인풋(underline/filled)·검색·PIN·칩·태그·언어 배지·카드·코드 블록·명령어 행·북마크·영상·보안 행·폴더·캘린더·헤더·카테고리 드롭다운·모달·벤토 등 28종.
- 빌드: base 산출물 + Tailwind 프리셋에 기존 클래스명 별칭 + `legacy-aliases.css`(--background/--foreground, .text-display 등) + `.mm-glass-*` 유틸. 대비 116쌍 검사.
- 문서 16편(점검 24항목·5단계 이관·클래스 대응표 포함) + AI 규칙 + 미리보기.
- 자산: icon.svg·apple-icon·favicon·mascot 복사. 로고 워드마크 규격 재정의(세리프 → Jakarta).
