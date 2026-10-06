# Changelog — AIP Design System

## 1.0.0 — 2026-10-06

첫 공개. AIP 생태계(홈페이지·Docs·MakeAIP·Playground·아키텍처 시각화)가 공유하는 foundation 과 컴포넌트.

### Foundation
- Brand Palette 5색(Blue·Tangerine·Yellow·Charcoal·Slate)을 앵커로 OKLCH 램프 7종 생성(보강 red·green). 중립은 `charcoal` 채도 곡선, neutral·slate 에 다크 면 단계 925·975.
- 시맨틱 색: surface·text·border·action(4 variant)·status(5)·interactive + AIP 도메인 highlight·code·lifecycle·diagram(개념 9 + 선 5). 라이트·다크 1:1, 대비 310쌍 자동 검사.
- 타이포: Pretendard + JetBrains Mono(리거처 끔). 마케팅·문서·UI·코드 네 묶음 26 스타일. 하한 12px, 문서 본문 16/1.7.
- 간격 4px, radius 2~16, 선 1/2/3, 그림자 4단(떠 있는 것만), 점 격자 패턴, z-index 10단, 모션 3단 + 시간 토큰. 그라데이션 토큰 없음.

### Components (구현 포함)
- `components/*.css` 12개 → `dist/components.css`. 빌드가 hex·rgb·px·ms·z-index 숫자·색 이름·`transition: all`·`!important`·없는 토큰 변수를 막는다.
- `dist/aip.js`: 탭(언어 동기화·기억), 복사(프롬프트·삭제 줄 제외), 긴 코드 접기, 다이얼로그·드로어, 메뉴, 툴팁(WCAG 1.4.13), TOC 위치, ⌘K 검색, 테마 전환.
- core: Button·Icon Button·Link·Field/Input/Textarea/Select·Checkbox/Radio/Switch·Segmented·Tabs·Badge/Version·Card·Callout·Tooltip·Dropdown·Dialog/Drawer·Header/Nav·Breadcrumb·Pagination·Table·Empty/Status/Spinner/Skeleton·Kbd.
- 문서: Docs 셸·Sidebar·TOC·Pager·Prose(GFM alert·Prism/hljs/Shiki 매핑·앵커·절 번호)·Code Block·Code Tabs·Inline Code·Spec·Example·Params·Signature·Diagram container·Search.
- 앱: Configurator·Option card·Action bar·File tree·Workbench·Toolbar·Pane·Editor·Status bar·Run log.

### 산출물
`tokens.css` `typography.css` `prose.css` `components.css` `aip.js` `tokens.js/.d.ts` `tokens.global.js` `tailwind.preset.cjs` `tokens.scss` `tokens.figma.json` `diagram.mermaid.json` `contrast-report.json`.

### 브랜드·예제·문서
- 심볼(Blue 타일 + 제도용 Λ + Yellow 형광펜 가로획)·도형 워드마크·락업 2종·파비콘·앱 아이콘(일반·maskable·apple)·히어로, 생성 스크립트.
- `examples/` preview + 제품 템플릿 4종(home·docs·makeaip·playground). Chrome 렌더로 라이트·다크·390px 검토.
- `docs/` 00~18.
