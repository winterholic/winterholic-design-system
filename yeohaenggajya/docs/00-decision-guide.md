# 00 · 결정 가이드 — 상황별 정답표 (여행가쟈)

> 토큰은 `--yg-<경로>`. 원본 `tokens.css` 변수명(`--hanji` `--dc-red` `--sp-4` `--r-common`)은 `dist/legacy-aliases.css` 가 같은 값으로 잇는다 — 원본 프로젝트 코드는 그대로 원본 변수명을 써도 된다(이 시스템은 원본을 바꾸지 않는다).
> 헌법은 원본 `CLAUDE.md` 의 Bright Line 11개. 이 표는 그 시행세칙의 값이다.

**세 줄 요약**: 배경은 한지(순백 금지) · 단청은 가는 선에만 · 등급은 풀네임, 카피는 해요체+가챠 어휘.

## 1. 색

| 상황 | 토큰 | 값 | 원본 변수 | 문서 |
|---|---|---|---|---|
| 앱 배경 | `color.surface.canvas` | #F4ECDA + 점 텍스처 | `--hanji` | 01 |
| 카드·입력·칩·시트 표면 | `color.surface.default` / `raised` | #FBF5E5 | `--hanji-bright` | 01 |
| 연한 구분면·프로그레스 트랙·선택 항목 | `color.surface.sunken` | #E8DCBE | `--hanji-2` | 01 |
| 리스트 경계 | `color.border.subtle` | #D9C99E | `--hanji-dark` | 01 |
| 텍스처 점·스크롤바 | `color.surface.deep` | #B8A578 | `--hanji-deep` | 01 |
| 본문·제목 | `color.text.primary` | #1A1611 | `--ink` | 01 |
| 보조·라벨 | `color.text.secondary` | #4A3D2E | `--ink-2` | 01 |
| 메타·비활성 탭 (읽는 글자 하한) | `color.text.tertiary` | #735F47 | `--ink-3` | 01 |
| 장식 선·워터마크 (글자 금지) | `color.text.decorative` | #A89479 | `--ink-4` | 01·15 |
| 강조 단어·eyebrow | `color.text.brand` | #C8362E (14px 800 이상) | `--dc-red` | 01 |
| 링크·포커스 | `color.text.link` / `border.focus` | #2A5E8C | `--dc-blue` | 01·08 |
| 카드·버튼·칩 먹선 테두리 | `color.border.ink` | #1A1611, 2px(칩·입력 1.5) | `--ink` | 04 |
| CTA(빨강 버튼) | `color.action.primary.*` + `shadow.stamp` | #C8362E + #FBF5E5 글자 + 3px 3px 0 빨강 | `--dc-red` `--sh-stamp` | 06 |
| 파랑 버튼 | `color.action.secondary.*` + `shadow.stamp-blue` | #2A5E8C | `--dc-blue` | 06 |
| 고스트 버튼 | `color.action.ghost.*` + `shadow.stamp-ink` | 투명 + ink 테두리 | | 06 |
| 되돌릴 수 없는 것 | `color.action.danger.*` | #9E2521 | `--dc-red-deep` | 06·07 |
| 등급 액센트(띠·테두리·글로우) | `color.rarity.<r>.accent` / `.glow` | common #8A7960 · rare #2A5E8C · epic #C8362E · legend #E8C44E · unique #4A3A6E · moment #9FB3C0 | `--r-*` | 11 |
| 등급 라벨 글자색 | `color.rarity.<r>.text` | rare 파랑 · epic 진빨강 · unique 보라 · legend 는 무대(어두운 배경)에서만 | | 11 |
| 오방색 띠 | `gradient.band` | 빨·파·노·흰·검 20%씩 | | 04 |
| 카테고리 칩 색 | `color.chip.red/blue/yellow/jade/plum` | 테두리·글자만 | | 06 |
| 상태(성공·경고·오류·안내) | `color.status.<s>.*` | 한지 면 + 색 테두리·아이콘, 글자는 ink | | 07 |
| 연출 무대 배경 | `color.surface.stage` + `[data-tone="dark"]` | #1A1611 | `tone="dark"` | 09 |
| 연출 빛 | `color.fx.*`, `holo.*` | 무대에서만 | `--holo-*` | 11 |

