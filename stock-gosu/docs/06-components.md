# 06 · 컴포넌트 규격 (stock-gosu)

각 컴포넌트를 **크기 · 색 · 상태 · 접근성 · 언제 쓰나** 로 적었다. 값은 전부 토큰 이름이다(`component.*` 는 `tokens/src/component.json`, 나머지는 시맨틱). 이 문서만으로 조립이 끝나야 한다. 여기 없는 것은 §22 조립 규칙으로 만든다.

공통 상태 6종: `default` `hover` `active(눌림)` `focus-visible` `disabled` `loading`. 입력류는 `error` `readonly` 가 추가된다. 상태마다 한 가지 속성만 바꾼다(hover 는 배경 한 단계, focus 는 링, disabled 는 색 토큰).

금융 화면 공통 규칙 세 가지
1. 같은 줄에 놓이는 컨트롤은 같은 `size.control` 단계. 툴바는 `sm` 36, 폼은 `md` 44, CTA 는 `lg` 52.
2. 숫자는 `.sg-price-*`·`.sg-numeric`(tabular, nowrap) 으로만.
3. 등락은 부호·화살표 동반. 색만 금지.

---

## 1. Button (기존 `.btn`)

| size | 높이 | 좌우 | 아이콘 | 글자 | radius | 언제 |
|---|---|---|---|---|---|---|
| `xs` | 28 | 8 | 12 | label-sm | md 8 | 표 셀 안, 칩 삭제 |
| `sm` | 36 | 12 | 16 | label-sm | md 8 | 툴바·카드 헤더·필터·표 액션 |
| `md` | 44 | 16 | 20 | label-md 15/600 | lg 12 | **기본**. 폼·다이얼로그. 터치 최소 44 |
| `lg` | 52 | 24 | 20 | label-lg 17/600 | xl 16 | 하단 고정 CTA·로그인·주문 |

variant
| | 배경 / 글자 | 언제 | 화면당 |
|---|---|---|---|
| `primary` | blue.500 / 흰 | 화면의 주 목적 행동(저장·주문·시작). 라벨 15/600 이상 | 1개 |
| `primary-strict` | blue.600 / 흰 | 계정·결제처럼 AA 를 반드시 맞출 화면의 primary | 1개 |
| `secondary` | blue.50 / blue.700 | 주 행동 옆 대안(취소 아님: "관심 추가", "비교") | 제한 없음 |
| `outline` | 투명 + 1.5px gray.300 / gray.700, hover blue.400 테두리 | 필터·정렬·더보기·취소 | 제한 없음 |
| `ghost` | gray.100 / gray.800 | 카드·표 안 가벼운 행동, 아이콘 버튼 | 제한 없음 |
| `danger` | red.600 / 흰 | 매도·삭제·초기화·탈퇴. 확인 시트 안에서만 primary 자리 | |
| `danger-ghost` | 투명 / red.600, hover red.50 | 표 행의 삭제 아이콘 | |
| `disabled` | gray.200 / gray.400 | 조건 미충족. 이유 툴팁 필수 | |

- 아이콘↔라벨 `space.1-5` 6. 아이콘 전용 버튼은 정사각형 + `aria-label` + 툴팁.
- 최소 폭 64(md 이상). 줄바꿈 금지, 길면 문구를 줄인다.
- 상태: hover `bg-hover` `fast`, active `bg-active` + `scale(0.97)`, focus 링 2px offset 2, disabled `action.disabled.*` + `cursor: not-allowed` + `aria-disabled`, loading 스피너 16 + 폭 유지 + `aria-busy` + 클릭 무시.
- 그룹 간격 `space.2`(sm) / `space.3`(md). 데스크톱 우측 정렬, 주 버튼 오른쪽. 모바일 세로 쌓기, 주 버튼 위, 전폭 `lg`.
- 매수·매도 두 개가 나란한 주문 화면: 매수 `primary`, 매도 `danger`. 이 조합만 primary 규칙 예외.
- 전폭(`.btn-block`): 모바일 하단 고정 바 `layout.bottom-cta-pad` 16 + safe-area, 위쪽 `shadow.sticky`.

