# 14 · 브랜드 자산 (memoir)

## 1. 컨셉
**Empathic Archivist**(design-guide): 디지털 기억을 고급 문구처럼 다룬다. 크림 종이, 따뜻한 검정 잉크, 핑크 꽃잎(로고 심볼). 차갑고 기능적인 노트 앱이 아니라 개인의 서랍.

## 2. 파일
| 파일 | 출처 | 용도 |
|---|---|---|
| `assets/brand/icon.svg` | `app/icon.svg` | 파비콘·앱 아이콘. 핑크 꽃잎(클로버) 심볼, 그라데이션 `#FFC1D1 → #FF82A9 → #F45E93` |
| `assets/brand/apple-icon.png` | `app/apple-icon.png` | iOS 홈 아이콘 |
| `assets/brand/favicon.ico` | `app/favicon.ico` | 레거시 파비콘 |
| `assets/brand/mascot.png` | `public/mascot.png` | 마스코트. 빈 상태·온보딩·404·랜딩 |

로고 컴포넌트는 `components/ui/MemoirLogo.tsx`(인라인 SVG: 꽃잎 심볼 + 워드마크). **보완 필요**(15 §2 #9): 워드마크가 Georgia 세리프 + 핑크 그라데이션이라 design-guide(Jakarta, 로즈 마크)와 어긋난다. 이 시스템의 정본은 아래 §3.

## 3. 로고 규격
- **심볼**: 핑크 꽃잎(icon.svg). 단색 버전은 `brand.rose` 또는 `brand.ink`. 그라데이션 심볼은 파비콘·앱 아이콘·랜딩 히어로에만.
- **워드마크**: `memoir` 소문자, Plus Jakarta Sans 800, 24px 기준, 자간 -0.03em. `m` 만 `text.brand`(로즈), 나머지 `text.primary`. 그라데이션 텍스트 금지(design-guide "무거운 그라데이션 금지", 대비 검증 불가).
- **로크업**: 심볼 24 + 8px + 워드마크. 헤더는 이 형태. 모바일은 심볼만 허용.
- **최소 크기**: 심볼 16(파비콘), 로크업 높이 20.
- **여백**: 심볼 높이의 1/2.
- **배경**: 라이트 캔버스·크림 위 정본. 로즈 면 위에서는 흰 단색. 다크에서는 `m` pink.300 + 나머지 paper.
- **금지**: 세리프 워드마크, 그림자, 회전, 다른 핑크.

```html
<a class="mm-logo" aria-label="memoir 나의 공간으로"><img src="icon.svg" width="24" height="24" alt="" /><span class="mm-logo-mark">m</span>emoir</a>
```

## 4. 마스코트 사용
크기 120(빈 상태)·160(404)·200(랜딩). 흰 배경 PNG 라 크림·다크 위에서는 `surface.default` 원형 카드(radius full) 안에. 문구와 나란히 두고 말풍선은 만들지 않는다. 앱 헤더·카드·버튼에는 안 쓴다.

## 5. OG · 앱 아이콘
- OG 1200×630: 캔버스 cream + 블롭 옅게, 심볼 120 + 워드마크(로즈 m), 하단 caption "개인 메모 & 보안 관리".
- 앱 아이콘: icon.svg 그대로(마스크 없이 여백 12%).
- 스플래시(PWA): cream 배경 + 심볼 96.
