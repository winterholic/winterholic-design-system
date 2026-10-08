# 12 · 다크 모드 (Ttakkari)

시드가 다크 값을 이미 정했다(`.dark` 의 background·surface·surface-muted·border·text-muted). 이 시스템은 그 다섯을 그대로 쓰고, 그 사이를 graphite 램프로 채웠다. 다크는 **반전이 아니라 재배치**다.

## 1. 원칙 다섯

1. **캔버스는 시드 ink(#080705), 카드는 시드 #171B1C, 떠 있는 면은 시드 #22292A.** 고도는 밝기로 올라간다.
2. **Blue 버튼은 그대로**다(#296EB4). hover 는 두 테마 모두 어두워진다.
3. **Mint 가 글자가 된다.** 라이트에서 민트는 점·아바타·잉크 면에만 있었지만, 다크에서는 잉크 캔버스 위 13.55:1 이라 에이전트 이름표·실행 중 문구가 민트 원색이다(`text.agent`). 에이전트의 존재감이 다크에서 더 선다.
4. **잉크 면은 더 깊어진다.** 코드·로그 면은 카드보다 한 단계 깊은 graphite.975 + 테두리. 구문 강조 색은 두 테마가 같다.
5. **문서는 원본 그대로.** PDF 페이지·HTML 미리보기·이미지는 다크에서도 흰 바탕이다. 테마는 책상·툴바만 바꾼다.

## 2. 면 매핑

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `surface.canvas` | paper #F4F4ED | ink #080705 |
| `surface.subtle`(사이드바·툴바) | sage.75 #ECF2EF | graphite.975 #111516 |
| `surface.default`(카드) | #FFFFFF | 시드 #171B1C |
| `surface.raised`(메뉴·시트) | #FFFFFF + 그림자 | 시드 #22292A |
| `surface.muted`(칩) | 시드 #E9ECE8 | 시드 #22292A |
| `surface.sunken`(트랙) | #E9ECE8 | #111516(손잡이가 트랙보다 밝다) |
| `ink.bg`(코드·로그) | #171B1C | #111516 + 테두리 #30383A |
| `viewer.desk` | #E9ECE8 | #111516 |

글자: primary paper · secondary graphite.200 · tertiary 시드 #A6B0B8. 상태·작업·정책·선택 면은 `dark-tint.*`(각 색을 다크 카드 면 #171B1C 에 18% 섞은 생성값), 글자는 200 단계. 950 단계를 쓰지 않는 이유는 채도가 높아 잉크 위에서 남색·녹색 덩어리로 뜨기 때문이다. 카드 면에 섞은 이유는 상태 면이 카드 안(실행·승인 카드)에 가장 자주 놓여서다. 카드보다 어두운 구멍이 되지 않는다.

## 3. 구현

- `dist/tokens.css` 가 세 경로로 232개 변수를 바꾼다.
  - `@media (prefers-color-scheme: dark)` + `:root:not([data-theme="light"]):not(.light)`
  - `:root[data-theme="dark"]`
  - `:root.dark`(시드 규약. shadcn·Tailwind `darkMode: 'class'` 와 같은 이름)
- 컴포넌트·제품 코드는 **다크 분기를 쓰지 않는다**(`dark:`·미디어 쿼리 0건).
- 사용자가 고른 테마는 `localStorage['tk-theme']`(tk.js 의 `[data-tk-theme-toggle]` 가 저장, `tk:themechange` 이벤트를 낸다). React 는 같은 키를 쓴다.
- 깜빡임 방지: `<head>` 맨 앞에 한 줄(CSS 보다 먼저).

```html
<script>try{var t=localStorage.getItem('tk-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
```
- PWA 상태 표시줄 색: `dist/pwa.json` 의 `meta` 두 줄(`theme-color` light #F4F4ED · dark #080705)을 `<head>` 에. 사용자가 테마를 강제했다면 앱이 `meta[name=theme-color]` 의 content 를 같은 값으로 바꾼다.
- Monaco 는 CSS 변수를 못 읽는다. 테마가 바뀌면 `monaco.editor.setTheme('tk-ink-dark')`(19 §4).
- 테마와 무관해야 하는 면(브랜드 히어로 위 글자, PDF 페이지 안)은 원시 변수로 고정한다(`var(--tk-base-white)`). 시맨틱을 쓰면 다크에서 반전된다.

## 4. 다크가 이상해 보일 때

| 증상 | 원인 → 해결 |
|---|---|
| 카드가 캔버스에 묻힌다 | 카드는 테두리로 구분. `border.default` 확인 |
| 메뉴·시트가 떠 보이지 않는다 | `surface.raised` + 그림자 + 테두리 셋 다 |
| 로고 타일이 어둠에 묻힌다 | 헤더 브랜드는 외곽선 한 줄이 이미 있다. 단독 로고는 `logo-lockup-inverse.svg`(타일 없음) |
| 에이전트 아바타가 사라진다 | `agent.avatar-bg` 가 다크에서 #22292A 로 밝아진다. 이미지 대신 `.tk-avatar--agent` 를 쓴다 |
| 형광펜 위 글자가 흐리다 | `highlight.mark-text`(ink) 고정 |
| PDF 가 눈부시다 | 의도다. 문서는 원본. 책상(#111516)이 대비를 줄인다 |
| 코드 블록이 카드와 붙는다 | `ink.border` 테두리 확인 |