```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--sg-component-button-gap); height: var(--sg-component-button-md-height); padding-inline: var(--sg-component-button-md-padding-x); min-width: var(--sg-component-button-min-width); border-radius: var(--sg-component-button-md-radius); font: 600 var(--sg-font-size-md)/1.45 var(--sg-font-family-sans); white-space: nowrap; border: 1px solid transparent; transition: background-color var(--sg-motion-duration-fast) var(--sg-motion-easing-out), transform var(--sg-motion-duration-fast); }
.btn--primary { background: var(--sg-color-action-primary-bg); color: var(--sg-color-action-primary-text); }
.btn--primary:hover { background: var(--sg-color-action-primary-bg-hover); }
.btn--primary:active { background: var(--sg-color-action-primary-bg-active); transform: scale(var(--sg-motion-scale-press)); }
.btn:disabled { background: var(--sg-color-action-disabled-bg); color: var(--sg-color-action-disabled-text); cursor: not-allowed; }
```

## 2. Input · Textarea · Select · Search · Amount (기존 `.input`)

| size | 높이 | 좌우 | 글자 | 언제 |
|---|---|---|---|---|
| `sm` | 36 | 12 | body-3 13 | 표 필터·인라인 편집 |
| `md` | 44 | 16 | body-2 15 (모바일 16) | **기본** |
| `lg` | 52 | 16 | body-1 17 | 로그인·검색 히어로 |

- 배경 `surface.default`, 테두리 `border.strong` 1px, radius 12. 채움형(`bg-filled` = sunken-strong, 테두리 없음)은 검색·필터에.
- 라벨 위 `caption` 13/500 `text.secondary`, 간격 6. **항상 보이는 라벨**. 플레이스홀더는 형식 예시("예: 005930")만.
- 도움말 아래 6 `body-3` `text.tertiary`. 필수 `*` `text.danger`. 대부분 필수면 선택 항목에 "(선택)".
- 앞뒤 아이콘·접사 `size.icon.md` `text.tertiary`, 안쪽 12. 단위 접미("원" "주" "%")는 `body-3` `text.secondary` 우측.
- Textarea 최소 96(3줄), `resize: vertical`. Select 는 네이티브 우선, 검색·다중이면 Dropdown(§8).

상태
| 상태 | 처리 |
|---|---|
| hover | 테두리 gray.400 |
| focus | 테두리 `border.focus` + 안쪽 3px `focus-ring-soft`(`box-shadow: 0 0 0 3px`) |
| error | 테두리 `border.danger` + 아래 `body-3` `text.danger` + 아이콘 12, `aria-invalid` `aria-describedby`. 도움말을 오류가 대체 |
| disabled | 배경 `surface.disabled`, 글자 `text.disabled`, 테두리 `border.default` |
| readonly | 테두리 없음, 배경 `surface.sunken`, 글자 primary |

유효성 검사 시점: 첫 blur 후부터, 이후 입력마다. 제출 전 빈 필드에 오류 금지.

**Search**(`component.search`): 높이 48, 채움형 `sunken-strong`, radius 12, 왼쪽 search 20, 오른쪽 X(입력 있을 때) + 시장 세그먼트. 결과 패널 폭 480(모바일 100%), 최대 높이 420, radius 16, `shadow.lg`, `z-index.sticky-panel`, 행 = stock-row compact 52, 헤더 sticky "종목 12건 · ↑↓ 이동 · Enter 선택", 빈 결과 "‘{검색어}’ 종목이 없어요", 최근 검색 5개(입력 전). 키보드 ↑↓ Enter Esc, `role="combobox"` + `aria-activedescendant`.

**Amount**(금액·수량 입력): 숫자 `price-lg` 28/800 우측 정렬, 단위 `body-2`, 밑줄 없음, 아래 프리셋 칩(+1만 · +10만 · +100만 · 최대 / 10주 · 50주 · 최대) `outline sm` 필, 잔고 "주문 가능 1,284,500원" `caption`. `inputmode="numeric"`, 천 단위 쉼표 자동, 초과 시 즉시 오류 "주문 가능 금액을 넘었어요".

**Stepper**(수량): [−] 인풋 [+] 각 44, outline, 길게 누르면 가속. 최소 1.

