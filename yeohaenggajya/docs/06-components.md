# 06 · 컴포넌트 규격 (여행가쟈)

원본 `src/components/*` 실측값(2026-09-19). 각 컴포넌트를 **크기 · 색 · 상태 · 접근성 · 언제** 로 적었다. 새 컴포넌트는 기존 패턴 복제(폴더 1개 = 컴포넌트 1개, kebab BEM, `Record<Variant, className>`, 배럴, 스토리). 없는 것은 §25 조립 규칙.

공통 상태 6종 `default` `hover` `active` `focus-visible` `disabled` `loading`, 입력 `error` `readonly`. 등급 의존 컴포넌트는 **5등급(+moment) 전부** 정의하고 스토리도 전부.

---

## 1. Button (`Button` variant red|blue|ghost · size sm|md|lg)
| size | 패딩 | 글자 | 높이(환산) | 언제 |
|---|---|---|---|---|
| `sm` | 6 / 12 | Myeongjo 12/800 | 30 | 카드 안·시트 보조·필터 |
| `md` | 10 / 18 | 14/800 | 40 | **기본** |
| `lg` | 14 / 24 | 16/800 | 50 | BottomCta·온보딩 |

- ink 2px 테두리, radius 8, gap 6, `letter-spacing -0.01em`.
- `red`(primary): 빨강 + hanji.bright + `shadow.stamp`. 화면당 1개. `blue`: 파랑 + `stamp-blue`. `ghost`: 투명 + ink 글자 + `stamp-ink`.
- hover: deep 톤. active: `translate(1,1)` + 그림자 1px. focus: 파랑 2px offset 3. disabled: hanji.2 + ink-3 + 1px 그림자 + opacity .72 + `cursor: wait`(원본; 로딩 겸용). loading: 라벨 "굴리는 중…" + 폭 유지.
- 아이콘 22 왼쪽. 아이콘 전용 정사각 40 + `aria-label`.
- `type="button"` 명시(기본 submit 방지). 전폭은 BottomCta 안에서만.
- 다크패턴: 버튼 문구는 무엇이 일어나는지("여기로 떠나기" O, "확인" X). 다이얼로그 왼쪽은 항상 "닫기".

## 2. GachaCta (`GachaCta`)
메인 CTA. 높이 52, 빨강, 캡슐 아이콘 24 + "캡슐 굴려요"(Myeongjo 16/800), `shadow.stamp`, 최대 390, 하단 고정(네비 위, z `cta`). 남은 횟수 0 → disabled + 아래 `caption` "내일 다시 굴릴 수 있어요". 로딩 = "굴리는 중…".

## 3. BottomCta (`BottomCta` Single/Double)
패딩 20/20/24 + safe-area, gap 8, 최대 390, 네비 위 고정(`fixed`). Double = `leftButton`(blue/ghost) + `rightButton`(red) 1:1. 본문 하단 패딩 = CTA 높이 + 탭바 + 16.

## 4. TextInput (`TextInput`)
라벨(Pretendard 12/500 secondary) 위 4 → 인풋(hanji.bright, 1.5px ink, radius 8, 10/12, 14 ui) → 도움말(11 tertiary) 아래 4. 우측 액션(보기·지우기) 있으면 `padding-right 76`. 필드 사이 16.
- focus: 테두리 파랑 + 링. error: 테두리 red-deep + 도움말 danger + `aria-invalid`. readonly: 테두리 hanji.dark, 배경 hanji.2. disabled: opacity .5.
- 플레이스홀더는 라벨 대체가 아니다(ink-3). 폼은 `<form>` + `type="submit"`.
- 검색 인풋(FloatingFinder 안): 왼쪽 돋보기 도장(paper-bar stamp 28).

