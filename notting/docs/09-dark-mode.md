# 09 · 다크 모드 (notting)

## 1. 동작 방식

`dist/tokens.css` 하나로 세 가지 모드를 지원한다.

| 상황 | 결과 |
|---|---|
| 아무 설정 없음 | 시스템 설정(`prefers-color-scheme`) |
| `<html data-theme="dark">` | 항상 다크 |
| `<html data-theme="light">` | 항상 라이트 |

```html
<script>
  try { const t = localStorage.getItem('nt-theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
</script>
```
`:root` 에 `color-scheme: light dark` 가 걸려 스크롤바·폼 컨트롤·task 체크박스(`accent-color`)도 함께 바뀐다.

## 2. 컴포넌트가 할 일: 없음

시맨틱 토큰만 썼다면 다크는 자동이다. `dark:` 접두사, `@media (prefers-color-scheme)` 분기를 컴포넌트에 쓰지 않는다. 분기가 생겼다면 원시색·hex 를 썼거나 시맨틱이 부족한 것 — `color.dark.json` 에 추가한다(라이트도 같은 경로, 빌드가 검사).

## 3. 다크 매핑 원리 — 따뜻한 잉크

notting 의 다크는 푸른 회색이 아니라 **잉크색**이다. neutral 이 hue 80(stone)이라 `#211F1C` 캔버스는 살짝 따뜻하다. 종이 위 잉크 → 잉크 위 종이색 글자.

| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 면 쌓기 | canvas 종이 → default 흰 → raised 흰+그림자 | canvas 950 → default 900 → raised 800 | 위로 올라올수록 밝게 |
| 사이드바 vs 에디터 | 종이(어둡) / 흰(밝) | 950(어둡) / 900(밝) | 문서가 크롬보다 밝다는 관계 유지 |
| 코드 블록 | `code.bg` 종이색(캔버스보다 살짝 밝음) | #181614 (캔버스보다 어두움) | 다크에서 코드는 가라앉는다. sunken 과 같은 값 |
| 주 버튼 | teal.600 + 흰 글자 | teal.400 + neutral.950 글자 | 어두운 캔버스에 진한 teal 은 뭉개진다 |
| AI 버튼 | periwinkle.600 + 흰 | periwinkle.400(원색) + 950 | 다크에서 periwinkle 원색이 산다 |
| 위험 버튼 | coral.600 + 흰 | coral.400(원색) + 950 | 같은 이유 |
| 브랜드 글자·링크 | teal.700 | teal.300 | |
| AI 면·글자 | periwinkle.50 / 700 | periwinkle.950 / 300 | 채도 유지, 명도 반전 |
| 근거 칩 | periwinkle.100 / 800 | periwinkle.900 / 200 | |
| 하이라이트 | amber.200 + 950 글자 | amber.700 + 50 글자 | 어두운 면에서 밝은 노랑 면은 눈부시다 → 진한 노랑 + 밝은 글자 |
| 선택(::selection) | teal.100 | teal.900 | |
| 상태 배너 | 50 배경 + 700 글자 | 950 배경 + 300 글자 | |
| 워크플로·등급 필 | 50~100 배경 + 700 글자 | 800~950 배경 + 200~300 글자 | |
| diff | 50 배경 + 800 글자 | 950 배경 + 200 글자 | |
| 코드 하이라이트 | 700~800 단계 | 300 단계 | 빌드가 `code.bg` 위 4.5 검사 |
| 그림자 | ink 5~15% | 검정 20~60% | alpha 상승 + 테두리 병행 |
| hover 덧칠 | 어둡게 6% | 밝게 8% | |
| 포커스 링 | teal.600 | teal.400 | |

## 4. 다크에서 특히 확인할 것

- **순백 큰 면 금지**: 이미지 블록 placeholder·로고 배경이 `#fff` 로 남으면 눈부시다. 로고는 `logo-lockup-inverse.svg`.
- **커버 이미지**: 그대로 두되 `scrim-bottom` 이 ink 계열이라 자연스럽다.
- **`paper` 그라데이션**은 원시 참조라 다크에서 밝게 남는다 → 다크에서는 `surface.brand-subtle` 단색.
- **`fade-bottom`** 은 흰색으로 정의돼 있다. 다크에서는 `color-mix(in srgb, var(--nt-color-surface-default), transparent)` 로 다시 그린다(04 §4).
- **`context` 그라데이션**은 원색이라 다크에서도 그대로 산다. 위 글자는 neutral.950 유지.
- **코드 하이라이트 테마**: 외부 하이라이터(Prism·hljs)의 테마 CSS 를 로드하지 말고 `prose.css` 의 `.token.*` 매핑만 쓴다. 외부 테마는 다크 분기가 따로 있어 토큰과 충돌한다.
- **이미지·스크린샷**: 문서 안 스크린샷은 `filter: brightness(0.9)` 정도. 사진은 그대로.
- **차트**: `chart.*` 가 다크 값을 갖는다.
- **AI 글로우(`shadow.ai`)**: 다크에서 alpha 가 올라간다. 스트리밍 끝나면 반드시 끈다.

## 5. 검증

- 빌드가 다크 시맨틱 210쌍 대비를 라이트와 같은 기준으로 검사(`contrast-report.json` `mode: dark`).
- 화면 검사: `data-theme="dark"` 강제 후 ① 순백 면 ② 그림자만으로 구분된 메뉴 ③ 코드 블록이 캔버스보다 어두운지 ④ 남은 hex. `grep -rn "#[0-9a-fA-F]\{6\}" src/` 0건.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `dark:bg-gray-800` | `bg-surface-default` |
| 다크 = 라이트 `invert()` | 시맨틱 재매핑 |
| 다크 카드에 그림자만 | 그림자 + `border.default` |
| 다크에서 teal.600 버튼 + 흰 글자 | 토큰 그대로(teal.400 + 950) |
| 다크에서 `paper` 그라데이션 | `surface.brand-subtle` |
| 외부 코드 테마 CSS(다크 버전) 로드 | `prose.css` 토큰 매핑 |
| 다크에서 amber.200 하이라이트 | 토큰 그대로(amber.700 + 밝은 글자) |
| `#fff` 로고 박스 | inverse 로고 |
