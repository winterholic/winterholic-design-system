# 00 · 결정 가이드 — 상황별 정답표 (notting)

> 개발 중 "여기 뭐 쓰지?" 가 떠오르면 이 문서부터 본다. 상황 → 토큰 이름 → 값 순으로 적었다. 이유가 궁금하면 각 행 끝의 문서 번호로 간다.
> 토큰은 CSS 변수 `--nt-<경로>` 로 쓴다. 예: `color.action.primary.bg` → `var(--nt-color-action-primary-bg)`. Tailwind 는 `bg-action-primary-bg`.
> 이 표에 없는 **상황**은 [16 상황 사전](16-situations.md), notting 개념(블록·근거·왕복·이슈)이 UI 로 어떻게 되는지는 [15 제품 매핑](15-product-mapping.md).

## 1. 색

| 상황 | 토큰 | 라이트 값 | 문서 |
|---|---|---|---|
| body·사이드바·우측 패널·툴바 배경 | `color.surface.canvas` | #FBFBF2 | 01 |
| 페이지 본문(에디터)·카드·인풋·표 배경 | `color.surface.default` | #FFFFFF | 01 |
| 모달·슬래시 메뉴·커맨드 팔레트·팝오버 | `color.surface.raised` (+ shadow) | #FFFFFF | 01·04 |
| 표 헤더·kbd·세그먼트 트랙·스켈레톤 | `color.surface.sunken` | #EFECE8 | 01 |
| 코드 블록 배경 / 인라인 코드 배경 | `color.code.bg` / `code.bg-inline` | #F9F6F2 / #EFECE8 | 01·06 |
| 선택된 트리 항목·활성 탭 배경 | `color.interactive.selected-bg` | #DEFFF8 | 01 |
| 랜딩 CTA·온보딩 헤더·로그인 사이드 | `color.surface.brand` 또는 `gradient.brand` | #01685C | 01·04 |
| 본문·제목 글자 | `color.text.primary` | #32302C | 01 |
| 설명·속성 값·검색 스니펫 | `color.text.secondary` | #5C5955 | 01 |
| 캡션·타임스탬프·속성 라벨·블록 핸들 | `color.text.tertiary` | #72706B | 01 |
| 빈 블록·인풋 플레이스홀더 | `color.text.placeholder` | #72706B | 01 |
| 링크 / hover | `color.text.link` / `link-hover` | #01685C / #0D4F46 | 01 |
| 브랜드색 글자(강조 키워드·활성 항목) | `color.text.brand` | #01685C | 01 |
| AI 라벨·근거 번호·'제안' 표시 글자 | `color.text.ai` | #54557C | 01·15 |
| 어두운 면 위 글자 | `color.text.inverse` / `on-brand` | #FFFFFF | 01 |
| 카드·표·코드 블록 외곽선 | `color.border.default` | #DDDAD6 | 01 |
| 사이드바 섹션·속성 행 구분선 | `color.border.subtle` | #EFECE8 | 01 |
| 인풋 외곽선 | `color.border.strong` | #A8A6A1 | 01 |
| 체크박스·라디오 외곽선 | `color.border.input-strict` | #8C8984 | 01·08 |
| 포커스 링 | `color.interactive.focus-ring` 2px offset 2 | #0D8273 | 08 |
| 주 버튼 배경 / 글자 | `color.action.primary.bg` / `.text` | #0D8273 / #FFFFFF | 01·06 |
| AI 에게 시키는 버튼(물어보기·Pack 만들기) | `color.action.ai.*` | #696B9A / #FFFFFF | 01·15 |
| 보조 버튼 | `color.action.secondary.*` | 흰 배경 + #C5C2BD 테두리 | 06 |
| 텍스트 버튼(고스트) | `color.action.ghost.*` | 투명 + #01685C 글자 | 06 |
| 삭제·되돌릴 수 없는 버튼 | `color.action.danger.*` | #B24C3C / #FFFFFF | 06·07 |
| 비활성 컨트롤 | `color.action.disabled.*` 또는 `opacity.disabled` | #DDDAD6 / #8C8984 | 06 |
| 성공 배너 | `color.status.success.{bg,border,text,icon}` | #E7FFE8 / #AEEEB3 / #156C28 | 07 |
| 경고 배너 | `color.status.warning.*` | #FFF6E6 / #FED48C / #755202 | 07 |
| 오류 배너·유효성 실패 | `color.status.danger.*` | #FFF4F2 / #FCCFC6 / #8F3B2E | 07 |
| 안내 배너 | `color.status.info.*` | #DEFFF8 / #A0ECDE / #01685C | 07 |
| AI 답변 카드·제안 배너 | `color.ai.{bg,border,text,icon}` | #F5F6FF / #D5D7FE / #54557C | 15 |
| 근거 칩 [1] | `color.citation.{bg,text}` / hover | #EAEBFE / #3F405F | 15 |
| 근거가 '현재 아님'(수정·삭제됨) | `color.citation.stale-{bg,text}` | #FEEAC9 / #593E02 | 15 |
| 검색 히트·인용된 구절 | `color.mark.highlight` + `highlight-text` | #FED48C / #211F1C | 15 |
| 에디터 텍스트 선택·블록 다중 선택 | `color.mark.selection` | #C1FBEF | 06 |
| 드래그 삽입 위치 선 | `color.mark.drop-indicator` 2px | #0D8273 | 06 |
| revision diff 추가 / 삭제 / 변경 | `color.diff.{added,removed,changed}-{bg,text,marker}` | 초록 / 코럴 / 앰버 | 15 |
| 3-way merge 충돌 구간 | `color.diff.conflict-{bg,border}` | #F5F6FF / #9395D3 | 15 |
| 이슈 상태 필·아이콘 | `color.workflow.<backlog·todo·in-progress·review·done·canceled>.{solid,bg,text}` | | 15 |
| 이슈 우선순위 아이콘 | `color.priority.<urgent·high·medium·low·none>` | | 15 |
| ADR 상태 배지 | `color.decision.<proposed·accepted·deprecated·superseded·rejected>.*` | | 15 |
| 왕복 보고서 등급 | `color.fidelity.<lossless·normalized·degraded·dropped·opaque>.*` | | 15 |
| 코드 하이라이트 | `color.code.{keyword,string,number,function,comment,punctuation}` | | 01 |
| 상태 배지(채움) | `color.status.<s>.solid` + `.on-solid` | 예: 성공 #238637 + 흰 글자 | 06 |
| 차트 시리즈 | `color.chart.categorical.1` 부터 순서대로 | #1EA896, #9395D3, … | 11 |
| 장식·그라데이션·일러스트 | `color.accent.*`, `gradient.*` | | 01·04 |