## 5. Chip (`Chip` color red|blue|yellow|jade|plum)
28 높이, 4/10, 1.5px 테두리, 999, Pretendard 12/500. 배경 hanji.bright, **테두리·글자만 색**. 선택형(필터): 활성 = 배경 hanji.2 + 테두리 빨강 + `aria-pressed`. 칩 사이 8, 넘치면 가로 스크롤 + `hanji-fade`. 노랑 칩 글자는 yellow-deep(2.7) 이라 아이콘·굵기 동반.

## 6. RarityBadge (`RarityBadge` rarity)
28 높이, 4/10, 1.5px ink, 999(카드 안 각진 3). [Cinzel 12/700 `Rare`] [세로선 1×10 ink-3] [한국어명 mono-sm 11 `숨겨진 발견`]. 글자색 `rarity.<r>.text`(legend 는 한지 위 금이 안 읽히니 ink + 금 테두리). **풀네임 필수.** 5등급 스토리.

## 7. Capsule (`Capsule` rarity · size xs|sm|md|lg|xl · motion none|soft|strong|vivid|arrive · stamp)
**시그니처. 누가 봐도 캡슐(돔 + 띠 + 베이스)로 인식되어야 한다.**
- 폭 `size.capsule.*` 40/72/120/160/220, 높이 폭 × 1.18.
- 돔 55%: hanji.bright, ink 2px, radius `dome-radius`, 하이라이트 원 30%. 띠 8%: 오방색(`gradient.band`) 또는 등급색 띠 + 4.5% 먹선. 베이스 47%: hanji.2, ink 2px, `base-radius`.
- 등급: 띠·베이스 테두리 `rarity.<r>.accent`. common 은 무채색.
- motion 05 §4. `stamp` = 베이스에 한자 도장.
- 홈 캡슐 160, 부유. 리스트·도감에는 xs/sm 정지.
- `role="img"` + `aria-label="Rare 캡슐"`.

## 8. GachaCard (`BaseGachaCard` + Common/Rare/Epic/Legend/UniqueCard)
폭 200, 비율 5:7, radius 12, 등급 프레임 3px `rarity.<r>.accent`, 패딩 16/12, 배경 hanji.bright, `shadow.paper`(무대 `deep`).
- 앞면: 헤더 [Cinzel 등급 라벨 + NO.0001 mono-sm] → 지역 사진 64% 폭(radius 4) → 지역명 heading-xl 28(한자 1곳 허용, Unique 는 시즌 키워드 "겨울 철원") → 붓글씨 인용 24 rotate −1.5 → `visitorNote` mono-sm(Epic+, 없으면 요소 자체 미렌더) → 하단 오방색 띠 6.
- 뒷면: 한지 + 등급 띠 + 한자 도장(常隱運傳唯) + "눌러서 열어요" body.
- flip 700 `preserve-3d`(WebKit overflow 주의: 원본 주석). 클릭·Enter/Space 로 뒤집기, `aria-pressed` 또는 `<button>` 래퍼.
- Legendary 는 `shadow.foil` 펄스, Unique 는 느린 홀로.

## 9. CardShell (`CardShell` rarity)
카드 자리표시(스켈레톤·장식). 같은 크기, 배경 hanji.2, 프레임 2px 등급색, 가운데 캡슐 xs 또는 도장. 로딩·잠금 셀·"아직 뽑지 않은 자리".

## 10. BannerRank (`BannerRank` rarity)
결과 공개 순간 등급 배너. Cinzel 36/700 `LEGENDARY` 는 라벨이라 대문자 허용 + 아래 heading-sm "전설의 발견이에요". 위아래 오방색 띠 6, 패딩 12. 무대 위 hanji.bright 글자, 등급 글로우. 1.5초 후 카드로 포커스 이동. `role="status"` `aria-live="polite"`.

## 11. DexCell (`DexCell` state collected|temp|locked · rarity · placeName · art)
108 정사각, radius 8, 2px 프레임(`--cell-frame-accent` = 등급색, locked 는 ink-3), 안쪽 1px ink 36% radius 6. 내용: 아트(일러스트, locked 는 opacity .55 + 회색조 아님 — 일러스트 자리로 채운다) + 하단 지역명 title 17(1줄) + 도장 원 38(常…) + 개수 배지 18(hanji.bright 52% 테두리). temp = 점선 아님, hanji.2 배경 + "임시" mono. Legendary = `shadow.foil` legendPulse. 진행 막대 4(세트 셀). `<button aria-label="보령 · Rare · 수집함">`. 5등급 × 3상태 스토리.

