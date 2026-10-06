# Changelog — AIP Design System

## 1.2.1 — 2026-10-07

- 줄바꿈: 제목·카드 제목·statement 에 `text-wrap: balance`, 본문·목록·캡션에 `text-wrap: pretty`. 한글 keep-all 에서 줄 끝에 낱말 하나만 떨어지던 문제를 막는다.
- 일본어는 `word-break: auto-phrase` 로 구 단위에서 끊는다(リリ/ース 같은 낱말 중간 끊김 방지).

## 1.2.0 — 2026-10-07

실제 소개 페이지(AIP 웹사이트)에 조립해 보니 어색했던 프레젠테이션 부품을 고쳤다. 토큰 검사는 통과했지만 구성 품질은 검증된 적이 없던 부분이다.

- Statement: 기본을 면 없는 큰 글자 + 왼쪽 선으로 변경. 형광펜 면은 `aip-statement--highlight` 로 분리.
- Comparison: 두 쪽을 같은 면으로 통일하고 패딩을 넓힘. 양쪽 예시를 같은 높이에 두는 `aip-comparison__foot` 추가.
- Chapter: `aip-chapter--stacked` 추가. 본문이 넓은 시각 자료일 때 서론 위·본문 전체 폭.
- Flow: `aip-flow--focus` + `data-focus` 추가. 강조 노드 하나만 개념 색, 나머지는 중립.
- docs/12·19 에 언제 어느 쪽을 쓰는지 규칙 추가.

## 1.1.0 — 2026-10-06

오픈소스 소개와 기술 포트폴리오 프레젠테이션 구성 확장.

- built-in image_gen으로 3D 브랜드 자산 3종 제작: 실제 투명 배경 Aipi, Intent→Runtime 히어로, 분해 레이어. 승인된 PNG·웹 제공 WebP·전체 프롬프트 보존.
- `presentation.css`를 배포 `components.css`에 포함: Story Hero·Artwork·Project Meta·Chapter Nav·Chapter·Statement·Comparison·Feature Stage·Proof·Decision List·Milestones·Story Next.
- 재사용 템플릿 3종: Showcase, Architecture, Case Study. 같은 토큰으로 라이트·다크·반응형 지원. 근거·조건·한계와 미측정 상태 포함.
- 홈페이지와 전 부품 미리보기에서 3D 자산과 새 템플릿으로 연결.
- 3D 금지 규칙을 요청에 맞춰 수정. 정확한 구조 설명은 다이어그램·HTML, 3D는 개념 이미지라는 구분 유지. docs/19 조립 계약과 브랜드·AI 규칙·문서 지도 갱신.
- 형광펜 면의 보조 글자 대비 쌍 추가(총 312쌍). 브라우저 검사를 새 페이지·테마·이미지 로드·장 이동까지 확장.

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
