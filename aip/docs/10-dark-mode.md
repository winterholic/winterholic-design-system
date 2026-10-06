# 10 · 다크 모드 (AIP)

라이트가 기본이고 다크는 **반전이 아니라 재배치**다. 위계·대비·코드 가독성·브랜드가 그대로 남아야 한다.

## 1. 원칙 다섯

1. **면은 Charcoal 계열의 따뜻한 어둠**(neutral.975~900). 차가운 blue-black 개발툴 다크가 아니다. 라이트의 Charcoal 잉크와 같은 온도라 테마를 바꿔도 같은 제품으로 보인다.
2. **AIP Blue 는 그대로**다. primary 버튼·브랜드 면·실행 노드가 두 테마에서 같은 #1C77C3 이다. hover 는 두 테마 모두 어두워진다(밝아지면 흰 글자가 3.47:1).
3. **형광펜 노랑도 그대로**다. `<mark>` 는 다크에서도 #F5E663 + 어두운 글자.
4. **코드는 여전히 Slate**. 라이트에서는 종이 위 어두운 면, 다크에서는 캔버스보다 깊은 차가운 면 + 테두리. 구문 강조 색은 두 테마가 같다(코드 면이 둘 다 어두우므로).
5. **고도는 밝기로**. 떠 있는 면(raised)이 밝아지고, 그림자는 보조다(`shadow-dark.*`).

## 2. 면 매핑

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `surface.canvas` | white | neutral.950 #211F19 |
| `surface.subtle`(사이드바) | neutral.50 | neutral.975 #15140F (캔버스보다 깊게) |
| `surface.default` | white | neutral.950 |
| `surface.raised` | white + 그림자 | neutral.925 #292821 |
| `surface.sunken` | neutral.100 | neutral.975 |
| `code.bg` | slate.900 #2D2F3C | slate.975 #12131C |
| `surface.inverse`(툴팁) | neutral.900 | neutral.100 |

글자: primary neutral.100 · secondary 300 · tertiary 400. 링크·브랜드 글자는 blue.300. 상태·성숙도·선택 면은 `dark-tint.*`(각 색 600 을 다크 캔버스에 14% 섞은 값, 팔레트 스크립트가 계산), 글자는 200. 950 단계를 쓰지 않는 이유는 채도가 높아 따뜻한 캔버스 위에서 남색·녹색 덩어리로 뜨기 때문이다(렌더 비교로 확인).

## 3. 구현

- `dist/tokens.css` 가 `prefers-color-scheme: dark`(단, `data-theme="light"` 가 아니면)와 `:root[data-theme="dark"]` 두 경로로 199개 변수를 바꾼다. 컴포넌트·제품 코드는 **다크 분기를 쓰지 않는다**(`dark:`·미디어 쿼리 0건).
- 사용자가 고른 테마는 `localStorage['aip-theme']`. aip.js 의 `[data-aip-theme-toggle]` 버튼이 저장한다.
- 깜빡임 방지: `<head>` 맨 앞에 한 줄을 둔다(CSS 보다 먼저).

```html
<script>try{var t=localStorage.getItem('aip-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
```

- 테마와 무관해야 하는 면(브랜드 히어로 이미지 위 글자, 다크 고정 타일)은 원시 변수로 고정한다(`var(--aip-base-white)`). 시맨틱을 쓰면 다크에서 반전된다.

## 4. 다크가 이상해 보일 때

| 증상 | 원인 → 해결 |
|---|---|
| 카드가 배경에 묻힌다 | 카드는 테두리로 구분한다. `border.default` 가 빠졌는지 |
| 메뉴가 떠 보이지 않는다 | `surface.raised` + `shadow.md` + 테두리 셋 다 |
| 노란 면 위 글자가 흐리다 | 노란 면에는 `highlight.mark-text`(다크 neutral.950) |
| 코드 블록이 캔버스와 붙는다 | `code.border` 테두리 확인 |
| 로고 타일이 어둠에 묻힌다 | 어두운 면에는 `logo-lockup-inverse.svg` |