## 12. TabBar (`TabBar` → `AppShell` 경유)
플로팅. 모바일: hanji.bright, ink 2px, radius 20, 패딩 8, 항목 gap 4. 항목: 아이콘 22 + 라벨 12/500, 패딩 8/4, radius 8, gap 2. 활성: 빨강 아이콘·라벨 + hanji.2 배경 + `aria-current="page"`. 비활성 ink-3. 데스크톱(1024): 999 필, 패딩 4, faint 1px 테두리. 3항목(홈·도감·마이). `<nav aria-label="주 메뉴">`.

## 13. AppShell (`AppShell` label · activeKey · tone hanji|dark · hideNav)
03 §3. 띠 6 → 헤더 52 → 본문(안전 여백 16, 최대 430) → BottomCta → TabBar. 768 폰 프레임, 1024 책상. `tone="dark"` = `data-tone="dark"` 무대. `hideNav` 화면은 "닫기/건너뛰기" 직접.

## 14. Header (셸 상단)
52, 좌 `BackNavAction`(44, arrow-left 24) 또는 타이틀 heading 22, 우 `TopNavAction` 1개(44, 모노크롬 아이콘). 홈은 로고 md 28 + PullCounter. 배경 canvas(띠 아래). 스크롤 시 변화 없음(짧은 화면).

## 15. PullCounter (`PullCounter` remaining · total · showLabel)
`7/10` DM Mono 12 + 라벨 "오늘 남은 횟수" ui-sm. 도트 6px × total(남은 것 빨강, 쓴 것 hanji.deep) 옵션. 0 이면 ink-3 + "내일 다시".

## 16. ListItem (`ListItem` num · icon · title · meta)
최소 56, 패딩 12/16, gap 12. [num mono 12 tertiary] [icon 22] [title Myeongjo 17 / meta Batang 13 secondary] [우측 chevron 16 또는 배지]. 구분 hanji-dark 1px. 전체 링크는 `::after inset:0` 기법(중첩 인터랙티브 금지). hover hanji.2.

## 17. Tabs / Tab (`Tabs` `Tab` active)
높이 40, 항목 간격 16, Myeongjo 17, 비활성 ink-3 → 활성 ink + 밑줄 2px 빨강. `role="tablist"` / `tab` + `aria-selected`, 비활성 패널 `hidden`, ←→. 도감 4탭(뽑은 카드·도감·세트·인증 완료). 5개 넘으면 드롭다운.

## 18. Progress (`Progress` rarity)
높이 8(셀 안 4), 트랙 hanji.2, 채움 등급색 또는 빨강, 999. 라벨 mono `12 / 48`. 도감 meter: 막대 + "다음 한 걸음" body-sm + 통계 4개 mono. `role="progressbar"` + `aria-valuenow`.

## 19. Stamp (`Stamp` variant 원형|사각 · size)
28/38/56, 빨강 면 + ink 2px, 원형 999 / 사각 4, 한자 seal 17/800 hanji.bright, rotate −6°. 도감 셀·카드 뒷면·필터 바 낙관. 장식이면 `aria-hidden`.

## 20. Dropdown (`Dropdown`)
hanji.bright, 1.5px ink, radius 8, `shadow.paper`, 패딩 4, 항목 40 좌우 12 radius 4 ui 14, hover hanji.2, 선택 빨강 체크 16. 최소 180. `role="menu"` ↑↓ Enter Esc.

