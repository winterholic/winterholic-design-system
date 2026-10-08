# 00 · 결정 가이드: 상황별 정답표 (Ttakkari)

> "여기 뭐 쓰지?"가 떠오르면 이 문서부터 본다. 상황 → 토큰(또는 클래스) → 값 순서다. 이유는 행 끝의 문서 번호로 간다.
> 토큰은 CSS 변수 `--tk-<경로>`로 쓴다. 예: `color.action.primary.bg` → `var(--tk-color-action-primary-bg)`. Tailwind 프리셋에서는 `bg-action-primary-bg`.
> 값은 `라이트 / 다크` 순서다. 하나만 적힌 값은 두 테마가 같다.
> 이 표에 없는 **상황**은 [17 상황 사전](17-situations.md), 요구사항의 무엇이 화면에서 무엇이 되는지는 [18 제품 매핑](18-product-mapping.md)을 본다.

## 1. 색

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| body·채팅 스레드 바탕 | `color.surface.canvas` | #F4F4ED (Paper) / #080705 (Ink) | 01 |
| 카드·입력·패널·실행 카드 | `color.surface.default` | #FFFFFF / #171B1C | 01 |
| 사이드바·뷰어 툴바·표 머리 | `color.surface.subtle` | #ECF2EF / #111516 | 01 |
| 메뉴·다이얼로그·시트 | `color.surface.raised` + `shadow.md·lg` | #FFFFFF / #22292A | 01·04 |
| 칩·중립 배지·스켈레톤·kbd | `color.surface.muted` | #E9ECE8 / #22292A | 01 |
| 세그먼트 트랙·진행 막대 트랙·PDF 책상 | `color.surface.sunken` · `color.viewer.desk` | #E9ECE8 / #111516 | 01·09 |
| 사용자 말풍선·선택된 항목 | `color.surface.brand-subtle` | #F1F8FF / #1A2A37 | 01·07 |
| 방금 도착한 결과물·실행 중 카드 면 | `color.surface.agent-subtle` · `color.agent.bg` | #E1FFF2 / #18332D | 01·08 |
| 본문·메시지 글자 | `color.text.primary` | #080705 / #F4F4ED | 01 |
| 설명·단계 이름·경로 | `color.text.secondary` | #3D4642 / #D1DDE0 | 01 |
| 시각·용량·캡션 | `color.text.tertiary` | #59645F / #A6B0B8 | 01 |
| 링크·활성 탭·선택 필터 글자 | `color.text.link` · `text.brand` | #1D5B99 / #9DC6F5 | 01 |
| 에이전트 이름표·"실행 중" 문구 | `color.text.agent` | #1C684F / #00F0B5 | 01·07 |
| 주 버튼(화면당 1개) | `color.action.primary.*` | #296EB4 (Blue) + 흰 글자 5.27:1 | 01·06 |
| 보조 버튼(기본값) | `color.action.secondary.*` | 흰 면 + #BDC4C1 테두리 | 06 |
| 도구 버튼(복사·닫기·툴바) | `color.action.ghost.*` | 투명, hover #E9EEEC | 06 |
| 삭제·되돌릴 수 없는 행동 | `color.action.danger.*` | #C93A35 + 흰 글자 | 06·10 |
| 카드·패널 경계 | `color.border.default` | #D6DCD7 / #30383A | 01 |
| 입력·체크박스 외곽(3:1) | `color.border.strong` | #828C87 / #808B8E | 01·11 |
| 포커스 링 | `color.interactive.focus-ring` 2px, offset 2px | #296EB4 / #79AAE1 | 11 |
| 실행 중 점·진행 막대(에이전트) | `color.agent.live` | #1D8363 / #00F0B5 | 08 |
| 잉크 면 위 커서·실행 줄·로고 점 | `color.agent.on-ink` · `ink.caret` | #00F0B5 (Mint) | 08 |
| 코드 뷰어·로그·코드 블록 면 | `color.ink.bg` | #171B1C / #111516 (두 테마 모두 어둡다) | 01·09 |
| 구문 강조 | `color.ink.{keyword,string,function,number,type,comment,punctuation}` | #9DC6F5 · #6DECAF · #F6B45B · #FBABA1 · #CCB5F7 · #9CA9AC · #B8C5C8 | 01 |
| 로그 레벨 | `color.ink.log-{time,info,debug,tool,ok,warn,error}` | ok = Mint, warn = amber.300, error = red.300 | 08 |
| 검색 히트·일치 구간 형광펜 | `color.highlight.mark` + `mark-text` | #6DECAF (Mint Soft) + ink | 01·09 |
| 지금 위치한 히트 | `color.highlight.mark-active` | #00F0B5 + ink | 09 |
| 작업 상태 6종 | `color.run.<queued·running·waiting·succeeded·failed·cancelled>.{bg,border,text,icon}` | 08 §1 표 | 08 |
| 파일 정책 4종 | `color.policy.<allowed·approval·blocked·restricted>.*` | 중립·amber·red·plum | 09 |
| 파일 계열 타일 | `color.filetype.<doc·pdf·slide·sheet·image·code·other>.{bg,fg}` | 파랑·빨강·주황·민트·자두·중립 | 09·13 |
| 상태 피드백 | `color.status.<info·success·warning·danger·neutral>.*` | 파랑·민트·amber·빨강·중립 | 10 |
| Mac Studio 연결 점 | `color.presence.<online·connecting·offline>` | 민트·amber·중립 | 10 |
| 장식(로그인·빈 상태) | `color.accent.*` | 브랜드 5색 | 01 |

