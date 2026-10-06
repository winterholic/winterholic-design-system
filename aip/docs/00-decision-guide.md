# 00 · 결정 가이드: 상황별 정답표 (AIP)

> "여기 뭐 쓰지?"가 떠오르면 이 문서부터 본다. 상황 → 토큰(또는 클래스) → 값 순서다. 이유는 행 끝의 문서 번호로 간다.
> 토큰은 CSS 변수 `--aip-<경로>`로 쓴다. 예: `color.action.primary.bg` → `var(--aip-color-action-primary-bg)`. Tailwind 프리셋에서는 `bg-action-primary-bg`.
> 값은 `라이트 / 다크` 순서다. 하나만 적힌 값은 두 테마가 같다.
> 이 표에 없는 **상황**은 [16 상황 사전](16-situations.md), AIP 제품(Docs·MakeAIP·Playground)에서 무엇이 되는지는 [17 제품 매핑](17-product-mapping.md)을 본다.

## 1. 색

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| body·문서 본문 바탕 | `color.surface.canvas` | #FFFFFF / #211F19 | 01 |
| 문서 사이드바·섹션 띠·표 줄무늬 | `color.surface.subtle` | #F7F7F4 / #15140F | 01 |
| 카드·인풋·표·탭 패널 | `color.surface.default` | #FFFFFF / #211F19 | 01 |
| 드롭다운·다이얼로그·검색 팔레트 | `color.surface.raised` + `shadow.md·lg` | #FFFFFF / #292821 | 01·04 |
| 표 헤더·kbd·세그먼트 트랙·스켈레톤 | `color.surface.sunken` | #EDEDEA / #15140F | 01 |
| 툴팁·토스트 | `color.surface.inverse` | #323029 / #EDEDEA | 01 |
| 랜딩 CTA 띠·브랜드 면 | `color.surface.brand` | #1C77C3 | 01 |
| 선택된 옵션 카드·활성 사이드바 항목 | `color.surface.brand-subtle` / `interactive.selected-bg` | #F1F8FF / #00203D | 01 |
| 본문·제목 글자 | `color.text.primary` | #3D3B30 (AIP Charcoal) / #EDEDEA | 01 |
| 설명·메타·파라미터 설명 | `color.text.secondary` | #5B5A52 / #C3C3BE | 01 |
| 캡션·TOC 비활성·타임스탬프 | `color.text.tertiary` | #727069 / #A7A6A1 | 01 |
| 링크 / hover | `color.text.link` / `link-hover` | #0A5C9C / #93C8FD | 01 |
| 브랜드색 글자(활성 탭·eyebrow·현재 TOC) | `color.text.brand` | #0A5C9C / #93C8FD | 01 |
| 주 버튼(화면당 1개) | `color.action.primary.*` | #1C77C3 (AIP Blue) + 흰 글자 4.69:1 | 01·06 |
| 보조 버튼(기본값) | `color.action.secondary.*` | 흰 면 + #C3C3BE 테두리 | 06 |
| 도구 버튼(복사·닫기·툴바) | `color.action.ghost.*` | 투명, hover #EDEDEA | 06 |
| 삭제·되돌릴 수 없는 행동 | `color.action.danger.*` | #C62948 + 흰 글자 | 06·08 |
| 카드·표·헤더 경계 | `color.border.default` | #DBDBD7 / #3D3B30 | 01 |
| 인풋·체크박스 외곽(3:1) | `color.border.strong` | #8A8983 / #727069 | 01·09 |
| 포커스 링 | `color.interactive.focus-ring` 2px, offset 2px | #1C77C3 / #6DABE9 | 09 |
| 본문 형광펜 `<mark>`·검색 히트 | `color.highlight.mark` + `mark-text` | #F5E663 (AIP Yellow) + charcoal | 01 |
| Important 콜아웃·Example 탭 | `color.highlight.{bg,border,text,icon}` | #FEF9CB / #D2C658 / charcoal | 07 |
| Note 콜아웃·정보 배너 | `color.status.info.*` | #F1F8FF / #0A5C9C | 07·08 |
| Tip·성공 | `color.status.success.*` | #E4FFEE / #0B6A44 | 07·08 |
| Warning·경고 | `color.status.warning.*` | #FFE7DE / #5B3A2E, 테두리 AIP Tangerine | 07·08 |
| Caution·오류·파괴 | `color.status.danger.*` | #FFF4F4 / #A31837 | 07·08 |
| 코드 블록 면(두 테마 모두 어둡다) | `color.code.bg` | #2D2F3C / #12131C | 01·07 |
| 구문 강조 | `color.code.{keyword,string,function,number,type,comment,punctuation}` | #93C8FD · #FAA381 · #F5E663 · #FBA9AD · #9AD2B2 · #A3A5B1 · #C0C2CC | 01·07 |
| 강조 줄 | `color.code.line-highlight` + `line-highlight-marker` | Yellow 14% + Yellow 3px | 07 |
| 인라인 코드 | `color.code.bg-inline` + `text-inline` | #EDEDEA / #323029 | 07 |
| 성숙도 배지 | `color.lifecycle.{stable,beta,experimental,deprecated}.*` | 초록·파랑·탱저린·빨강 | 07 |
| 다이어그램 개념 | `color.diagram.<intent·runtime·execution·permission·frontend·backend·data·external·note>.{fill,stroke,text}` | 12 §2 표 | 12 |
| 다이어그램 선 | `color.diagram.edge.{default,muted,emphasis,allow,reject}` | | 12 |
| 장식(일러스트·히어로) | `color.accent.*` | 브랜드 5색 | 01 |

