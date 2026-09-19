# 14 · 브랜드 자산 (memoir)

## 1. 컨셉

**Empathic Archivist**. 디지털 기억을 고급 문구처럼 다룬다. 벚꽃의 섬세함과 네잎클로버의 행운을 합친 네 장의 보석 꽃잎, 크림 종이, 따뜻한 잉크와 기록을 안은 마스코트가 한 체계다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/memoir-symbol.png` | 벚꽃·네잎클로버 심볼의 투명 마스터 원본 |
| `assets/brand/logo-mark.svg` | 투명 마스터를 내장한 기본 컬러 심볼 |
| `assets/brand/logo-mark.png` | 투명 마스터에서 규격화한 래스터 심볼 |
| `assets/brand/logo-mark-mono.svg` | 로즈·잉크·흰색 단색 출력과 마스크 |
| `assets/brand/logo-lockup.svg` | 밝은 면의 Jakarta 워드마크 로고 |
| `assets/brand/logo-lockup-inverse.svg` | 로즈·어두운 면의 반전 로고 |
| `assets/brand/favicon.svg` | 필터 없는 브라우저 기본 파비콘 |
| `assets/brand/favicon-{16,32,48}.png` | 브라우저·검색 결과·레거시 메타데이터 |
| `assets/brand/favicon.ico` | 16~256 멀티사이즈 ICO |
| `assets/brand/app-icon-512.png` | PWA·앱 아이콘 |
| `assets/brand/mascot.png` | 빈 상태·온보딩·404용 캐릭터 원본 |
| `assets/brand/brand-hero.png` | 랜딩·저장소·소셜용 1600×900 브랜드 이미지 |
| `assets/brand/brand-hero.webp` | 웹 미리보기용 경량 브랜드 이미지 |

기존 `icon.svg`, `apple-icon.png` 경로도 호환을 위해 유지한다. `apple-icon.png`는 레거시 자산이며 새 파생물의 원본으로 쓰지 않는다.

## 3. 로고 규칙

- 심볼은 정확히 네 장의 벚꽃·클로버 꽃잎과 중앙의 하트형 여백, 짧은 줄기로 구성한다. 워드마크는 `memoir` 소문자다.
- 컬러·단색형은 반드시 `memoir-symbol.png`의 같은 알파 윤곽을 쓴다. 단색형을 별도 패스로 다시 그리지 않는다.
- 워드마크는 Plus Jakarta Sans 800, 자간 -0.03em. `m`은 rose, `emoir`는 ink다.
- 그라데이션은 심볼에만 쓴다. 워드마크 그라데이션과 Georgia 세리프는 쓰지 않는다.
- 최소 높이: 심볼 16px, 로크업 20px. 안전 여백은 심볼 높이의 절반이다. 파비콘과 앱 아이콘은 동일한 22% 모서리 반경을 쓰며 타일 밖은 투명하다.
- 라이트·크림 면은 `logo-lockup.svg`, 로즈·어두운 면은 `logo-lockup-inverse.svg`.
- 단색 출력과 CSS 마스크는 `logo-mark-mono.svg`에 `color`를 지정한다.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/brand/app-icon-512.png" />
```

## 4. 마스코트

빈 상태 120px, 404 160px, 온보딩·랜딩 200~320px를 권장한다. 원본에 밝은 배경이 포함되어 있으므로 크림·다크 면에서는 `surface.default` 원형 카드 안에 둔다. 앱 헤더·버튼·일반 카드 장식으로 반복하지 않는다.

## 5. 브랜드 이미지

`brand-hero`는 왼쪽에 제목·설명을 놓는 종이 여백, 오른쪽에 원형 카드 속 마스코트를 둔다. paper·blush·periwinkle만 쓰고 별도 테두리나 유리 효과를 얹지 않는다. 16:9 또는 1.91:1 크롭에서 캐릭터가 잘리지 않게 오른쪽 40%를 보존한다.

## 6. 생성 원본

파생 방법과 원본 관계는 `assets/brand/README.md`에 기록한다. `python scripts/build-brand-assets.py`를 다시 실행하면 PNG·WebP·ICO·SVG를 같은 규격으로 재생성한다.