**절대 규칙 여섯 개**
1. 화면 코드에 hex·rgb()·색 이름을 쓰지 않는다. 원시 램프(`--tk-mint-700`)도 직접 쓰지 않는다(예외 01 §8).
2. **Mint(#00F0B5)는 밝은 면 위 글자·얇은 선으로 쓸 수 없다**(종이 위 1.35:1). 밝은 면에서는 점·아바타·잉크 면 위에만. 글자는 `text.agent`.
3. **Blue 는 사람, Mint 는 에이전트**다. 사람이 누르는 것(주 버튼·링크·포커스·선택·사용자 말풍선)은 파랑, 에이전트가 하고 있거나 해낸 것(실행 중·완료·도착·커서)은 민트. 바꿔 쓰지 않는다.
4. **amber 는 '당신을 기다림'**(승인 필요·주의), **red 는 실패·차단·파괴**, **plum 은 별도 정책 범위**(민감·회사 자료)와 이미지 파일. 셋을 바꿔 쓰지 않는다.
5. 기계가 내놓는 것(코드·로그·터미널)은 두 테마 모두 **잉크 면**이다. 라이트에서 코드를 흰 면에 두지 않는다.
6. Primary 버튼은 화면당 하나다. 승인 카드의 '승인'도 그 화면의 primary 다.

## 2. 글자

| 상황 | 클래스 | 크기 / 굵기 / 행간 | 문서 |
|---|---|---|---|
| 로그인·온보딩 제목 | `.tk-display` | 36 / 700 / 1.25 (모바일 30) | 02 |
| 화면 제목(보관함·설정) | `.tk-heading-1` | 24 / 700 (모바일 20) | 02 |
| 다이얼로그·시트 제목 | `.tk-dialog__title` (= 20 / 600) | | 06 |
| 카드 묶음·상세 제목 | `.tk-heading-3` | 18 / 600 | 02 |
| 실행·승인·결과물 카드 제목 | `.tk-heading-4` · 컴포넌트가 이미 씀 | 16 / 600 | 02 |
| 채팅 메시지 본문 | `.tk-message__body` (= `body-message`) | 16 / 400 / 1.6 | 02·07 |
| 에이전트 Markdown 답 | `.tk-prose.tk-prose--compact` | 16 / 1.6, 문단 12 | 07·09 |
| 문서 뷰어 본문(MD·DOCX) | `.tk-prose` | 16 / 1.7, 열 720 | 09 |
| UI 본문 | `.tk-body-md` | 16 / 400 / 1.6 | 02 |
| 보조 설명·카드 본문·승인 사유 | `.tk-body-sm` | 14 / 400 / 1.6 | 02 |
| 버튼·라벨·탭·칩 | `label-md` (컴포넌트가 이미 씀) | 14 / 500 | 02 |
| 시각·도움말 | `.tk-caption` + `.tk-text-tertiary` | 12 / 400 | 02 |
| 파일 경로·용량·해시·ID·경과 | `.tk-mono-label` · `.tk-mono` | 모노 12 / 500 | 02 |
| 확장자 라벨(PDF·PPTX) | `.tk-ext` · `.tk-badge--mono` | 모노 12 / 600 대문자 | 09 |
| 코드 | `.tk-code` 컴포넌트 (= `source`) | 모노 14 / 1.6 | 09 |
| 실행 로그 | `.tk-log` 컴포넌트 (= `log-line`) | 모노 12 / 1.6 | 08 |
| 단축키 | `<kbd>` | 모노 12 | 06 |
| 수치 | `.tk-numeric` · `.tk-table__num` | tabular | 02 |

글자 하한은 12px 다. 입력과 메시지는 16px 아래로 내리지 않는다(iOS 확대, 장시간 읽기).

## 3. 간격·크기

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 아이콘↔라벨 · 라벨↔인풋 | `space.2` | 8 | 03 |
| 같은 사람의 연속 메시지 사이 | `component.message.gap-same` | 8 | 07 |
| 말하는 사람이 바뀔 때 | `component.message.gap-turn` | 24 | 07 |
| 에이전트 본문 안 블록(문단↔카드) | `component.message.block-gap` | 12 | 07 |
| 카드 패딩 | `component.card.padding` / `-lg` | 16 / 20(md 이상) | 06 |
| 목록 행 | `component.list.row-min-height` · padding | 56 · 12 / 16 | 06 |
| 폼 필드↔필드 | `component.input.field-gap` | 20 | 06 |
| 버튼↔버튼 | `component.button.group-gap` | 12 | 06 |
| 화면 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 16 / 24 / 32 | 03 |
| 채팅 스레드·컴포저 열 | `size.container.thread` | 760 | 03·07 |
| 문서 뷰어 본문 열 | `size.container.prose` | 720 | 09 |
| 헤더 / 탭바 / 툴바 | `size.layout.header` · `tabbar` · `toolbar` | 56 / 56 / 48 | 03 |
| 데스크톱 사이드바 | `size.layout.sidebar` | 280 | 03 |
| 분할 화면 작업 공간 열 · 각 열 최소 | `size.layout.workspace` · `pane-min` | 560 · 360 | 03 |
| 컨트롤 높이 툴바 / 기본 / 모바일 주 행동 | `size.control.sm` / `md` / `lg` | 32 / 40 / 48 | 06 |
| 터치 영역 최소 | `size.touch-target-min` | 44 (`hit-area.inset` −8) | 11 |
| 모바일 노치·홈 바 | `env(safe-area-inset-*)` | 헤더·탭바·시트·컴포저가 이미 처리 | 03 |

## 4. 모양·깊이

| 상황 | 토큰 | 값 |
|---|---|---|
| 인라인 코드·kbd·mark | `radius.xs` | 2 |
| 체크박스·배지·툴팁·xs 버튼 | `radius.sm` | 4 |
| 버튼·인풋·칩 외 컨트롤(기본) | `radius.md` | 8 |
| 카드·실행 카드·코드 블록·콜아웃·lg 버튼 | `radius.lg` | 12 |
| 다이얼로그·시트 위 모서리·컴포저·말풍선 | `radius.xl` | 16 |
| 칩·스위치·상태 점·카운트 배지 | `radius.full` | |
| 카드·실행 카드(정지) | 그림자 없음, `border.default` | |
| 클릭 가능한 카드 hover · 컴포저 · PDF 페이지 | `shadow.sm` | |
| 메뉴·툴팁·최신으로 버튼 | `shadow.md` | |
| 다이얼로그·시트·드로어·토스트·선택 바 | `shadow.lg` | |
| 실행 카드·승인 카드·콜아웃 왼쪽 레일 | `border-width.accent` | 3 |

그라데이션 토큰은 없다. 민트 글로우·유리 효과도 없다(01 §7).

## 5. 움직임

| 상황 | duration | easing |
|---|---|---|
| hover 색·체크·스위치·탭 밑줄 | `fast` 120ms | `standard` |
| 메뉴·툴팁·단계 펼침·결과물 카드 도착 | `normal` 180ms | 들어올 때 `enter` |
| 다이얼로그·시트·드로어·전체 화면 뷰어 | `slow` 260ms | `enter` |
| 실행 중 점 맥박 | `live` 1600ms 반복 | `linear` |
| 툴팁 대기 | `tooltip-delay` 400ms(포커스는 즉시) | |
| '복사됨' 유지 | `feedback` 1600ms | |
| 토스트 자동 닫힘(행동 없을 때만) | `toast` 5000ms | |

`prefers-reduced-motion` 이면 fast·normal·slow 가 0ms, 맥박은 멈춘다(tokens.css·components.css 가 처리).

## 6. 레이어

| 상황 | `z-index` | 값 |
|---|---|---|
| 복사 버튼·최신으로 버튼·분할 손잡이·목록 그룹 머리 | `raised` | 10 |
| 헤더·탭바·컴포저·선택 바 | `sticky` | 1000 |
| 메뉴 | `dropdown` | 1100 |
| 스크림 | `overlay` | 1200 |
| 다이얼로그·시트·드로어·전체 화면 뷰어 | `modal` | 1300 |
| 다이얼로그 안 메뉴 | `popover` | 1400 |
| 토스트 | `toast` | 1500 |
| 툴팁 | `tooltip` | 1600 |

## 7. 컴포넌트를 고를 때

| 하고 싶은 것 | 정답 | 아닌 것 |
|---|---|---|
| 세 영역(채팅·작업 공간·보관함·파일) 이동 | 모바일 Tabbar · 데스크톱 Sidebar 의 `.tk-nav` | 화면 안 탭 |
| 같은 화면 안 내용 전환(정보·기록) | Tabs (`role="tablist"`) | 버튼 여러 개 + 숨김 |
| 2~4개 짧은 상호 배타 옵션(목록·격자) | Segmented | Tabs |
| 결과물 형식 거르기 | Filter chip(`aria-pressed`) 줄 | Select |
| 후속 지시 제안 | Suggestion chip(`data-tk-suggest`, 누르면 컴포저에 채움) | 바로 보내는 버튼 |
| 지금 보는 결과물을 다음 지시에 붙이기 | Context chip(`.tk-chip--context`) | 메시지에 파일명 타이핑 |
| 에이전트가 하는 일 | Run card + Steps (+ Log 미리보기) | 스피너만 |
| 사람의 허락이 필요한 일 | Approval card(채팅 안), 상세가 길면 Dialog | 토스트·확인창 연타 |
| 결과물 하나(채팅 안) | Artifact card(열기 + 다운로드 하나) | 링크 텍스트 |
| 결과물 여러 개(목록) | List + `.tk-artifact` 행 | 카드 그리드(모바일) |
| 결과물 보기 | Viewer(툴바·찾기·배율·다운로드 자리가 형식과 무관하게 같다) | 형식마다 다른 화면 |
| 결과물 행동이 넷 이상 | 모바일 Sheet(`.tk-sheet__actions`), 데스크톱 Menu | 버튼 줄 |
| 모바일에서 무언가를 고르거나 확인 | Bottom Sheet | 가운데 Dialog |
| 되돌릴 수 없는 파괴 확인 | Dialog `--sm` + danger 버튼 | Sheet |
| 즉시 반영 설정 | Switch | Checkbox |
| 다른 화면에 있을 때 끝난 작업 알림 | Toast(행동 하나) | 다이얼로그 |
| 앱 전체 상태(오프라인·재인증) | Banner(헤더 아래 한 줄) | Toast |
| 파일 경로 | Path(`.tk-path`, 모노) | Breadcrumb 문장 |

## 8. 이 표에 없는 상황이면

1. [17 상황 사전](17-situations.md)에서 상황을 찾는다.
2. 화면 단위면 [14 페이지 패턴](14-page-patterns.md)과 `examples/` 의 가장 가까운 템플릿.
3. 비슷한 행을 찾아 같은 토큰을 쓴다. 새 값을 만들지 않는다.
4. 정말 없으면 [15 운영](15-governance.md) §2 절차로 토큰을 추가하고 이 표에 행을 넣는다.
5. 급하게 하드코딩해야 하면 `/* TODO(ds): 이유 */`를 남긴다. `grep -rn "TODO(ds)"`가 부채 목록이다.
