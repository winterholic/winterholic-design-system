# Changelog — Ttakkari Design System

## 1.3.1 — 2026-10-17

### 고친 오류 (tk.js 툴팁)
- 포커스·블러가 한 프레임 안에 지나가면, 이미 숨은 툴팁에 뒤늦은 `requestAnimationFrame` 이 `data-open` 을 다시 달았다. 숨기면서 예약된 프레임을 취소하고, 프레임 콜백도 숨지 않았을 때만 `data-open` 을 단다.
- 포커스 직후 아직 뜨기 전(대기 타이머)에 Esc 를 누르면 무시되어 그 뒤에 툴팁이 떠 있던 틈을 막았다. 대기 중에도 Esc 가 취소한다.
- `check:ui` 의 툴팁 항목은 숨은 툴팁의 `data-open` 에 속지 않게 `:not([hidden])` 인 것을 기다린다. 간헐 실패(57/58)의 원인으로 추정한 경합이다. 실제 브라우저 재현은 하지 못했고 jsdom 에뮬레이션으로 같은 순서에서 수정 전 count 1, 수정 후 0 을 확인했다.

## 1.3.0 — 2026-10-17

토끼 마스코트 확정(사용자 결정)에 따라 브랜드 얼굴을 '따' 글리프에서 마스코트로 바꾸고, 새로 납품된 상태 컷 10종과 작은 크기 아이콘 세트를 연결했다. 토큰·컴포넌트 규칙은 그대로다.

### 브랜드
- 로고 심볼 · 파비콘 · 앱 아이콘(512·192) · maskable · apple-touch: 이미지 생성 세션의 작은 크기 전용 아이콘(`brand/generated/icons/icon-mascot-*`, Blue 타일 + 얼굴·귀)에서 파생. `build-brand-assets.py` 는 모서리 깎기·포맷·크기 선택만 한다(Pillow + numpy).
- ICO 는 16·32·48 손질본을 그대로 담는다. maskable 은 원본의 귀 끝이 안전 영역(가운데 80% 원)을 약 2% 넘어 가장자리 색을 늘려 한 번 더 줄였다.
- 어두운 면 락업은 Blue 타일을 그대로 둔다. 히어로는 마스코트 전신(Paper 띠). 단색 심볼은 얼굴 실루엣(한 덩어리, 알려진 한계).
- `dist/pwa.json` 에 192 아이콘 추가. 옛 '따' 는 에이전트 아바타(`.tk-avatar--agent`, CSS)에만 남는다 — 브랜드 얼굴과 정보 표지는 층이 다르다.
- 나머지 시안 3종(참새·떡·후드)은 `brand/generated/characters/` 에 보존만 한다.

### 일러스트
- 상태 컷 10종 추가(`state-not-found` `state-no-results` `state-forbidden` `state-session-expired` `state-update-available` `state-unsupported-preview` `state-link-expired` `state-notifications-empty` `state-vpn-required` `state-diff-clean`). 웹 파생본 29키 × 2, 예산 통과. 미리보기 `examples/art.html` 에 추가.
- 문서: 16(컨셉·파일 지도·재생성), 20, 23(확정 반영·컷 목록·아이콘 결정과 한계·작업 상태).

### 검사
- 브랜드 테스트를 마스코트 계약으로 교체: 이미지 심볼, 옛 글리프 없음, 원본 존재, 192 크기, maskable 안전 영역(반지름 40%).
- 코드 규칙·토큰은 변경 없음.

## 1.2.0 — 2026-10-17

앞으로 늘어날 페이지의 정답지(페이지 아키타입)와 실제 앱에서 반복된 UI 실수를 시스템 차원에서 막는 검사. 시드 13색·Blue 사람·Mint 에이전트·잉크 면 규칙은 그대로다.

### 검사 (새로 막는 것)
- `scripts/ttakkari-layout.check.mjs`(`npm run check:layout`): 페이지를 6폭(320·390·768·1024·1440 + 가로 모드 844×390) × 평소/긴 글자 주입 × 라이트/다크로 열어 가로 넘침·화면 밖 요소·조용한 잘림·말줄임 title·gap+margin 이중 간격·터치 44(히트 영역 포함)·입력 16·글자 12·safe-area(위·아래·좌우)·본문 바로가기 노출·모달 크기(화면 안·여백·본문 스크롤·자식 넘침)를 잰다. `--url` 로 실제 앱에도 쓴다.
- 빌드 레이아웃 lint 5종: nowrap 짝(말줄임·스크롤·flex:none), 아래 고정 + safe-area, `vh`, `100vw`, 자식 `margin-top`. 예외는 규칙 본문 `/* lint-ok: 이유 */`.
- 정적 테스트: 예제를 하위 폴더까지 검사, 아키타입 예제와 docs/21 의 짝, 검사 규칙과 docs/22 의 짝.