## 3. Checkbox · Radio · Switch
| 컴포넌트 | 시각 크기 | radius | 테두리 | 선택 시 |
|---|---|---|---|---|
| Checkbox | 20 | `radius.xs` 4 | `border.input-strict` 1px | 배경 `action.primary.bg`, 체크 흰색, `spring` `fast` |
| Radio | 20 | full | 같음 | 테두리 `action.primary.bg` 2px + 안쪽 점 10 |
| Switch | 36×22, 손잡이 16 | full | 없음 | 트랙 gray.300 → `action.primary.bg`, 손잡이 흰색, `fast` `out` |

- 클릭 영역 44(`label` 로 감싸기). 라벨 오른쪽 `body-2`, 간격 8. 라벨 클릭으로 토글.
- 그룹 세로 간격 8. 가로 나열은 3개 이하.
- Switch = 즉시 반영 설정(지표 오버레이 켜기·알림), Checkbox = 제출로 반영되는 선택(스크리너 조건·표 선택). Switch 옆에 저장 버튼이 있으면 잘못.
- indeterminate 는 가로 바 아이콘. 표 헤더 전체 선택에.
- `aria-checked`, 스위치는 `role="switch"`.

## 4. Card (기존 `.card` `.card-flat` `.card-tap`)
| 항목 | 값 |
|---|---|
| 배경 / 테두리 / 그림자 | `surface.default` / `border.default` 1px / `shadow.sm` |
| radius | **2xl 20** 기본 · xl 16 표·리스트 컨테이너(`radius-dense`) |
| 패딩 | sm 16 · **md 20** · lg 24. 표·리스트 카드 0 |
| 제목 | `title-3` 18/600, 우측 액션 ghost sm 또는 "전체 보기 →" link |
| 제목↔본문 | 12 |
| 카드 사이 | 16 모바일 / 24 데스크톱 |
| flat | 그림자·테두리 없이 `surface.sunken`(`.card-flat`) — 카드 안 구획·안내 상자 |
| tap | `cursor: pointer`, hover `shadow.md` + `translateY(-2px)`. 클릭 가능한 카드만. 안에 버튼 있으면 전체 클릭 포기 |

카드 안 카드 금지. 다크에서는 테두리가 주 신호. 이미지 카드는 이미지 radius = 카드 radius(패딩 0) 또는 8(패딩 있음).

## 5. Stock row · Price cell · Market tag (금융 핵심)
**Stock row**(`component.stock-row`, 기존 `.movers-row`) — 검색 결과·관심종목·순위·보유 종목 전부 이 규격.
```
데스크톱 68:  [순위 56 | 로고 32 + 종목명 title-4 + [KOSPI] / 코드·업종 micro | 지표 numeric | 가격 price-sm | 등락 change]
컴팩트 52:    [로고 | 종목명 · 코드 | 가격 · 등락]
모바일 78:    grid "rank identity price / rank metric change", 순위 32, 좌우 16
```
- 종목명 1줄 말줄임, 시장 태그(`market-tag`: 18 높이, 좌우 6, full, `brand-subtle` + `text.brand`, 12/700) 이름 뒤 4.
- 가격 `text.primary`, 등락만 `finance.<d>.text`. 우측 정렬, nowrap. hover `row-hover`, 선택 `selected-bg`, 구분선 `border.default`, 마지막 행 없음.
- 행 전체 링크(종목 상세). 관심 ★ 버튼(28, 터치 44)은 `stopPropagation`.
- 순위 1·2·3 만 `text.primary`, 나머지 `text.tertiary`. 로딩 스켈레톤 5행, 빈 상태 07 §2.
- 정렬 실시간 재배열 애니메이션 금지(05).

**Price cell**(`component.price-cell`): 가격 `price-sm` 위, 등락 `change` 아래, gap 2, 우측 정렬. 배지형은 `finance.<d>.bg` + `on-bg` + ▲▼ 12. 보합 `0.00%` flat 부호 없음. 실시간 `data-tick="up|down"` 배경 플래시 600ms. 지연·마감 `opacity.stale` + 툴팁 "15:30 종가".