## 2. 글자 (서체 = 역할)

| 상황 | 클래스 | 서체 / 크기 / 굵기 | 원본 |
|---|---|---|---|
| 카드 지역명·결과 제목 | `.yg-heading-xl` | Myeongjo 28/800 | `--f-myeongjo` |
| 페이지 타이틀(헤더) | `.yg-heading` | Myeongjo 22/800 | |
| 섹션·시트 제목 | `.yg-heading-sm` | Myeongjo 20/800 | |
| 리스트·카드 제목·도감 셀 | `.yg-title` | Myeongjo 17/800 | |
| 본문·태그라인·카드 인용 | `.yg-body` | Gowun Batang 14/400/1.6 | `--f-batang` |
| 보조 설명 | `.yg-body-sm` | Batang 13 | |
| 폼·시스템·법적 고지 | `.yg-ui` | Pretendard 14 | `--f-ui` |
| 입력 라벨·탭바 라벨·칩 | `.yg-ui-sm` | Pretendard 12/500 | |
| 버튼 | `.yg-button` (`-sm` 12 · `-lg` 16) | Myeongjo 14/800 | |
| 강조 1~2곳(손글씨) | `.yg-brush` | Nanum Brush 24, rotate −1.5° 자동 | `--f-brush` |
| 등급 라벨·eyebrow | `.yg-rank` | Cinzel 12/700 대문자 +0.08em | `--f-rank` |
| 결과 배너 | `.yg-rank-lg` | Cinzel 36 | |
| 번호·남은 횟수·좌표·통계 | `.yg-mono` / `.yg-mono-sm` | DM Mono 12 / 11 +0.12em | `--f-mono` |
| 한자 도장 한 글자 | `.yg-seal` | Myeongjo 17/800 | |
| 손글씨 보조 | `.yg-hand` | Gaegu 16 | `--f-hand` |
| 입력 도움말·이미지 출처 | `.yg-caption` | Pretendard 11 | |

## 3. 간격·크기

| 상황 | 토큰 | 값 | 원본 |
|---|---|---|---|
| 칩 내부·탭바 항목 gap | `space.1` | 4 | `--sp-1` |
| 칩 사이·탭바 패딩·버튼 gap(6 예외) | `space.2` | 8 | `--sp-2` |
| 카드 안 요소·헤더 gap·셀 좌우 | `space.3` | 12 | `--sp-3` |
| 셸 안전 여백(모바일)·카드 패딩 | `space.4` | 16 | `--sp-4` |
| BottomCta 패딩·태블릿 여백 | `space.5` | 20 | `--sp-5` |
| 블록 사이·프레임 패딩 | `space.6` | 24 | `--sp-6` |
| 섹션 사이(모바일) | `space.7` | 32 | `--sp-7` |
| 섹션 사이(데스크톱)·셸 좌우 | `space.9` | 48 | `--sp-9` |
| 폼·단일 카드 기둥 | `size.container.panel` | 520 | `--w-panel` |
| 읽는 문서 기둥 | `size.container.doc` | 720 | `--w-doc` |
| 이미지·차트 안내 | `size.container.wide` | 960 | `--w-wide` |
| 목록·그리드 상한 | `size.container.content` | 1152 | `--w-content` |
| 폰 프레임 안 본문 | `size.container.phone` | 430 | |
| 헤더 | `size.layout.header` | 52 | |
| 오방색 띠 | `size.layout.band` | 6 | |
| 버튼 sm / md / lg | `size.control.sm/md/lg` | 30 / 40 / 50 | |
| CTA·GachaCta | `size.control.cta` | 52 | |
| 캡슐(홈) | `size.capsule.lg` × 1.18 | 160 × 189 | |
| 결과 카드 폭 | `size.card.width` | 200 | |
| 도감 셀 | `size.dex-cell` | 108 | |
| 탭바 아이콘 | `size.icon.nav` | 22 | |
| 터치 최소 | `size.touch-target-min` | 44 | |

## 4. 모양·깊이

