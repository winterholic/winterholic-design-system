# 15 · 브랜드 자산 (AIP)

## 1. 컨셉

심볼은 **AIP Blue 타일 위 흰 Λ 와, 그것을 가로지르는 AIP Yellow 형광펜 막대**다. 막대가 A 의 가로획이 되어 Λ 가 A 로 읽힌다. "선언된 의도(Intent)에 형광펜을 긋는다", 개발자가 원하는 것을 표시하면 AIP 가 그것을 실행한다는 제품의 한 문장을 형태로 만들었다.

- Λ 는 획이 아니라 다각형이다. 발은 수평으로 잘리고 꼭대기는 평평하다. 제도용 글자처럼 정확하게, 둥근 장난감 글자가 아니게.
- 형광펜 막대는 다리 밖으로 조금 나와 '그은' 느낌을 준다. 끝은 거의 각지다(radius 6/512).
- 16px 에서도 "파란 타일 + 흰 A + 노란 띠" 실루엣이 남는다.
- 워드마크 `AIP` 도 서체가 아니라 같은 좌표계의 도형이다. A 는 심볼의 Λ 다각형을 그대로 줄였다. 폰트가 없는 환경에서도 모양이 같다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` · `logo-mark.png` | 컬러 심볼 |
| `assets/brand/logo-mark-mono.svg` | 단색(`currentColor`). 막대는 45% 불투명으로 Λ 와 겹친 자리가 읽힌다. 작은 UI·인쇄·푸터 |
| `assets/brand/logo-lockup.svg` | 밝은 면 가로 로고(심볼 + charcoal 워드마크) |
| `assets/brand/logo-lockup-inverse.svg` | 어두운 면 가로 로고(흰 타일 + 파란 Λ + 흰 워드마크) |
| `assets/brand/favicon.svg` · `favicon-16/32/48.png` · `favicon.ico` | 파비콘 |
| `assets/brand/app-icon-512.png` | PWA·앱 아이콘(둥근 타일, 모서리 투명) |
| `assets/brand/app-icon-maskable-512.png` | Android maskable(80% 안전 영역, 바깥은 Blue) |
| `assets/brand/apple-touch-icon-180.png` | iOS 홈 화면(불투명, iOS 가 모서리를 깎는다) |
| `assets/brand/brand-hero.png` · `.webp` | 1600×900 소셜·저장소·랜딩 이미지 |
| `assets/brand/build-brand-assets.py` | 위 파일을 전부 다시 만드는 스크립트 |

전체 미리보기: `examples/preview.html` 첫 영역(`#brand`).

## 3. 로고 규칙

- 최소 크기: 심볼 16px, 락업 높이 20px.
- 안전 여백: 타일 한 변의 1/4 을 사방에.
- 밝은 면 → `logo-lockup.svg`. 어두운 면(다크 캔버스·코드 면·히어로 이미지) → `logo-lockup-inverse.svg`.
- 헤더에서는 `logo-mark.svg`(24px) + 글자 `AIP`(HTML 텍스트, 18/700)를 쓴다. 검색·번역·스크린 리더가 글자를 읽는다.
- 금지: 비율 변경, 회전, 외곽선·그림자·글로우 추가, 막대 색 변경(형광펜은 항상 Yellow), 타일 안에 다른 글자, 그라데이션 타일.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon-180.png">
<link rel="manifest" href="/site.webmanifest"> <!-- icons: app-icon-512.png, app-icon-maskable-512.png (purpose: maskable) -->
```

## 4. 브랜드 이미지

`brand-hero.png`: Charcoal 어둠(neutral.950) + 제도용 점 격자 + 오른쪽 큰 심볼 + 아래 흐름 조각(노란 Intent → 탱저린 점선 경계 안의 파란 Runtime → Slate Data). 다이어그램 색 문법(12)을 브랜드 이미지에서도 그대로 쓴다.

- 왼쪽 45% 는 제목 자리다. 글자는 흰색, 테마와 무관하게 고정(`var(--aip-base-white)`).
- 16:9 크롭은 `object-position: 70% center`. 모바일은 이미지를 흐리게(opacity 0.45) 두고 글자를 위에.
- 이미지 위에 글로우·추가 도형을 얹지 않는다.

## 5. 재생성

```bash
cd aip/assets/brand
python3 build-brand-assets.py     # Pillow 필요. GEOMETRY(512 좌표)가 정본
```
SVG 와 PNG 가 같은 좌표에서 나오므로 파비콘·앱 아이콘·히어로 속 심볼이 항상 같다. 모양을 바꾸려면 `GEOMETRY` 만 고친다. PNG 를 손으로 편집하지 않는다. 이 스크립트가 시스템에서 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물). 값은 `tokens/src/brand.json` 과 같아야 한다.