## 6. Badge · Tag · Chip · Dot · Count (기존 `.badge-*`)
| 종류 | 규격 | 색 | 언제 |
|---|---|---|---|
| 상태 배지(옅은) | 24, 좌우 10, full, 12/700 | `status.<s>.bg` + `text` | 표·카드 상태 |
| 상태 배지(채움) | 같음 | `status.<s>.solid` + `on-solid` | 눈에 띄어야 할 때. 한 화면 한 형태 |
| 등락 배지 | 같음 + ▲▼ 12 | `finance.<d>.bg` + `on-bg` | 등락률 강조 |
| 시장 태그 | 18, 좌우 6, full, 12/700 | `brand-subtle` + `text.brand` | KOSPI·NASDAQ |
| 분류 태그(각진) | 24, 좌우 8, radius 4 | `status.neutral.*` | 섹터·테마 |
| 필터 칩 | 36, 좌우 12, full, label-sm | outline; 선택 `selected-bg/border/text` + X 16 | 툴바 필터 |
| 신호 배지 | 옅은형 + 아이콘 12 | `status.info` | "골든크로스 감지". 매수·매도 권유 문구 금지 |
| Dot | 8×8 | `status.<s>.solid` | 아바타·탭 옆 |
| Count | 최소 20, 좌우 6, full | `finance.up.solid` + 흰 | 알림 수, 99+ |

배지 글자 두 단어 이하. 아이콘 12 앞, 간격 4.

## 7. Avatar · Stock logo
| size | px | 폴백 글자 |
|---|---|---|
| xs 24 | 종목 행 compact | label-sm 첫 글자 |
| sm 32 | 종목 행·표 | label-sm |
| md 40 | 종목 상세 헤더·계정 | label-md |
| lg 56 | 프로필 | title-3 |
| xl 80 | 프로필 페이지 | title-1 |

radius full, 폴백 `brand-subtle` + `text.brand`, 흰 로고 대비용 `border.subtle` 1px. 겹쳐 쌓기 -8 + 흰 테두리 2 + "+N". 이미지 실패 자동 폴백.

## 8. Dropdown · Menu · Popover · Select(커스텀)
| 항목 | 값 |
|---|---|
| 상자 | `surface.raised`, `border.default` 1px, radius 12, `shadow.md`, 패딩 4 |
| 항목 | 높이 36(터치 44), 좌우 10, radius 8, `body-2`, 파괴 항목 `text.danger` |
| hover / 선택 | `hover-overlay` / `selected-bg` + 우측 check 16 |
| 폭 / 높이 | 최소 160, 트리거 폭 이상 / 최대 320 스크롤 |
| 트리거와 거리 | 4 |
| 구분선 / 그룹 라벨 | `border.subtle` 상하 4 / `micro` `text.tertiary` 패딩 10 |
| z-index | `dropdown` 1000, 모달 안이면 `popover` 1400 |

키보드 ↑↓ Home End Enter Esc 타이핑 점프, `role="menu"|"listbox"`. 화면 밖이면 flip. Popover(내용형) 패딩 16, 최대 폭 320, 화살표 없음. 다중 선택 Select 는 체크박스 항목 + 하단 "적용" sm.

## 9. Tooltip · Chart tooltip
- Tooltip: `surface.inverse`, `text.inverse`, `body-3`, 6/8, radius 6, 최대 240, 트리거와 8, 지연 300ms(마우스), 포커스 시도 표시, 화살표 없음, `z-index.tooltip`. 아이콘 버튼 필수. 지표 용어(PER·RSI) 옆 ⓘ 16 에 한 줄 설명. 터치에서는 탭 → 팝오버.
- Chart tooltip(`component.chart-tooltip`): `tooltip-bg`(흰 96%), `border.default`, radius 12, `shadow.md`, 8/10, 최소 160, `body-3`. 첫 줄 날짜 `caption` tertiary, 이후 "색칩 8 · 시리즈명 · 값 우측 numeric". 등락은 방향색 + 부호. DOM 이라 CSS 변수 사용.