**절대 규칙 네 개**
1. 화면 코드에 hex 를 쓰지 않는다. `teal.500` 같은 원시 램프도 직접 쓰지 않는다(장식 예외는 01 §6).
2. 글자색은 `color.text.*` 에서만 고른다. 브랜드 원색 `#1EA896` 은 글자로 못 쓴다(대비 2.96:1).
3. 상태색(코럴·초록·앰버)은 상태를 말할 때만 쓴다. "예뻐서" 코럴을 쓰지 않는다.
4. **periwinkle 은 AI 가 만든 것에만.** 사람이 쓴 문서·버튼·링크에 periwinkle 을 쓰면 사용자가 "AI 가 만들었나?" 하고 읽는다.

## 2. 글자

| 상황 | 스타일 클래스 | 크기/굵기/행간 | 문서 |
|---|---|---|---|
| 문서(페이지) 제목 | `.nt-prose-title` | 36px / 700 / 1.2 (모바일 30) | 02 |
| 문서 안 #·##·### | `.nt-doc h1·h2·h3` (prose.css) | 30·24·20 / 700·600·600 / 1.3 | 02 |
| 문서 본문·리스트·인용·Ask 답변 본문 | `.nt-doc p` = `prose-body` | 16px / 400 / **1.7** | 02 |
| 문서 안 코드 블록 | `.nt-doc pre` = `prose-code` | 14px 모노 / 1.6 | 02 |
| 이미지·표 캡션 | `.nt-prose-caption` + `text.tertiary` | 14px / 400 / 1.5 | 02 |
| 앱 화면 제목(설정·이슈 목록·대시보드) | `.nt-heading-1` | 30px / 700 / 1.3 | 02 |
| 섹션·모달 제목 | `.nt-heading-2` | 24px / 600 / 1.3 | 02 |
| 카드 제목·보드 컬럼 제목 | `.nt-heading-3` | 20px / 600 / 1.3 | 02 |
| 패널 섹션 제목 | `.nt-heading-4` | 18px / 600 / 1.5 | 02 |
| 검색 결과 제목·폼 섹션 제목 | `.nt-heading-5` | 16px / 600 / 1.5 | 02 |
| UI 본문 | `.nt-body-md` | 16px / 400 / 1.6 | 02 |
| 보조 설명·표 셀·스니펫·속성 값 | `.nt-body-sm` | 14px / 400 / 1.6 | 02 |
| 버튼(md)·폼 라벨·표 헤더·트리 항목·이슈 제목 | `.nt-label-md` | 14px / 500 / 1.5 | 02 |
| 큰 버튼·탭·내비 | `.nt-label-lg` | 16px / 500 / 1.5 | 02 |
| 배지·상태 필·작은 버튼 | `.nt-label-sm` | 12px / 500 / 1.5 | 02 |
| 도움말·타임스탬프·저장 상태·속성 라벨 | `.nt-caption` + `text.tertiary` | 12px / 400 / 1.5 | 02 |
| 사이드바 섹션명·슬래시 메뉴 그룹명 | `.nt-overline` | 11px / 600 / 대문자·자간 0.04em | 02 |
| 경로·page ID·revision 해시·이슈 키 | `.nt-mono-label` | 12px 모노 / 500 | 02 |
| 단축키 | `<kbd>` (typography.css 가 스타일링) | 11px 모노 / 500 | 06 |
| UI 안 코드(설정의 CLI 예시) | `.nt-code` | 14px 모노 | 02 |
| 표의 수치·왕복 요약 숫자 | `.nt-numeric` (tabular-nums) | 16px / 500 | 02 |
| 랜딩 히어로 / 섹션 제목 | `.nt-display-lg` / `-md` | 60 / 48px / 700 | 02 |

