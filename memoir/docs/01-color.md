# 01 · 색 (memoir)

## 1. 출처와 방향

memoir 의 색은 세 문서에 흩어져 있었다. 기획서 5.1(`#000000` `#7F95D1` `#FF82A9` `#FFC0BE` `#FFEBE7`), `design-guide.md`(Digital Editorial: `#a1385e` `#465d95` `#231917` `#fff9f8` `#fff0ee` `#feeae6` `#dbc0c5`), `tailwind.config.ts`(primary·primary-dark·secondary·secondary-dark·on-surface·surface·surface-low·sub-pink·sub-cream). 세 곳을 합쳐 하나로 만들었다. 값은 전부 유지했고, 이름과 역할을 정했다.

방향은 design-guide 의 **Warm Minimalist / Digital Editorial**: 크림과 연분홍 종이 위에 따뜻한 검정 글씨. 화면의 대부분은 종이색이고, 색은 세 곳에만 쓴다.
- **로즈 `#A1385E`** — 액션(버튼·로고 마크·강조 단어)
- **핑크 `#FF82A9`** — 브랜드 표현(활성 칩·히트맵·장식). 글자·버튼 배경 금지
- **페리윙클 `#7F95D1` / 인디고 `#465D95`** — 상호작용(활성 메뉴·링크·포커스). 파랗다 = 클릭할 수 있다

기획서의 `#000000` 은 design-guide 의 `#231917` 로 대체한다(순검정은 흰 배경에서 진동한다).

## 2. 브랜드 원색

| 토큰 | hex | 기존 이름 | 역할 |
|---|---|---|---|
| `brand.pink` | #FF82A9 | primary, 메인 핑크 | 로고·활성 칩 배경·히트맵 최고 단계·장식 |
| `brand.rose` | #A1385E | primary-dark, design-guide Primary | CTA 버튼·로고 m·강조 단어 |
| `brand.wine` | #78163E | on-primary-container | 핑크 배경 위 글자 |
| `brand.periwinkle` | #7F95D1 | secondary, 메인 블루 | 활성 메뉴 배경·캘린더 이벤트 도트 |
| `brand.indigo` | #465D95 | secondary-dark | 링크·포커스 밑줄·포커스 링 |
| `brand.ink` | #231917 | on-surface | 글자·코드 블록·툴팁 |
| `brand.blush` | #FFC0BE | sub-pink | #태그 배지·폴더 hover |
| `brand.cream` | #FFEBE7 | sub-cream | 섹션·벤토·빈 상태 |
| `brand.paper` | #FFF9F8 | surface-low | 캔버스 |
| `brand.paper-tint` | #FFF0EE | surface-container-low | 구역 |
| `brand.paper-deep` | #FEEAE6 | surface-container | 눌린 구역·인풋 채움 |
| `brand.outline` | #DBC0C5 | outline-variant | 고스트 테두리 재료 |

## 3. 램프

| 램프 | 앵커(고정) | 글자로 쓸 수 있는 최소 단계(흰 배경) |
|---|---|---|
| pink | 400 #FF82A9 · 600 #A1385E · 800 #78163E | **600** (6.48). 400 은 2.33, 500 은 3.74 |
| blue | 400 #7F95D1 · 600 #465D95 | **600** (6.44). 400 은 2.95 |
| neutral(warm) | 950 #231917 | **600** #7A6D6A (4.97) — 단, 크림 면 위에선 700 |
| red | 500 #D93A4F | 500 (4.50) |
| green | 500 #2E9E6B | 600 (4.66) |
| amber | 500 #C98A00 | 600 (5.03) |

## 4. 면 (surface) — No-Line 의 핵심

구획은 선이 아니라 **종이 층의 밝기 차이**로 만든다. 세 층이면 충분하다.

```
canvas  #FFF9F8  ──────────────────────────────  body
  zone  #FFF0EE  ┌────────────────────────────┐  리스트·구역 바닥
   card #FFFFFF  │  ┌──────────┐ ┌──────────┐ │  메모 카드(선·그림자 없음)
                 │  └──────────┘ └──────────┘ │
                 └────────────────────────────┘
```

| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | paper | #1B1514 | body |
| `zone` | paper-tint | ink | 리스트 배경·사이드 패널·에디터 바깥 |
| `zone-deep` | paper-deep | #1F1816 | 구역 안 구역·인풋 채움·비활성·언어 배지 |
| `default` | white | neutral.900 | 카드·메모·에디터 면 |
| `raised` | white 80% + blur | neutral.900 90% + blur | 모달·드롭다운·플로팅 바(글래스) |
| `cream` | cream | neutral.900 | 섹션 배경·벤토·빈 상태 카드 |
| `blush` | blush | pink.300 | 태그 배지·폴더 hover |
| `brand` / `brand-subtle` | rose / pink.50 | pink.700 / pink.950 | 로즈 면 / 선택된 항목 |
| `interactive` / `interactive-subtle` | periwinkle / blue.50 | indigo / blue.950 | 활성 메뉴 / 링크 hover 배경 |
| `inverse` | ink | paper | 툴팁·토스트 |