## 10. Toast · Alert(배너) · Inline message
| 종류 | 위치·크기 | 색 | 언제 |
|---|---|---|---|
| Toast | 우하단(데스크톱) / 탭바 위 72(모바일), 폭 360, 패딩 16, radius 16, `shadow.lg`, 최대 3개 gap 12 | `surface.inverse` + `text.inverse`, 상태 아이콘만 `status.<s>.solid` | 동작 결과 |
| Alert | 콘텐츠 상단·섹션 안, 패딩 16, radius 16, 1px 테두리 | `status.<s>.bg/border/text/icon` | 페이지·섹션 상태 |
| Inline | 필드 아래 `body-3` + 아이콘 12 | `text.<s>` | 유효성 |
| 시장 상태 배너 | 상단 고정, 닫기 없음 | `status.neutral` | 장 마감·점검·지연 |

Toast 3초, 오류 6초, 액션 있으면 자동 닫힘 없음. 한 문장. `role="status"|"alert"`. 폼 오류는 토스트 아님.
Alert 아이콘 20 왼쪽, 제목 `label-md`(오류는 필수), 본문 `body-3`, 액션 링크. 페이지에 1개.

## 11. Table (기존 `.table-scroll`)
| 항목 | 값 |
|---|---|
| 헤더 | `surface.sunken`, 44, `micro` 12/500 `text.tertiary`, sticky top, 정렬 열만 `text.primary` + 화살표 16 |
| 행 높이 | compact 40 · **default 48** · relaxed 68 |
| 셀 | 좌우 12, 첫·마지막 20, `body-2`. 숫자 `numeric` 우측, 등락 `change` 방향색 |
| 선 | 행 사이 `border.default`, 세로선 없음 |
| hover / 선택 | `row-hover` / `selected-bg` + 왼쪽 체크박스 48 |
| 가로 스크롤 | 열 5개 이상: 컨테이너 스크롤 + 첫 열 sticky 160 + 우측 `fade-right` |
| 열 폭 | 체크 48 · 종목 160 · 배지 120 · 등락 96 · 가격 110 · 거래량 120 · 날짜 140 · 액션 56. 숫자 열은 최대 자릿수 기준 고정 |
| 모바일 | 열 4개 이상 → stock-row 리스트 |
| 빈 / 로딩 | 07 §2 240 / 스켈레톤 5행 |
| 페이지네이션 | 표 아래 우측 sm, "1–20 / 240", 20·50·100 |

첫 열 식별자, 마지막 열 액션(⋯ 메뉴, hover 시만 보이게 하지 않음). 텍스트 1줄 말줄임 + title. 기본 정렬 등락률↓ 또는 시총↓, URL 연동. `<th scope>` `aria-sort` `<caption>`.

## 12. Tabs · Segmented (기존 `.segmented` 3종 통합)
| 종류 | 언제 | 규격 |
|---|---|---|
| 밑줄 탭 | 페이지·상세 뷰 전환(5개 이하) | 높이 44, 간격 20, `label-md`, 비활성 `text.secondary` → 활성 `text.primary`, 인디케이터 3px `border.brand`, 트랙 `border.default` |
| 세그먼트 | 2~6개 짧은 옵션(기간·지표·시장·보기) | 트랙 `sunken-strong` radius 12 패딩 4, 항목 36(터치 44) 최소 56 좌우 10 radius 8 `label-sm` `text.secondary`, 활성 `surface.default` + `text.brand` + `shadow.xs`. 넘치면 가로 스크롤 + `fade-right`, 모바일 전폭 |
| 세로 탭 | 설정 | 폭 200, 항목 36, 활성 `selected-bg` + `selected-text` |

탭은 URL 연동. 인디케이터 `fast` `out`. `role="tablist"` ←→. 탭 안 탭 금지.