## 3. 간격·크기

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 문단 블록 사이 | `component.editor.block-gap` | 4px (+블록 상하 패딩 2) | 06 |
| 문서 안 h1·h2·h3 위 여백 | `editor.heading-gap-h1/h2/h3` | 32 / 24 / 20px | 06 |
| 문서 제목↔첫 블록 | `editor.title-gap` | 24px | 06 |
| 에디터 상단 여백(커버 없음 / 있음) | `editor.padding-top` / `-cover` | 80 / 32px | 12 |
| 에디터 컬럼 폭 / 넓게 | `size.layout.editor` / `editor-wide` | 760 / 1080px | 03 |
| 본문 한 줄 폭 | `size.container.prose` | 720px | 03 |
| 블록 핸들 영역 | `size.layout.block-gutter` | 32px | 03 |
| 중첩 블록·리스트 들여쓰기 | `size.layout.indent` | 24px | 03 |
| 트리 들여쓰기 | `component.page-tree.indent` | 16px | 06 |
| 사이드바 / 우측 패널 폭 | `size.layout.sidebar` / `panel` | 260 / 320px | 03 |
| 페이지 툴바 높이 | `size.layout.page-toolbar` | 48px | 03 |
| 아이콘↔라벨 | `space.2` | 8px | 03 |
| 라벨↔인풋 | `space.2` | 8px | 03·06 |
| 인풋↔도움말 | `space.1-5` | 6px | 06 |
| 폼 필드↔필드 | `space.4` | 16px | 03 |
| 버튼↔버튼(같은 그룹) | `space.2` (sm) / `space.3` (md) | 8 / 12px | 06 |
| 카드 안쪽 패딩 | `space.5` (기본) · `space.4` (작은) · `space.6` (큰) | 20 / 16 / 24px | 03 |
| 이슈 카드 패딩 / 카드 사이 | `issue-card.padding` / `board.card-gap` | 12 / 8px | 06 |
| 카드↔카드(그리드) | `space.4` 모바일 · `space.6` 데스크톱 | 16 / 24px | 03 |
| 패널 섹션 사이 | `component.panel.section-gap` | 24px | 06 |
| 섹션 사이(앱) | `space.8` 모바일 · `space.12` 데스크톱 | 32 / 48px | 03 |
| 섹션 사이(랜딩) | `space.16` 모바일 · `space.24` 데스크톱 | 64 / 96px | 03 |
| 화면 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 16 / 24 / 32px | 03 |
| 콘텐츠 최대 폭(앱 표·보드) | `size.container.xl` | 1280px | 03 |
| 컨트롤 높이(기본) | `size.control.md` | 40px | 06 |
| 컨트롤 높이(툴바·트리·패널) | `size.control.sm` | 32px | 06 |
| 컨트롤 높이(모바일 주 액션·팔레트 인풋) | `size.control.lg` | 48px | 06 |
| 아이콘(본문 옆·md 컨트롤·블록 핸들) | `size.icon.md` | 20px | 10 |
| 아이콘(트리·속성 행·인라인 툴바) | `size.icon.sm` | 16px | 10 |
| 페이지 아이콘 | `size.avatar.xl` | 80px | 06 |
| 터치 영역 최소 | `size.touch-target-min` | 44px | 08 |