| 상황 | 토큰 | 값 | 원본 |
|---|---|---|---|
| 버튼·입력·도감 셀·탭바 항목 | `radius.sm` | 8 | `--r-sm` |
| 카드(고정)·시트·다이얼로그 | `radius.md` | 12 | `--r-md` |
| 탭바 컨테이너 | `radius.lg` | 20 | `--r-lg` |
| 폰 프레임 | `radius.frame` | 32 | `--r-frame` |
| 칩·배지·프로그레스·데스크톱 탭바 | `radius.full` | 999 | |
| 도장 사각·등급 라벨 각진 | `radius.xs` | 4(3) | `--r-xs` |
| 버튼 그림자 | `shadow.stamp` (blue / ink) | 3px 3px 0 | `--sh-stamp` |
| 눌림 | `shadow.stamp-pressed` + translate(1,1) | 1px 1px 0 | |
| 카드·시트 | `shadow.paper` | 0 2 0 ink, 4 4 0 빨강 | `--sh-paper` |
| 폰 프레임 | `shadow.paper-lg` | 0 4 0, 6 6 0 | `--sh-paper-lg` |
| 호일 글로우(Legendary 셀·연출) | `shadow.foil` | 금빛 blur | `--sh-foil` |
| 홀로 글로우(연출) | `shadow.holo` | 빨강+금 | `--sh-holo` |
| 무대 위 카드 | `shadow.deep` | 0 12 32 검정 40% | `--sh-deep` |
| 먹선 두께 | `border-width.ink` / `chip` / `card` | 2 / 1.5 / 3 | |

## 5. 움직임

| 상황 | duration | easing | 원본 |
|---|---|---|---|
| hover·눌림·꺾쇠·작은 전환 | `fast` 180 | `out` | `--dur-fast` |
| 등장·페이드·시트·상태 | `normal` 320 | `out` | `--dur-norm` |
| 카드 뒤집기 | `flip` 700 | `out` | `--dur-flip` |
| 캡슐 흔들림 soft / strong / vivid | 3200 / 2600 / 2200 주기 | keyframe | `capShake*` |
| 캡슐·카드 등장 | `arrive` 700 | keyframe | `capArrive` |
| 홈 캡슐 부유 | `float` 3600 | `in-out` | `appCapsuleFloat` |
| Legendary 펄스 | `pulse` 2000 | | `legendPulse` |
| 홀로 광택 / 회전 | 3000 / 8000 | linear | `holoShift` `holoRotate` |
| 붓글씨 기울임 | rotate −1.5° | | |

## 6. 레이어
`fx` 5 · `capsule` 20 · `floating-finder` 900 · `dropdown` 1000 · `sticky` 1100(헤더·띠) · `tabbar` 1150 · `cta` 1160 · `overlay` 1200 · `sheet` 1250 · `modal` 1300 · `popover` 1400 · `toast` 1500 · `tooltip` 1600 · `stage` 1700(연출 풀스크린)

## 7. 등급 한눈에

| 등급 | 풀네임 · 한국어 | 액센트 | 연출 | 도장 |
|---|---|---|---|---|
| Common | 보통의 발견 | #8A7960 | 없음, `soft` | 常 |
| Rare | 숨겨진 발견 | 파랑 | 파란 글로우 약, `soft` + foil | 隱 |
| Epic | 운명의 발견 | 빨강 | 빨강 글로우 + 호일, `strong` | 運 |
| Legendary | 전설의 발견 | 금빛 | 금 + 무지개 홀로 + 펄스, `vivid` | 傳 |
| Unique | 유일한 발견 (지역×시즌 키워드 필수) | 보라 | 고요·느린 홀로, `vivid` 차분 | 唯 |
| Moment | 찰나의 발견 | 월백 은박 | 은빛 은은 | — |

## 8. 이 표에 없으면
0. **상황이 문제면 `docs/16-situations.md`**.
1. 원본 스킬 `frontend/.claude/skills/design-system/references/` 의 해당 문서(토큰·컴포넌트·카피·청사진·등급)가 코드 기준. 이 저장소와 어긋나면 원본이 이긴다(13 §6).
2. 토큰이 없으면 원본 `tokens.css` 에 의미 기반 이름으로 먼저 추가 → 이 저장소 `tokens/src` 에 반영 → `node tokens/build.mjs`.
3. 급하면 `/* TODO(design): 토큰 확정 필요 — 사유 */`(원본 규약).
