# 16 · 브랜드 자산 (Ttakkari)

## 1. 컨셉

심볼은 **Blue 타일 위 토끼 마스코트의 얼굴**(굵은 Ink 외곽선, 짧은 귀)이다. 2026-10-17 사용자가 토끼형 빵 심부름꾼을 마스코트로 확정했고 로고는 이 마스코트로 한다.

- 짧고 둥근 귀 + 빵 봉지를 든 심부름꾼. 따까리(심부름꾼)라는 이름과 맞고, 귀 실루엣이 작은 크기에서도 남는다.
- 전신은 16px 에서 토끼로 읽히지 않았다(23 §4.6). 그래서 로고·파비콘·앱 아이콘은 이미지 생성 세션이 **얼굴·귀만 굵은 외곽선으로 단순화해 크기별로 내보낸 아이콘**(`brand/generated/icons/icon-mascot-<크기>.png`: 16·32·48·180·192·512·1024, maskable 192·512·1024)을 쓰고, 전신은 큰 면(히어로·일러스트)에만 쓴다.
- 타일은 Ttakkari Blue 한 색이다. 라이트·다크 어느 캔버스에서도 크림색 얼굴이 분명하고 타일이 묻히지 않는다(그래서 어두운 면 락업도 타일을 그대로 둔다). 앱 안에서 Blue 는 '사람의 행동'을 뜻하지만 브랜드 타일은 정보 표지가 아니라 정체성이다.
- 마스코트는 생성형 이미지라 좌표가 정본이 아니다. 정본은 `brand/generated/` 의 원본 PNG 이고, 스크립트는 모서리 깎기·포맷·크기 선택만 한다. 같은 원본에서 SVG 와 PNG 가 나온다.
- 옛 심볼 '따' 는 앱 안 **에이전트 아바타**(`.tk-avatar--agent`, 정보 표지)에서만 CSS 로 계속 쓴다. 브랜드 얼굴(마스코트)과 층이 다르다.

워드마크 `ttakkari` 는 그대로 글꼴이 아니라 도형이다(tt 는 가로획 하나를 나눠 쓴다). 어두운 면 락업에서는 i 의 점이 민트다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` · `logo-mark.png` | 컬러 심볼(512): Blue 타일 + 마스코트 얼굴(SVG 는 PNG 를 data URI 로 포함) |
| `assets/brand/logo-mark-mono.svg` | 단색 실루엣(`currentColor`, 타일 없음). 얼굴 알파로 채운 한 색 덩어리라 귀·눈 구분이 거의 없다(알려진 한계). 인쇄·한 색 면에 꼭 필요할 때만 |
| `assets/brand/logo-lockup.svg` | 밝은 면 가로 로고(심볼 + ink 워드마크) |
| `assets/brand/logo-lockup-inverse.svg` | 어두운 면 가로 로고(Blue 타일 그대로 + paper 워드마크 + 민트 점) |
| `assets/brand/favicon.svg` · `favicon-16/32/48.png` · `favicon.ico` | 파비콘 |
| `assets/brand/app-icon-512.png` · `app-icon-192.png` | PWA 아이콘(둥근 타일, 모서리 투명). 생성 세션의 정사각 원본을 22% 로 깎은 것 |
| `assets/brand/app-icon-maskable-512.png` | Android maskable(안전 영역(가운데 80% 원) 안 얼굴, 바깥 Blue) |
| `assets/brand/apple-touch-icon-180.png` | iOS 홈 화면(불투명, iOS 가 모서리를 깎는다) |
| `assets/brand/brand-hero.png` · `.webp` | 1600×900 로그인·설치 안내·저장소 이미지 |
| `assets/brand/build-brand-assets.py` | 위 파일을 전부 다시 만드는 스크립트 |

전체 미리보기: `examples/preview.html` 첫 영역(`#brand`).

## 3. 로고 규칙

- 최소 크기: 심볼 16px, 락업 높이 20px. 안전 여백은 타일 한 변의 1/4.
- 밝은 면 → `logo-lockup.svg`. 어두운 면(다크 캔버스·히어로) → `logo-lockup-inverse.svg`. 잉크 타일을 어두운 면에 그대로 두면 묻힌다(마스코트 타일은 Blue 라 어두운 면에서도 보인다). 앱 헤더는 타일 외곽선 한 줄로 이를 막는다.
- 앱 헤더: `logo-mark.svg`(24px) + 글자 `Ttakkari`(HTML 텍스트). 에이전트 아바타는 마스코트가 아니라 `.tk-avatar--agent`(옛 '따' 글리프를 CSS 로, 다크에서 타일이 밝아진다).
- 금지: 비율 변경·회전, 얼굴 색 바꾸기, 자르는 위치 바꾸기(전신을 작은 크기에 쓰는 것 포함), 글로우·그림자·그라데이션 타일, 타일 안에 다른 글자.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<!-- dist/pwa.json 의 meta 두 줄(theme-color light·dark) -->
```
manifest 의 `theme_color`·`background_color`·`icons` 는 `dist/pwa.json` 에 있다(19 §6).

## 4. 브랜드 이미지

`brand-hero`: Ink 바탕 + 점 격자 + 오른쪽 큰 마스코트 전신(타일 없음, Paper 띠) + 아래 흐름 조각(파란 기운 지시 말풍선 → 화살표 → PDF 글리프가 있는 결과물 카드 + 민트 점). 앱의 색 문법(Blue 사람 · Mint 에이전트 · 결과물)을 그대로 쓴다.
- 왼쪽 48% 는 제목 자리. 글자는 흰색, 테마와 무관하게 고정(`var(--tk-base-white)`).
- 16:9 크롭은 `object-position: 70% center`. 모바일은 이미지를 흐리게(0.45) 두고 글자를 위에.
- 이미지 위에 글로우·도형을 더 얹지 않는다. 앱 화면 안(채팅·작업 공간)에는 쓰지 않는다.

## 5. 재생성

```bash
cd ttakkari/assets/brand
python3 build-brand-assets.py     # Pillow·numpy 필요. 원본은 brand/generated/{icons,mascot}
```
SVG 와 PNG 가 같은 원본에서 나오므로 파비콘·앱 아이콘·히어로 속 마스코트가 항상 같다. 얼굴을 바꾸려면 `brand/generated/` 의 원본을 바꾸고 다시 돌린다. PNG 를 손으로 편집하지 않는다. 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다(테스트가 확인).

## 마스코트 일러스트

같은 마스코트가 빈 상태·오류·온보딩의 감정 표지로도 쓰인다(별도 이미지 생성 세션의 산출물, 원본은 `brand/generated/`). 목록·규격·자리(`.tk-art`)·웹 파생본(`assets/art/`)은 [23 일러스트 자산](23-illustration-assets.md). 시안 4종 중 나머지 3종(참새·떡·후드)은 보존만 하고 쓰지 않는다.
