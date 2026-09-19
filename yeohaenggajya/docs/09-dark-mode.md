# 09 · 어두운 무대 (여행가쟈) — 다크 모드가 아니다

여행가쟈에는 **시스템 다크 모드가 없다.** 한지 배경이 정체성이다(Bright Line 2). 어두운 배경은 **가챠 연출(prelude·결과 공개)** 에만 허용되는 명시된 예외이고, 이 시스템은 그것을 `data-tone="dark"`(= AppShell `tone="dark"`) 로 다룬다. `prefers-color-scheme: dark` 를 따르지 않는다(`color-scheme: light` 고정).

## 1. 동작
```html
<div class="shell" data-tone="dark">   <!-- AppShell tone="dark" 가 붙인다 -->
```
`dist/tokens.css` 는 `[data-tone="dark"]` 스코프 안에서만 시맨틱 값을 바꾼다. 컴포넌트는 토큰만 쓰면 무대 안에서 자동으로 바뀐다. 무대 밖 화면은 언제나 한지.

## 2. 무대에서 바뀌는 것
| 축 | 한지 | 무대 | 이유 |
|---|---|---|---|
| 배경 | hanji #F4ECDA + 점 텍스처 | `stage.bg` #1A1611, 가운데 살짝 밝은 `stage-vignette` | 결과 공개 직전의 긴장. 텍스처 없음 |
| 카드·시트 면 | hanji.bright | #241E17 / #2B241C | 무대 위 종이는 어둡게 |
| 글자 | ink / ink-2 / ink-3 | hanji.bright / hanji-2 / hanji-dark | 먹 위 한지색 글자 |
| 먹선 | ink 2px | hanji.bright 2px | 선이 밝아진다(판화 반전) |
| 버튼 red/blue | 그대로 | 그대로 | 단청 원색은 무대에서도 산다(글자 4.8 이상) |
| ghost 버튼 | ink 글자·테두리 | hanji.bright 글자·테두리, 그림자 hanji.deep | |
| 링크·포커스 | 파랑 | holo.blue | 어두운 면 3:1 |
| 등급 액센트 rare/epic | 파랑/빨강 | holo.blue / holo.red | 글로우와 같은 계열 |
| 등급 라벨 legend | ink(한지에서 금은 안 읽힘) | holo.yellow 10.7:1 | 무대에서만 금빛 글자 |
| unique | twilight | #B79BE0(밝은 보라) | |
| 칩·상태 아이콘 | 단청 | holo 계열 | |
| 오방색 띠 | 그대로 | 그대로 | 브랜드 시그니처는 불변 |
| 그림자 | stamp·paper(빨강·먹) | 색 유지, 먹 → hanji.bright | |
| 카드 그림자 | paper | `deep`(0 12 32 검정) | 무대 위 카드는 떠 있다 |
| 연출 빛 | 사용 금지 | `fx.*`·`holo.*`·`shadow.foil/holo` 허용 | |

## 3. 무대인 화면
- `/pull` 2막·3막(캡슐의 여정·공개), `/ar` 던지기 결과 공개, `/result`(카드 공개 순간, 이후 한지로 복귀할 수 있음), 온보딩 첫 뽑기 풀버전.
- 그 외(홈·도감·코스·마이·공유·인증)는 무대 금지. 도감 Legendary 셀의 펄스 글로우는 한지 위 예외(shadow.foil 만).

## 4. 무대에서 확인할 것
- 카드 앞면 사진 위 글자는 카드 자체가 한지 면이므로 그대로. 카드 배경까지 어둡게 하지 않는다(무대 카드 면은 #241E17 이 아니라 결과 카드는 hanji.bright 유지 — `card.bg` 고정).
- 로고: 무대에서는 `text-outlined` 흰 버전 없음 → 로고 미노출(무대 헤더 없음).
- BannerRank 글자 hanji.bright + 등급 글로우. Cinzel 36 은 큰 글자라 3:1 이면 되지만 실제 16.5.
- 무대 → 한지 복귀는 fade `normal`. 갑자기 밝아지지 않게 카드가 먼저 자리 잡고 배경이 바뀐다.
- 캡슐·카드 외 UI(건너뛰기 ghost)만. 탭바·CTA 없음(`hideNav`).

## 5. 검증
빌드가 무대 시맨틱 92쌍 검사(mode=dark). `data-tone="dark"` 를 강제한 스토리에서 ① 글자 hanji.bright ② 등급 라벨 색 ③ 버튼 대비 ④ 오방색 띠 유지 확인.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `@media (prefers-color-scheme: dark)` 대응 | 없음. 한지 고정 |
| 홈·도감을 어둡게 | 무대는 연출 화면만 |
| 무대에서 단청을 홀로로 전부 교체 | 버튼 원색 유지, 액센트·아이콘만 홀로 |
| 무대 카드 면을 어둡게 | 결과 카드는 한지 유지 |
| 무대에 탭바·CTA | hideNav + 건너뛰기 |