### 고친 오류(기존 컴포넌트)
- 터치: 아이콘 버튼(40)·버튼·칩·세그먼트·경로 링크가 보이는 크기는 그대로 두고 `::after` 로 44 까지. 칩은 짧아도 폭 44.
- 넘침: Button·Badge·Dropdown `max-width: 100%`, 라벨 `<span>` 말줄임. 칩은 flex 줄에서 줄어든다(`flex: 0 1 auto`). `.tk-empty` 자식이 `max-content` 로 커져 양쪽으로 새던 것(칩 줄)을 막았다. 헤더 메타 줄 말줄임. 로그 머리 행동이 줄어들지 않게. 글자를 담는 상자(카드·콜아웃·메시지·승인·실행·토스트·다이얼로그)는 `overflow-wrap: anywhere`.
- 모달: `.tk-dialog` 가 safe-area(위·아래·좌우)와 모바일 좌우 12 여백을 직접 계산한다. 헤더·푸터 고정, 본문 스크롤. 제목 줄바꿈.
- safe-area: 본문 바로가기가 노치 기기에서 화면 위에 걸려 보이던 것, 가로 모드에서 앱 좌우가 노치 아래로 들어가던 것(`.tk-app` 좌우 inset), 전체 화면 뷰어의 아래·좌우, 드로어 왼쪽.
- 사이드바 없는 `.tk-app`(≥1024)이 본문을 280 열에 가두던 것.
- 예제: 헤더 제목·메타에 `title`.

### 새 컴포넌트 (토큰은 `color.art.halo` 하나만 추가)
- Data(`components/data.css`): `.tk-datatable`(스크롤 상자·머리 고정·첫 열 고정·정렬·`--stack` 카드화·상태 행) · `.tk-stats`/`.tk-stat`(`data-tone`) · `.tk-chart`(래퍼·`data-series` 1~6·범례·읽기 줄·데이터 표·상태) · `.tk-spark` · `.tk-diff`(통합·나란히·줄 바꿈·줄 번호 고정·접기·리뷰 댓글) · `.tk-timeline`.
- Workbench(`components/workbench.css`): `.tk-toolbar` · `.tk-panes`(컨테이너 폭으로 칸 수, 좁으면 탭, `--tabs`) · `.tk-editor` · `.tk-canvas`/`.tk-node`/`.tk-edge`(`--tk-pan-x/y`·`--tk-zoom`) · `.tk-stream`(`data-state`) · `.tk-keybar` · `.tk-pad`.
- Art: `.tk-art`(일러스트 자리, `data-pending`, 다크 윤곽 띠).
- tk.js: `initPanes` · `initCanvas`(끌기·핀치·휠·키보드·`tk:canvaschange`) · `initDiffs` · 말줄임 title.

### 문서·예제·자산
- docs 21 페이지 아키타입(10종: 저장소·PR·자료 노트·연구 지표·글쓰기·그래프·시장·창작·원격 조종·갤러리), 22 UI 실수 방지, 23 일러스트 자산 명세, 24 데이터·작업대 컴포넌트. 00·14·15·README·CLAUDE.md 갱신. 00 의 모바일 선택 행을 앱 결정(바텀 시트 폐지)에 맞췄다.
- examples/archetypes/ 10종 + index, examples/art.html. icons.js 에 아이콘 65개 추가.
- assets/art/: 마스코트 일러스트 19컷의 WebP 파생본(480·960, 예산 60·180 KB) + `build-art.py`. 원본은 `brand/generated/`(별도 세션 산출물)이고 이 시스템은 이미지를 만들지 않는다.

## 1.1.0 — 2026-10-11

### Components
- 커스텀 Select: `.tk-select > button.tk-select__trigger[role=combobox]` + `.tk-menu[role=listbox]` > `.tk-menu__item[role=option][aria-selected]`. 네이티브 select 와 같은 상자·크기·상태 선택자를 쓰고, 목록은 트리거 폭을 따라간다. 네이티브 `<select>` 가 OS 팝업으로 열려 화면 톤이 끊기던 문제(docs/06 §4, docs/00 §7). tk.js 동작은 아직 없다.
- `.tk-presence` 를 `<p>` 로 쓰면 문단 기본 여백이 붙던 것을 0 으로(사이드바 하단 연결 상태가 떠 보였다).
- Progress `--warning`·`--danger`·`--lg`: 사용량·용량 계기판(80%·95% 경계).
- Menu 토글 항목: `role="menuitemcheckbox"` + `.tk-menu__switch`. ✓ 대신 Switch 모양(docs/06 §13).

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