## 4. 모양·깊이

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 버튼·인풋·드롭다운·코드 블록·콜아웃·이미지 블록 | `radius.md` | 8px | 04 |
| 카드·배너·AI 답변·슬래시 메뉴 | `radius.lg` | 12px | 04 |
| 모달·커맨드 팔레트·바텀시트 | `radius.xl` | 16px | 04 |
| 체크박스·인라인 코드·근거 칩·kbd·블록 선택 배경 | `radius.xs` | 4px | 04 |
| 툴팁·트리 항목·메뉴 항목·sm 컨트롤 | `radius.sm` | 6px | 04 |
| 아바타·상태 필·토글·필 버튼 | `radius.full` | 9999px | 04 |
| 카드(정지) | 테두리 `border.default`, 그림자 없음 | | 04 |
| 클릭 가능한 카드 hover | `shadow.sm` → `shadow.md` | | 04 |
| 드롭다운·슬래시 메뉴·인라인 툴바·팝오버 | `shadow.md` | | 04 |
| 모달·커맨드 팔레트·드래그 중 블록/카드 | `shadow.lg` | | 04 |
| AI 패널 열림·스트리밍 카드 | `shadow.ai` | 보라 글로우 | 04·15 |
| 눌린 상태·kbd 아래 | `shadow.inner` | | 04 |
| 히어로 배경 | `gradient.brand` (135deg) | 진한 verdigris→verdigris→periwinkle | 04 |
| AI 배지·Context Pack 상단 바·강조 텍스트 | `gradient.context` | periwinkle→verdigris | 04 |
| 안 보일 듯한 섹션 배경 | `gradient.paper` | 종이→연한 teal | 04 |
| 커버 이미지 위 제목 | `gradient.scrim-bottom` | | 04 |
| 긴 답변 '더 보기' 페이드 | `gradient.fade-bottom` | | 04 |
| 인용·근거 원문·diff 마커 | `border-width.marker` | 3px | 04 |
| 콜아웃 왼쪽 바 | `border-width.accent` | 4px | 04 |

## 5. 움직임

| 상황 | duration | easing | 문서 |
|---|---|---|---|
| hover 색 변화·토글·블록 핸들 나타남 | `fast` 100ms | `standard` | 05 |
| 드롭다운·슬래시 메뉴·툴팁·토글 블록 펼침 | `normal` 200ms | `standard` / 진입 `decelerate` | 05 |
| 모달·패널·드로어 열기 | `slow` 300ms | `decelerate` | 05 |
| 모달·패널·드로어 닫기 | `normal` 200ms | `accelerate` | 05 |
| 토스트 진입 | `slower` 500ms | `decelerate` | 05 |
| 근거로 이동 후 블록 강조 사라짐 | `flash` 1200ms | `standard` | 05·15 |
| AI 스트리밍 커서 | `stream-caret` 800ms 반복 | `linear` | 05·15 |
| 체크·토글 손잡이·복사됨 | `fast` 100ms | `spring` | 05 |
| 스피너·프로그레스 | 반복 | `linear` | 05 |

## 6. 레이어

| 상황 | `z-index` | 값 |
|---|---|---|
| 인라인 툴바·드래그 중 블록 | `raised` | 10 |
| 사이드바·우측 패널(고정) | `sidebar` | 100 |
| 드롭다운·슬래시 메뉴·멘션 목록 | `dropdown` | 1000 |
| 페이지 툴바·표 헤더 | `sticky` | 1100 |
| 스크림 | `overlay` | 1200 |
| 모달·커맨드 팔레트·드로어 | `modal` | 1300 |
| 모달 안 팝오버·날짜 선택 | `popover` | 1400 |
| 토스트 | `toast` | 1500 |
| 툴팁 | `tooltip` | 1600 |

## 7. 이 표에 없는 상황이면

0. **notting 개념이 문제면 `docs/15-product-mapping.md`** — 블록·근거·왕복 보고서·Context Pack·이슈·ADR·revision 이 화면에서 무엇으로 보이는지.
1. **상황이 문제면 `docs/16-situations.md`** — "제목이 길다", "근거가 없다", "가져온 문서가 깨졌다" 같은 A~N 상황 사전.
2. 비슷한 상황의 행을 찾아 같은 토큰을 쓴다. 새 값을 만들지 않는다.
3. 정말 없으면 `docs/13-governance.md` 의 절차로 토큰을 추가하고 이 표에 행을 넣는다.
4. 임시로 hex·px 를 박아야 하면 `/* TODO(ds): 토큰 없음 */` 주석을 남긴다. grep 으로 나중에 걷어낸다.
