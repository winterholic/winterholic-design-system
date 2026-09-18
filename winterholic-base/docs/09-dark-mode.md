# 09 · 다크 모드

## 1. 동작 방식

`dist/tokens.css` 하나로 세 가지 모드를 지원한다.

| 상황 | 결과 |
|---|---|
| 아무 설정 없음 | 시스템 설정(`prefers-color-scheme`)을 따른다 |
| `<html data-theme="dark">` | 항상 다크 |
| `<html data-theme="light">` | 항상 라이트(시스템이 다크여도) |

```html
<!-- 사용자 선택 저장 + 깜빡임 방지: head 최상단 인라인 -->
<script>
  try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
</script>
```
`:root` 에 `color-scheme: light dark` 가 걸려 있어 스크롤바·폼 컨트롤 기본 색도 함께 바뀐다.

## 2. 컴포넌트가 할 일: 없음

시맨틱 토큰만 썼다면 다크는 자동이다. `dark:` 접두사, `@media (prefers-color-scheme)` 분기를 컴포넌트에 쓰지 않는다. 컴포넌트에 다크 분기가 생겼다면 둘 중 하나다.
- 원시색(`blue.500`)이나 hex 를 직접 썼다 → 시맨틱으로 바꾼다.
- 시맨틱 토큰이 부족하다 → `color.dark.json` 에 추가한다(라이트도 같은 경로 필수, 빌드가 검사).

## 3. 다크 매핑 원리

밝기 반전이 아니라 **의미 재매핑**이다. 라이트와 다크에서 달라지는 규칙:

| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 면 쌓기 | canvas snow → default white → raised white+shadow | canvas 950 → default 900 → raised 800 | 어두운 곳에서 그림자는 안 보여 **위로 올라올수록 밝게** 해서 고도를 표현 |
| 주 버튼 | blue.600 + 흰 글자 | blue.400 + neutral.950 글자 | 어두운 캔버스에 진한 파랑은 뭉개진다. 밝은 파랑 + 어두운 글자가 더 잘 읽힘 |
| 브랜드 글자·링크 | blue.700 | cyan.300 (Frozen Lake) | 다크에서 브랜드 정체성을 ice 가 맡는다 |
| 상태 배너 | 50 배경 + 700 글자 | 950 배경 + 300 글자 | 채도는 유지하고 명도만 뒤집음 |
| 상태 배지(solid) | 600 + 흰 글자 | 400 + 950 글자 | 주 버튼과 같은 이유 |
| 그림자 | 950 계열 5~15% | 검정 20~60% | alpha 를 올려야 보인다. 대신 테두리를 함께 쓰는 게 확실 |
| hover 덧칠 | 어둡게 6% | 밝게 8% | 면이 밝아지는 방향이 '반응' |
| 포커스 링 | blue.500 | cyan.300 | 어두운 배경에서 3:1 확보 |

## 4. 다크에서 특히 확인할 것

- **순백 큰 면 금지**: 다크에서 이미지·로고 배경이 `#fff` 로 남아 있으면 눈부시다. 로고는 다크용 버전 또는 `surface.default` 배경 카드에.
- **채도 높은 큰 면 줄이기**: `surface.brand` 가 다크에선 indigo.800 으로 한 단계 낮아진다. 히어로 그라데이션 `brand` 는 원시 참조라 그대로다 — 다크 히어로는 `gradient.twilight` 로 바꿔 쓴다.
- **`frost` 그라데이션**은 원시 참조라 다크에서 밝게 남는다. 다크에서는 `surface.brand-subtle` 단색으로 대체(04 §4).
- **이미지·일러스트**: `filter: brightness(0.9)` 정도로 눌러 주면 튀지 않는다. 사진에는 걸지 않는다.
- **코드 블록**: `surface.sunken` 이 #12161B 로 캔버스보다 더 어두워진다. 코드 하이라이트 테마는 다크용을 따로 로드한다.
- **차트**: `chart.*` 토큰이 다크 값을 갖는다. 격자 `chart.grid`, 축 `chart.axis` 도 함께 바뀐다.
- **상태 알파 값**(`hover-overlay` 등)은 라이트=검정 계열, 다크=흰 계열로 이미 갈라져 있다.

## 5. 검증

- 빌드가 다크 시맨틱 조합의 대비를 라이트와 같은 기준으로 검사한다(`contrast-report.json` 의 `mode: dark`).
- 화면 검사: `data-theme="dark"` 를 강제로 걸고 ① 순백 면 ② 그림자만으로 구분된 모달 ③ 남아 있는 hex 를 찾는다. `grep -rn "#[0-9a-fA-F]\{6\}" src/` 가 0건이어야 한다.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `dark:bg-gray-800` 컴포넌트마다 | `bg-surface-default` 하나 |
| 다크 = 라이트 색 `invert()` | 시맨틱 재매핑 |
| 다크 카드에 라이트와 같은 그림자만 | 그림자 + `border.default` |
| 다크에서 blue.600 버튼 + 흰 글자 | 토큰 그대로(blue.400 + 950 글자) |
| 다크 히어로에 `gradient.brand` 그대로 | `gradient.twilight` |
| 다크에서 `#fff` 로고 박스 | 투명 배경 다크용 로고 |