## 21. ConfirmDialog (`ConfirmDialog`)
`<dialog>` + `showModal()`. 폭 panel 520(모바일 전폭 − 32), hanji.bright, ink 2px, radius 12, `shadow.paper-lg`, 패딩 24. 제목 heading-sm + 본문 body + 푸터 [닫기 ghost] [동작 red/blue] gap 8. 스크림 ink 60%. 왼쪽 버튼은 항상 **"닫기"**("취소" 금지, 토스 원칙). 되돌릴 수 없는 것만 띄운다.

## 22. Sheet — PlaceSheet · FloatingFinder 필터
바텀시트. hanji.bright, 상단 radius 12, ink 2px 상단 테두리, `shadow.paper`(위로), 패딩 16, 손잡이 36×4 hanji.deep, 최대 88vh, 본문 `.hanji-scroll`. 진입 즉시 노출 금지·뒤로가기 직후 붙잡기 금지(Bright Line 11). 닫기 = 손잡이 드래그·스크림·"닫기" 버튼. `role="dialog" aria-modal`.
**FloatingFinder**: 우하단 56 원형(hanji.bright, ink 2px, `stamp`, 돋보기), z 900, 탭바 위 88. 세트 탭에서는 숨김.

## 23. EffectStage / LightBurst (`EffectStage` rarity · aura · rays · foil · pulse)
무대 연출 레이어(z `fx` 5, 캡슐 아래). aura = radial 등급 글로우(blur 40, 140%), rays = 12개 광선 opacity .5 회전, foil = holo-sheen 이동, pulse = fxPulse 2s. 색 `--fx-color-a/b` ← `color.fx.*`. 등급별 조합 05 §4. 무대 밖 금지. `aria-hidden`.

## 24. Logo (`Logo` variant horizontal|text|icon · size sm|md|lg|xl · alt · priority)
높이 20/28/40/64, 비율 고정. 기본 `horizontal-outlined.svg`(폰트 outline 처리). alt 기본 "여행가쟈", 옆에 브랜드명 텍스트 있으면 `alt=""`. 변형(재채색·회전·그림자) 금지. 14.

## 25. Toast (미구현 부채)
ink 면 + hanji.bright 글자 + hanji.bright 2px 테두리, radius 8, `shadow.stamp`, 패딩 12/16, body 14. 하단 88(네비 위), 2.8초. `role="status" aria-live="polite"`. "짠— 새 캡슐이 도착했어요".

## 26. Empty · Skeleton · ImageCredit · ProfileAvatar
- 빈 상태: 캡슐 sm 72(정지) + heading-sm "아직 뽑은 캡슐이 없어요" + body "첫 캡슐을 굴려봐요" + red md. 상하 48. 회색 빈칸 금지 — 도감 빈 셀은 일러스트 자리(CardShell).
- 스켈레톤: hanji.2 단색, radius 8, 정지. 카드 자리는 CardShell.
- ImageCredit: caption 11 ink-2(원본이 ink-4 회피), 사진 우하단.
- ProfileAvatar/Picker: 원형 32/56, ink 2px, 폴백 hanji.2 + 도장 한 글자.

## 27. 여기 없는 컴포넌트를 만들 때
1. 원본 `references/components.md` 인벤토리 확인(재사용 우선).
2. 면 한지 + 먹선 2px(작으면 1.5) + 오프셋 그림자(눌리는 것이면 stamp, 놓인 것이면 paper).
3. radius 8 컨트롤 / 12 카드·시트 / 999 칩.
4. 색: surface → text → border.ink → action/rarity/chip. 단청은 선에만. 홀로는 무대만.
5. 글자: 제목 Myeongjo 800, 본문 Batang, 라벨 Pretendard 12, 숫자 mono, 등급 Cinzel.
6. 상태 6종 + 등급 의존이면 5등급 전부.
7. 시맨틱 태그 + role/label/state, 44 터치, `prefers-reduced-motion` 자동.
8. 카피 해요체 + 가챠 어휘, 등급 풀네임.
9. 스토리 `Components/<Name>` autodocs, lint, 375 확인. 원본 `components.md` 인벤토리와 이 문서에 등록.