## 13. Navigation — Header · Sub nav · Tab bar · Sidebar · Breadcrumb · Pagination
**Header** 56/64, `surface.default`, 아래 `border.subtle`, 스크롤 시 `shadow.sticky` 또는 글래스(`blur.md` + 배경 90%). 로고 28 왼쪽, 영역 메뉴 `label-md` 간격 24, 우측 검색(아이콘 또는 필 48) · 알림(도트) · 아바타 32, 간격 8. `z-index.sticky`.
**Sub nav**(영역별 보조 탐색) 48, `surface.canvas`, 밑줄 탭 규격, 헤더 아래 sticky. 헤더 + 서브 = 112, `sticky-offset` 128.
**Tab bar**(모바일, `component.tabbar`) 56 + safe-area, `surface.default` 92% + `blur.md`, 위 `border.default` + `shadow.sticky`, 5개(홈·시장·섹터·자산·더보기), 아이콘 24 + 라벨 11/500 gap 2, 활성 `text.brand`(채움 아이콘) + `aria-current`, 알림 도트 8. 더보기 → 바텀시트 메뉴(항목 52).
**Sidebar**(관리자·설정 데스크톱만) 240/64, `surface.default`, 항목 36 radius 8 아이콘 20 + `label-md`, 활성 `selected-bg` + `selected-text`, 그룹 `micro`. 접힘 = 아이콘 + 툴팁.
**Breadcrumb** `body-3`, chevron 16 `text.tertiary`, 항목 `text.secondary` 링크, 현재 `text.primary`. 4단계 넘으면 "…". 제목 위 8.
**Pagination** sm 버튼, 현재 `selected-bg`, `1 … 4 5 [6] 7 8 … 20`. 모바일 "이전 · 6 / 20 · 다음". 무한 스크롤은 순위·뉴스에서만 + "더 보기" 버튼 대안.

## 14. Bottom sheet · Modal · Drawer (`component.sheet` / `modal`)
모바일 시트, 768 이상 모달. 같은 콘텐츠를 두 껍데기에.
| 항목 | 시트 | 모달 | 드로어 |
|---|---|---|---|
| 면 / radius / 그림자 | `raised` / 상단 20 / `shadow.lg` | `raised` / 20 / `shadow.xl` | `raised` / 0 / `shadow.xl` |
| 손잡이 | 36×4 gray.300 위 8 | 없음 | 없음 |
| 패딩 | 20 | 24 | 24 |
| 폭·높이 | 100%, 최대 90vh | sm 400 · **md 520** · lg 760, 최대 calc(100vh − 96) | 400/480 우측, 전체 높이 |
| 제목 | `title-2` 20/700 + 우상단 X | 같음 | 같음 |
| 푸터 | 하단 고정 lg 전폭(두 개면 세로) | 우측 md gap 8, 주 버튼 오른쪽 | 하단 고정 |
| 스크림 | `surface.overlay` | 같음 | 옅게 30% 또는 없음 |
| 모션 | 05 §4 | | |
| z-index | `sheet` 1250 | `modal` 1300 | `modal` |

- 첫 포커스 첫 인풋 또는 닫기, 포커스 트랩, Esc, 배경 스크롤 잠금. 스크림 클릭 닫기는 입력 없을 때만.
- 확인 다이얼로그 sm: 제목 질문형("삼성전자 10주 매수할까요?"), 본문 결과 한 문장, 요약 상자(`surface.sunken` 패딩 16: 주문 금액·수수료·주문 가능), 버튼 동작 이름. 파괴면 `danger` + 첫 포커스 취소. 큰 금액은 제목에 금액.
- 모달 안 모달 금지. 팝오버는 `popover`.
- 드로어: 종목 상세 미리보기·필터 패널.

## 15. Progress · Spinner · Skeleton · Refresh
| 컴포넌트 | 규격 | 언제 |
|---|---|---|
| Spinner | 16(버튼)/20/32, 2px, `action.primary.bg`, linear 무한 | 1초 이내, 영역 작을 때 |
| Progress bar | 4(인라인)/8(카드), 트랙 `sunken-strong`, 채움 `action.primary.bg` 또는 `status.<s>.solid`, full | 진행률 아는 것(백테스트·업로드) |
| 무한 progress | 헤더 아래 2px 이동 바 | 재조회·페이지 전환 |
| Skeleton | `sunken-strong`, radius 8, 글자 0.75em 마지막 줄 60%, 종목 행 68, KPI 116, 차트 영역 그대로, shimmer 1.4s | 첫 로딩 |
| 갱신 시각 | `micro` `text.tertiary` "15:30:05 갱신" + refresh 아이콘 버튼 xs(로딩 중 회전) | 실시간 화면 우상단 |
| 일시정지 | 순위·실시간 리스트 우상단 outline xs "일시정지/재개" | 자동 갱신 화면 |