규칙
- 카드는 `zone` 위에만 놓는다. `canvas` 위에 바로 흰 카드를 두면 차이가 없어 안 떠 보인다.
- 카드 안 구획은 `zone-deep` 면. 카드 안에 카드 금지.
- 리스트 항목은 면을 따로 주지 않고 24px 여백으로 나눈다. hover 하면 그 항목만 `row-hover`(흰 면)로 떠오른다.
- 모달·드롭다운은 글래스(`glass.bg-modal` + `glass.blur`). 벤토는 `glass.bg-floating`(40%).

## 5. 글자

| 토큰 | 라이트 | 대비(흰 / 크림) | 언제 |
|---|---|---|---|
| `primary` | ink | 17.2 / 15 | 본문·제목 |
| `secondary` | neutral.800 #4C413E | 9.9 | 설명·미리보기 |
| `tertiary` | neutral.700 #635654 | 7.0 / 6.2 | 타임스탬프·라벨·메타. 600 은 크림 위 4.3 이라 700 |
| `placeholder` | neutral.700 | | |
| `brand` | rose | 6.48 | 헤드라인 강조 단어("Archival Ledger"), 로고 m |
| `link` | indigo | 6.44 | 링크. 파랗다 = 클릭 가능 |
| `on-brand` | white | 6.48 (rose 위) | 버튼·로즈 면 |
| `on-pink` | wine | 4.6 (핑크 위) | 활성 칩·blush 배지 위 |
| `on-interactive` | white | 2.95 (periwinkle 위) | 활성 메뉴. 라벨 14px/600 이상만 |
| `success` `warning` `danger` `info` | 700/600/600/600 | 4.5 이상 | 상태 문구 |

기획서의 보조 글자 `#555555` 는 `tertiary`(따뜻한 회색)로 대체.

## 6. 테두리 — 예외 목록

선은 기본적으로 없다. 아래만 허용.
| 토큰 | 언제 |
|---|---|
| `ghost` outline 15% | 접근성상 경계가 꼭 필요할 때(예: 흰 이미지 카드) |
| `subtle` paper-deep | 면과 면 사이 미세 단차. 선처럼 보이면 잘못 |
| `default` neutral.200 | 캘린더 그리드처럼 선 자체가 정보 |
| `interactive` indigo | 인풋 포커스 밑줄 2px |
| `focus` indigo | 포커스 링 |
| `input-strict` neutral.500 | 체크박스·라디오(3:1) |
| `danger` red.500 | 오류 밑줄 |

`hr` 과 리스트 구분선은 금지(design-guide "The Divider Ban").

## 7. 액션·칩·상태

| variant | 색 | 언제 |
|---|---|---|
| `action.primary` | rose + 흰 글자 | 저장·만들기·인증. 화면당 1개 |
| `action.secondary` | paper-deep + 로즈 글자 | 덜 중요한 행동(design-guide Secondary) |
| `action.ghost` | 투명 + neutral.700 | 취소·내비 |
| `action.interactive` | periwinkle + 흰 글자 | 활성 메뉴·선택된 카테고리(기획서). 라벨 14/600 |
| `action.danger` | red.600 | 삭제·계정 탈퇴 |
| `chip.*` | 기본 paper-deep, 활성 pink + wine, ALL ink | 서브 헤더 필터 |
| `chip.tag-*` | blush + ink | #태그 |
| `status.secure` | 핑크 계열 | 잠금·2FA·인증 만료(기획서 "경고/보안 = 핑크 계열"). 오류(빨강)와 구분 |
| `category.<name>` | 카테고리 10종 식별색 | 드롭다운 아이콘 배경·벤토 헤더에만 |

## 8. 조합 규칙
1. 한 화면에 로즈(액션) 1곳, 페리윙클(활성) 1곳. 나머지는 종이색과 검정.
2. 핑크·블러시는 면적이 작을 때만(칩·태그·도트). 큰 면은 크림.
3. 코드 블록은 라이트에서도 어둡다(`code.bg` #1A1A1A). 코드 카테고리는 ink 가 정체성.
4. 상태색은 배너·토스트에만. 리스트 항목에 빨강·초록 면을 깔지 않는다.
5. 다크는 시맨틱이 처리. 다크에서 primary 버튼은 핑크 원색 + wine 글자로 바뀐다(어두운 면에서 핑크가 산다).

## 9. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `text-primary` 로 본문 글자 핑크 | 강조 단어만 `text-text-brand`(로즈). 본문은 ink |
| `bg-primary` CTA 버튼(핑크 + 흰 글자 2.33) | `action.primary`(로즈) |
| `#000000` 글자 | `text.primary` #231917 |
| `border-b border-gray-200` 리스트 구분 | 24px 여백 + hover 흰 면 |
| 카드에 `shadow-md` | 그림자 없음. zone 위 흰 면 |
| 캔버스 위에 바로 흰 카드 | zone 위에 카드 |
| 파랑을 장식으로 | 파랑은 클릭 가능한 것에만 |
| 오류를 핑크로 | 오류 red, 보안 상태만 핑크 |
