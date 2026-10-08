# Changelog — Ttakkari Design System

## 1.0.0 — 2026-10-09

첫 공개. Winterholic Ttakkari(원격 AI 에이전트 PWA)의 채팅·작업 공간·보관함·파일 찾기가 공유하는 foundation 과 컴포넌트.

### Foundation
- 사용자 시드 13색을 값 그대로 정본으로(`brand.*` 5 + `seed.*` 8). 시맨틱 토큰이 시드를 직접 참조하고, `dist/aliases.css` 가 시드 변수 이름(`--background`·`--primary`·`--accent`·`--surface-muted`…)을 토큰에 잇는다.
- OKLCH 램프 7종: blue(600=#296EB4)·mint(300=#00F0B5)·sage(700=#59645F, 라이트 중립)·graphite(900=#30383A, 다크 중립·잉크 면) + 보강 red·amber·plum. sage·graphite 채도 곡선은 시드에서 직접 정했다. `dark-tint.*` 는 다크 카드 면에 18% 섞은 상태 면.
- 시맨틱 색: surface·text·border·action(4)·status(5)·interactive + 도메인 agent·run(6상태)·policy(4)·filetype(7)·ink·viewer·highlight·presence + accent·chart. 라이트·다크 1:1, 대비 510쌍 자동 검사.
- 다크 진입 세 경로: `prefers-color-scheme`·`data-theme="dark"`·`.dark`(시드 규약).
- 타이포 24 스타일(Pretendard + JetBrains Mono, 리거처 끔). 하한 12px, 입력·메시지 16.
- 간격 4px, radius 2~20, 컨트롤 24/32/40/48, 터치 44, 앱 셸 치수(헤더·탭바 56, 사이드바 280, 채팅 열 760, 분할 최소 360), z-index 10단, 모션 + live 맥박.

### Components (구현 포함)
- `components/*.css` 14개 → `dist/components.css`. 빌드가 hex·rgb·px·시간·z-index 숫자·색 이름·`transition: all`·`!important`·없는 토큰 변수와 **블록·글자 역할 이름 충돌**을 막는다.
- `dist/tk.js`: 테마, 탭, 복사, 긴 코드 접기, 다이얼로그·시트·드로어·전체 화면 뷰어, 메뉴, 툴팁(터치 제외), 토스트, 컴포저(Enter 규칙·한글 조합·자동 높이·제안 칩), 스레드 따라가기·새 메시지, 로그 따라가기, 분할 손잡이, 뷰어 배율·찾기, 선택 모드.
- core: Button·Icon Button·Link·Field/Input/Select/Search·Checkbox/Radio/Switch·Segmented·Tabs·Badge·Chip(필터·제안·문맥)·Card·Callout(GFM 5)·Tooltip·Menu·Dialog·Sheet·Drawer·Toast·Header·Tabbar·Sidebar/Nav/Session·Path·List·Table·Meta·Empty·Status·Spinner·Skeleton·Progress·Avatar(에이전트 '따')·Dot·Presence·Banner·Kbd.
- 채팅: Thread·Message(사용자·에이전트·시스템·오류)·Thinking·Caret·Jump·Suggestions·Composer.
- 실행·승인: Run card·Steps·Log·Approval·Checks.
- 결과물·뷰어: Glyph·Ext·Artifact row·Artifact card·Policy·Policy note·Retention·Filter bar·Selection bar·Tree·Detail · Viewer 셸(툴바·찾기·안내·후속 지시)·본문 7종(prose·desk/page·stage·frame·cells·code viewer·state)·Viewer dialog.
- `prose.css`: `.tk-prose`(문서 뷰어)·`--compact`(메시지 안 Markdown), GFM alert·Prism·hljs·Shiki 매핑.

### 산출물
`tokens.css` `typography.css` `prose.css` `components.css` `aliases.css` `tk.js` `tokens.js/.d.ts` `tokens.global.js` `tailwind.preset.cjs` `tokens.scss` `tokens.figma.json` `monaco-theme.json` `pwa.json` `contrast-report.json`.

### 브랜드·예제·문서
- 심볼: Ink 타일 + Paper '따' + Mint ㅏ 가로획(첫 시안 ㄷ ㄷ + 커서가 'CC.' 로 읽혀 교체). 도형 워드마크 `ttakkari`, 락업 2종(어두운 면은 타일 없음), 파비콘 SVG·PNG·ICO, 앱 아이콘(일반·maskable·apple), 히어로, 생성 스크립트.
- `examples/` preview + 템플릿 5종(chat·workspace·library·files·auth). Chrome 렌더로 라이트·다크·360~1440 검토.
- `docs/` 00~20. 검사: `scripts/ttakkari-design-system.test.mjs`(정적), `scripts/ttakkari-interaction.check.mjs`(Chrome 58개), `scripts/brand-assets.test.mjs`(브랜드).
