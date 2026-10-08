# 16 · 브랜드 자산 (Ttakkari)

## 1. 컨셉

심볼은 **Ink 타일 위 Paper 색 '따'**, 그리고 모음 ㅏ 의 짧은 가로획만 **Mint** 다.

- 따까리의 첫 음절. 한국어 사용자에게 바로 읽히고, 이름을 처음 보는 사람에게도 '한글 글자 하나'로 기억된다.
- 민트 획은 오른쪽으로 뻗는다. 지시를 받아 움직이는 손이자, 터미널에서 다음 입력을 기다리는 커서처럼 보인다. 앱 안에서 민트가 '에이전트가 지금 여기 있다'를 뜻하는 것과 같은 말이다.
- 획이 아니라 다각형이다(굵기 44/512). ㄸ(높이 208)은 ㅏ 세로획(264)보다 짧다. 한글 음절의 자연스러운 비례다.
- 16px 에서도 "검은 타일 + 흰 따 + 민트 점" 실루엣이 남는다.
- 처음 시안은 ㄷ 두 개 + 커서 블록이었다. 렌더해 보니 라틴 'CC.' 로 읽혀서 버렸다(20 §3).

워드마크 `ttakkari` 는 글꼴이 아니라 같은 좌표계의 도형이다(tt 는 가로획 하나를 나눠 쓴다). 어두운 면 락업에서는 i 의 점이 민트다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` · `logo-mark.png` | 컬러 심볼(512) |
| `assets/brand/logo-mark-mono.svg` | 단색(`currentColor`, 타일 없음). 작은 UI·인쇄 |
| `assets/brand/logo-lockup.svg` | 밝은 면 가로 로고(심볼 + ink 워드마크) |
| `assets/brand/logo-lockup-inverse.svg` | 어두운 면 가로 로고(타일 없이 paper 따·워드마크 + 민트 획·점) |
| `assets/brand/favicon.svg` · `favicon-16/32/48.png` · `favicon.ico` | 파비콘 |
| `assets/brand/app-icon-512.png` | PWA 아이콘(둥근 타일, 모서리 투명) |
| `assets/brand/app-icon-maskable-512.png` | Android maskable(안전 영역 안 심볼, 바깥 Ink) |
| `assets/brand/apple-touch-icon-180.png` | iOS 홈 화면(불투명, iOS 가 모서리를 깎는다) |
| `assets/brand/brand-hero.png` · `.webp` | 1600×900 로그인·설치 안내·저장소 이미지 |
| `assets/brand/build-brand-assets.py` | 위 파일을 전부 다시 만드는 스크립트 |

전체 미리보기: `examples/preview.html` 첫 영역(`#brand`).

## 3. 로고 규칙

- 최소 크기: 심볼 16px, 락업 높이 20px. 안전 여백은 타일 한 변의 1/4.
- 밝은 면 → `logo-lockup.svg`. 어두운 면(다크 캔버스·히어로) → `logo-lockup-inverse.svg`. 잉크 타일을 어두운 면에 그대로 두면 묻힌다. 앱 헤더는 타일 외곽선 한 줄로 이를 막는다.
- 앱 헤더: `logo-mark.svg`(24px) + 글자 `Ttakkari`(HTML 텍스트). 에이전트 아바타는 이미지가 아니라 `.tk-avatar--agent`(같은 모양을 CSS 로, 다크에서 타일이 밝아진다).
- 금지: 비율 변경·회전, 민트 획 색 변경(민트는 언제나 에이전트), 글로우·그림자·그라데이션 타일, 타일 안에 다른 글자.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<!-- dist/pwa.json 의 meta 두 줄(theme-color light·dark) -->
```
manifest 의 `theme_color`·`background_color`·`icons` 는 `dist/pwa.json` 에 있다(19 §6).

## 4. 브랜드 이미지

`brand-hero`: Ink 바탕 + 점 격자 + 오른쪽 큰 '따'(타일 없음) + 아래 흐름 조각(파란 기운 지시 말풍선 → 화살표 → PDF 글리프가 있는 결과물 카드 + 민트 점). 앱의 색 문법(Blue 사람 · Mint 에이전트 · 결과물)을 그대로 쓴다.
- 왼쪽 48% 는 제목 자리. 글자는 흰색, 테마와 무관하게 고정(`var(--tk-base-white)`).
- 16:9 크롭은 `object-position: 70% center`. 모바일은 이미지를 흐리게(0.45) 두고 글자를 위에.
- 이미지 위에 글로우·도형을 더 얹지 않는다. 앱 화면 안(채팅·작업 공간)에는 쓰지 않는다.

## 5. 재생성

```bash
cd ttakkari/assets/brand
python3 build-brand-assets.py     # Pillow 필요. GEOMETRY(512 좌표)가 정본
```
SVG 와 PNG 가 같은 좌표에서 나오므로 파비콘·앱 아이콘·히어로 속 심볼이 항상 같다. 모양을 바꾸려면 `GEOMETRY` 만 고친다. PNG 를 손으로 편집하지 않는다. 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다(테스트가 확인).
