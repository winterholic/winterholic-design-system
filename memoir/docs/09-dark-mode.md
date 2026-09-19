# 09 · 다크 모드 (memoir)

기존 프로젝트에는 다크가 없었다(`dark:` 1건). 개인 메모는 밤에 많이 쓴다. 이 시스템은 **따뜻한 다크**를 추가했다: 검정이 아니라 ink 계열 갈색 검정 위에 따뜻한 흰 글자.

## 1. 동작
`dist/tokens.css` 하나로 시스템 자동 / `data-theme="dark"` / `data-theme="light"`. `color-scheme` 포함. Next.js 는 `<html suppressHydrationWarning>` + head 인라인 스크립트로 깜빡임 방지(base 09 §1).

## 2. 컴포넌트가 할 일: 없음
시맨틱 토큰·프리셋 클래스(`bg-surface-default` 등)만 쓰면 자동. 기존 별칭(`bg-surface-low`·`text-on-surface`·`bg-sub-cream`)도 시맨틱을 가리켜 따라온다. Tailwind 원시 클래스(`bg-white` `text-black` `bg-gray-100`)만 남지 않게(15).

## 3. 매핑 원리
| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 종이 층 | paper → paper-tint → white | #1B1514 → ink #231917 → neutral.900 #382D2B | 위로 갈수록 밝게. 갈색 계열 유지 |
| 글자 | ink | paper #FFF9F8 | 순백 아닌 따뜻한 흰색 |
| primary 버튼 | 로즈 + 흰 글자 | **핑크 #FF82A9 + wine 글자** | 어두운 면에서 핑크 원색이 살아난다(7.4:1 on ink). 로즈는 다크에서 죽는다 |
| 활성 메뉴 | 페리윙클 + 흰 | 인디고 + 흰 | 페리윙클은 어두운 면에서 흐리다 |
| 링크·브랜드 글자 | indigo / rose | blue.300 / pink.300 | |
| 칩 활성 | 핑크 + wine | 같음 | 핑크는 양쪽에서 강조색 |
| 태그 | blush + ink | pink.300 + wine | |
| 코드 블록 | #1A1A1A | #141010 | 카드(#382D2B)보다 어둡게 |
| 글래스 | white 80% | neutral.900 90% | 어두운 글래스는 더 불투명해야 글자가 산다 |
| 그림자 | ink 5~8% | 검정 35~65% | + 면 차이가 주 신호 |
| 상태 | 50 + 700 | 950 + 300 | |
| 히트맵 | paper-deep → pink.400 | neutral.800 → pink.400 | 최고 단계는 공통 |

## 4. 다크에서 확인할 것
- 순백 면: 북마크 OG 이미지 흰 배경, 마스코트 PNG 흰 여백 → `surface.default` 카드 안에 넣고 radius.
- 블롭(랜딩): `blob-pink` alpha 라 그대로 OK. `gradient.paper` 는 원시 참조라 밝게 남는다 → 다크에서 `surface.zone` 단색.
- `fade-right` 도 paper 참조 → 컴포넌트에서 `linear-gradient(90deg, transparent, var(--mm-color-surface-canvas))` 로 직접 쓰면 양쪽에서 맞는다.
- 코드 하이라이트 테마는 다크 전용 하나로 양쪽 공용(코드 블록은 항상 어둡다).
- 글래스 벤토 뒤에 크림(다크에서 neutral.900) 이 있어야 보인다.

## 5. 검증
빌드 116쌍 중 다크 절반 통과. `data-theme="dark"` 강제 후 ① `bg-white`·`text-black` 잔존 ② 흰 이미지 박스 ③ 로즈 버튼이 핑크로 바뀌는지.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `dark:bg-neutral-900` | `bg-surface-default` |
| 다크 캔버스 `#000`·`#111` | `#1B1514` 따뜻한 검정(토큰) |
| 다크에서 로즈 버튼 유지 | 토큰 그대로(핑크 + wine) |
| 다크 글래스 40% 모달 | 모달 90%, 벤토만 40% |