**절대 규칙 다섯 개**
1. 화면 코드에 hex·rgb()·색 이름을 쓰지 않는다. 원시 램프(`--aip-blue-700`)도 직접 쓰지 않는다(예외 01 §7).
2. AIP Tangerine(#FAA381)과 AIP Yellow(#F5E663)는 **흰 면 위 글자로 쓸 수 없다**(1.98:1, 1.28:1). 면·테두리·코드 면 위 글자로만 쓴다.
3. 노랑은 **형광펜**이다. 상태(경고)가 아니다. 경고는 Tangerine 면(`status.warning`)이다.
4. 빨강·초록은 상태에만 쓴다. 다이어그램에서도 선(거부·허용)에만 쓴다.
5. Primary(AIP Blue 채움) 버튼은 화면당 하나다.

## 2. 글자

| 상황 | 클래스 | 크기 / 굵기 / 행간 | 문서 |
|---|---|---|---|
| 홈페이지 히어로 | `.aip-display-xl` | 60 / 700 / 1.1 (모바일 36) | 02 |
| 랜딩 섹션 제목 | `.aip-display-lg` · `-md` | 48 · 36 / 700 | 02 |
| 히어로·섹션 설명 | `.aip-lead` + `.aip-text-secondary` | 20 / 400 / 1.6 | 02 |
| 문서 페이지 제목(h1) | `.aip-doc-title` | 36 / 700 / 1.25 (모바일 30) | 02 |
| 문서 제목 아래 요약 | `.aip-doc-lead` + `.aip-text-secondary` | 18 / 400 / 1.6 | 02·07 |
| 문서 본문 | `.aip-doc` 안 맨 `<p>` (= `doc-body`) | 16 / 400 / **1.7** | 02 |
| 문서 ## · ### · #### | `.aip-doc h2·h3·h4` | 24 · 20 · 16 / 600 | 02 |
| 그림·표 캡션 | `.aip-doc figcaption` · `doc-caption` | 14 / 400 | 02 |
| 앱 화면 제목(MakeAIP·Playground) | `.aip-heading-1` | 30 / 700 | 02 |
| 다이얼로그 제목 | `.aip-dialog__title` (= 20 / 600) | | 06 |
| 카드·설정 그룹 제목 | `.aip-heading-3` | 18 / 600 | 02 |
| UI 본문 | `.aip-body-md` | 16 / 400 / 1.6 | 02 |
| 보조 설명·표 본문 | `.aip-body-sm` | 14 / 400 / 1.6 | 02 |
| 버튼·라벨·탭·사이드바 항목 | `label-md` (컴포넌트가 이미 씀) | 14 / 500 | 02 |
| 도움말·타임스탬프 | `.aip-caption` + `.aip-text-tertiary` | 12 / 400 | 02 |
| 제목 위 분류 라벨 | `.aip-eyebrow` | 모노 12 / 600 / 대문자 / 0.06em | 02 |
| 코드 블록 | `.aip-code` (= `code`) | 모노 14 / 1.6 | 02·07 |
| 식별자(타입·버전·경로·스펙 ID) | `.aip-mono-label` | 모노 12 / 500 | 02 |
| 단축키 | `<kbd>` | 모노 12 | 06 |
| 수치 | `.aip-numeric` | 16 / 500 / tabular | 02 |

글자 하한은 12px이다. 문서 본문은 16px 아래로 내리지 않는다.

## 3. 간격·크기

| 상황 | 토큰 | 값 | 문서 |
|---|---|---|---|
| 아이콘↔라벨 · 라벨↔인풋 | `space.2` | 8 | 03 |
| 인풋↔도움말 | `space.1-5` | 6 | 06 |
| 폼 필드↔필드 | `component.input.field-gap` | 20 | 06 |
| 버튼↔버튼 | `component.button.group-gap` | 12 (sm 이하 8) | 06 |
| 카드 패딩 | `component.card.padding` / `-lg` | 20 / 24 | 06 |
| 문서 문단↔문단 | `component.doc.block-gap` | 20 | 07 |
| 문서 코드·콜아웃·스펙·그림 위아래 | `component.doc.figure-gap` | 24 | 07 |
| 문서 h2 / h3 / h4 위 | `component.doc.h2-gap` / `h3-gap` / `h4-gap` | 48(+선 위 24) / 32 / 24 | 07 |
| 문서 본문 열 폭 | `size.container.prose` | 720 | 03 |
| 사이드바 / TOC 폭 | `size.layout.sidebar` / `toc` | 272 / 224 | 03 |
| 문서 3열 사이 | `size.layout.column-gap` | 48 | 03 |
| 헤더 높이 | `size.layout.header` / `header-lg` | 56 / 64 | 03 |
| MakeAIP 설정 열 | `size.layout.config` | 560 | 03 |
| 화면 좌우 여백 | `size.layout.page-gutter{,-md,-lg}` | 16 / 24 / 32 | 03 |
| 랜딩 섹션 상하 | `.aip-section` | 64 / 96 (lg) | 03 |
| 컨트롤 높이 기본 / 문서 크롬 / 주 CTA | `size.control.md` / `sm` / `lg` | 40 / 32 / 48 | 06 |
| 아이콘 기본 / 작은 | `size.icon.md` / `sm` | 20 / 16 | 11 |
| 터치 영역 최소 | `size.touch-target-min` | 44 (`hit-area.inset` −8 로 확장) | 09 |
| 앵커 이동 시 제목 위 여백 | `size.layout.anchor-offset` | 88 | 07 |

## 4. 모양·깊이

| 상황 | 토큰 | 값 |
|---|---|---|
| 인라인 코드·kbd·mark | `radius.xs` | 2 |
| 체크박스·배지·툴팁·사이드바 항목·sm 컨트롤 | `radius.sm` | 4 |
| 버튼·인풋·셀렉트·드롭다운(기본) | `radius.md` | 6 |
| 카드·코드 블록·콜아웃·스펙·다이어그램 | `radius.lg` | 8 |
| 다이얼로그·검색 팔레트 | `radius.xl` | 12 |
| 스위치·카운트 배지·도트 | `radius.full` | |
| 카드(정지)·코드 블록·콜아웃 | 그림자 없음, `border.default` | |
| 클릭 가능한 카드 hover | `shadow.sm` | |
| 드롭다운·툴팁·팝오버 | `shadow.md` | |
| 다이얼로그·드로어·검색 | `shadow.lg` | |
| 콜아웃·Example 왼쪽 바·강조 줄 | `border-width.accent` | 3 |
| 활성 탭 밑줄·포커스·선택 | `border-width.strong` | 2 |
| 히어로·다이어그램 바탕 장식 | `pattern.grid-size` + `color.diagram.grid` | 24px 점 격자 |

그라데이션 토큰은 없다(01 §6). 글로우·유리 효과도 없다.

## 5. 움직임

| 상황 | duration | easing |
|---|---|---|
| hover 색·체크·스위치·탭 밑줄 | `fast` 120ms | `standard` |
| 드롭다운·툴팁·접힘 | `normal` 180ms | 들어올 때 `enter` |
| 다이얼로그·드로어 진입 | `slow` 240ms | `enter` |
| 닫힘·사라짐 | `normal` 이하 | `exit` |
| 툴팁 대기 | `tooltip-delay` 400ms(포커스는 즉시) | |
| '복사됨' 유지 | `feedback` 1600ms | |
| 스피너 | 반복 | `linear` |

`prefers-reduced-motion`이면 fast·normal·slow가 0ms가 된다(tokens.css가 처리).

## 6. 레이어

| 상황 | `z-index` | 값 |
|---|---|---|
| 복사 버튼·sticky TOC | `raised` | 10 |
| 헤더·sticky 바·MakeAIP 생성 바 | `sticky` | 1000 |
| 드롭다운·셀렉트 목록 | `dropdown` | 1100 |
| 스크림 | `overlay` | 1200 |
| 다이얼로그·드로어·검색 | `modal` | 1300 |
| 다이얼로그 안 드롭다운 | `popover` | 1400 |
| 토스트 | `toast` | 1500 |
| 툴팁 | `tooltip` | 1600 |

## 7. 컴포넌트를 고를 때

| 하고 싶은 것 | 정답 | 아닌 것 |
|---|---|---|
| 페이지 이동 | `<a>` (`.aip-link`, 카드면 `a.aip-card`) | 버튼에 onclick |
| 같은 페이지 안 내용 전환 | Tabs (`role="tablist"`) | 버튼 여러 개 + 숨김 |
| 2~4개 짧은 상호 배타 옵션 | Segmented | Tabs |
| 큰 선택지(설명·버전이 붙는) | Option card (`.aip-option`) | 버튼 그룹 |
| 즉시 반영 설정 | Switch | Checkbox |
| 제출해야 반영되는 선택 | Checkbox · Radio | Switch |
| 값 하나 고르기(5개 이상) | 네이티브 Select | Dropdown 메뉴 |
| 행동 목록 | Dropdown(`role="menu"`) | Select |
| 같은 코드를 언어별로 | Code Tabs + `data-aip-sync="language"` | 코드 블록 두 개 |
| 정의(이름·타입·제약) | Specification block | 표 또는 코드 |
| 함수 인자·객체 속성 | Parameter rows | 표 |
| 입력 → 결과 예시 | Example block | 코드 블록 + 문단 |
| 알림 문단 | Callout 5종(GFM 이름) | 굵은 문단 |
| 구조·흐름 그림 | Diagram(`data-role`) + 텍스트 설명 | 이미지만 |
| 오픈소스 소개·포트폴리오 | Story Hero + Chapter + Comparison + Proof(19) | Docs에 이미지·카드를 무작정 추가 |
| 3D 브랜드 이미지·캐릭터 | 승인 자산(15) + Artwork + HTML 캡션(19) | 생성 이미지로 실제 구조·UI 대체 |

## 8. 이 표에 없는 상황이면

1. [16 상황 사전](16-situations.md)에서 상황을 찾는다.
2. AIP 제품 화면이면 [17 제품 매핑](17-product-mapping.md)·[13 페이지 패턴](13-page-patterns.md).
3. 비슷한 행을 찾아 같은 토큰을 쓴다. 새 값을 만들지 않는다.
4. 정말 없으면 [14 운영](14-governance.md) §2 절차로 토큰을 추가하고 이 표에 행을 넣는다.
5. 급하게 하드코딩해야 하면 `/* TODO(ds): 이유 */`를 남긴다. `grep -rn "TODO(ds)"`가 부채 목록이다.