300ms 안에 끝나면 표시 안 함. 스켈레톤은 실제 개수·크기.

## 16. KPI tile · Stat (`component.kpi`)
```
[caption 라벨 text.secondary]           시가총액
[price-md 20/700]                      412조 5,000억    (핵심 지표는 price-lg 28)
[change 13/700 finance.<d>.text]        ▲ 1.2%  지난주 대비(micro tertiary)
[스파크라인 40 (선택)]
```
카드 패딩 20, 최소 116, 4열/2열(모바일), gap 16. 값 없음 `—` + 툴팁 "집계 전". 좋은 방향이 하락인 지표도 색은 값의 방향(라벨에 "낮을수록 좋음"). 지수 KPI 는 이름 + 값 + 등락 + 스파크라인.

## 17. Chart containers
차트 카드: 제목 `title-4` + 우측 범례/기간 세그먼트, 차트 높이 240(카드)·360(상세)·480(기술), 아래 x 라벨. 로딩 = 차트 영역 스켈레톤(축 먼저 그리지 않음). 오류 = 영역 안 아이콘 + "차트를 불러오지 못했어요" + 다시 시도. 빈 = "거래 데이터가 없어요". 색·규격은 11.

## 18. Filter bar · Screener condition
툴바 카드 패딩 20/24, 높이 36 컨트롤 한 줄: 검색 sm(280) · 필터 칩들 · 우측 세그먼트. 선택 시 액션 바로 교체("3개 선택됨 · 삭제 · 내보내기"). 스크리너 조건 행: [지표 select] [연산자 세그먼트] [값 인풋 sm + 단위] [X]. 조건 사이 8, "조건 추가" outline sm, "초기화" ghost sm. 모바일: 검색 + 필터 아이콘 → 바텀시트.

## 19. Empty · Error state
07 §2·§3. 아이콘 48 + 배경 원 80 `brand-subtle`, `title-3`, `body-3` secondary, primary md. 카드·표 안 최소 240.

## 20. Divider · Kbd · Code · Accordion
- Divider `border.subtle` 1px, 상하 16. 글자 있는 구분선 `caption` tertiary 좌우 12.
- Kbd `code` 12, `sunken-strong`, `border.default`, radius 4, 2/6, 아래 2px.
- Code block(리서치·API 응답) `sunken-strong`, radius 12, 패딩 16, `code`, 복사 ghost xs.
- Accordion(재무제표 상세·FAQ) 헤더 48 `label-md` + chevron 우측, 본문 패딩 16, `grid-template-rows` 전환 `normal`. 한 번에 여러 개 열림 허용.

## 21. Settings row · Danger zone
설정 행: 좌 `label-md` + `caption` 설명, 우 컨트롤(Switch/Select sm/세그먼트), 높이 최소 56, 구분선 `border.subtle`. 즉시 반영은 Switch, 저장 필요는 섹션 하단 버튼. 위험 구역(모의투자 초기화·탈퇴): 마지막 섹션, 카드 테두리 `status.danger.border`, `danger` 버튼 outline 형태 → 확인 시트 + 이름 입력.

## 22. 여기 없는 컴포넌트를 만들 때
1. 높이 `size.control.*`: 한 줄 44, 밀도 36, CTA 52, 셀 안 28.
2. 가로 패딩 12(sm) / 16(md) / 24(lg). 세로는 높이가 정한다.
3. radius: 컨트롤 12, 카드 20(밀도 16), 오버레이 20, 칩·배지 full.
4. 색: `surface` → `text` → `border` → `action`/`finance`/`status`/`interactive` 순. 원시 램프 금지. 등락은 text/solid 구분.
5. 글자: `typography.*` 하나. 컨트롤 `label-*`, 내용 `body-*`, 숫자 `price-*`/`numeric`/`change`.
6. 상태 6종(+입력 2종) 전부. 하나라도 빠지면 미완성.
7. 포커스 링, 키보드, aria, 44 터치, 부호 동반.
8. 모션: 진입 `out`, 퇴장 `in`, 색 `fast`, 숫자 카운트업 금지.
9. 이 문서에 §를 추가하고 `component.json` 에 토큰 등록, `docs/00` 표 갱신.
