# 01 · 색

## 1. 왜 이 팔레트인가

coolors 후보 4개 중 **"Bright Snow · Ash Grey · Pearl Aqua · Frozen Lake · Steel Blue"** 조합을 골랐다.

- winterholic 이라는 이름이 곧 겨울이다. 눈·안개·얼음·호수·강철의 이름을 가진 조합이 브랜드를 그대로 설명한다.
- GitHub 프로필 헤더가 이미 `#1a2980 → #26d0ce` (남색→청록) 그라데이션을 쓰고 있다. 이 조합은 그 정체성과 같은 계열이라 기존 결과물과 충돌하지 않는다.
- 5색 모두 청록·파랑 축에 있어 라이트·다크 어느 쪽에서도 한 톤으로 읽힌다. 대신 상태색(성공·경고·오류)과 색상 거리가 멀어 기능색이 섞이지 않는다.

여기에 **Twilight Indigo `#1D2F6F`** (1번 후보) 를 심색으로 더했다. 파랑 계열만으로는 히어로·푸터 같은 어두운 브랜드 면을 만들 때 깊이가 부족해서다. 경고색은 1번 후보의 Tuscan Sun `#FAC748`, 오류색은 4번 후보의 Raspberry Red `#CE2D4F`, 차트 보조색은 Soft Periwinkle `#9B7EDE` 와 Bubblegum `#F88DAD` 를 가져왔다. 고른 4개 후보를 버리지 않고 역할을 나눠 전부 썼다.

| 이름 | hex | 토큰 | 역할 |
|---|---|---|---|
| Bright Snow | `#F7F9F9` | `brand.snow` | 라이트 캔버스 |
| Ash Grey | `#BED8D4` | `brand.mist` | 장식 톤, 빈 상태 일러스트 |
| Pearl Aqua | `#78D5D7` | `brand.aqua` = `teal.300` | 보조 강조, 그라데이션 중간 |
| Frozen Lake | `#63D2FF` | `brand.ice` = `cyan.300` | 강조, 그라데이션 끝, **다크모드 브랜드 글자색** |
| Steel Blue | `#2081C3` | `brand.steel` = `blue.500` | **브랜드 주색** |
| Twilight Indigo | `#1D2F6F` | `brand.twilight` = `indigo.900` | 브랜드 심색, 히어로·푸터 |

## 2. 세 계층 구조

```
원시(램프)            시맨틱(역할)                     컴포넌트
blue.600 #1A76B4  →  color.action.primary.bg   →  component.button…
neutral.900       →  color.text.primary
```

- **화면 코드는 시맨틱만 쓴다.** `var(--wh-color-text-primary)` 처럼. 원시 `--wh-blue-600` 을 쓰면 다크모드가 깨진다(원시는 모드에 따라 바뀌지 않는다).
- 원시 램프는 `tokens/scripts/palette-from-anchors.mjs` 가 OKLCH 로 생성한다. hex 를 손으로 고치지 않는다.
- 램프 단계는 50(가장 밝음)부터 950(가장 어두움)까지 11단계. 이름이 곧 밝기다: 같은 단계면 색상이 달라도 체감 밝기가 비슷하다. 그래서 `red.700` 과 `green.700` 은 둘 다 흰 배경에서 글자로 쓸 수 있다.

### 램프별 앵커와 특징

| 램프 | 앵커(정확히 그 hex 인 단계) | 글자로 쓸 수 있는 최소 단계(흰 배경 4.5:1) | 비고 |
|---|---|---|---|
| blue | 500 = #2081C3 | **600** (#1A76B4, 4.89) | 500 은 4.21 로 미달. 그래서 액션은 600 |
| indigo | 900 = #1D2F6F | 600 | 진한 색 위주로 쓴다 |
| cyan | 300 = #63D2FF | 600 | 밝은 강조. 라이트에서 글자 금지 |
| teal | 300 = #78D5D7 | 600 | 밝은 강조. 라이트에서 글자 금지 |
| neutral | 600 = #64748B | 600 (4.76) | 살짝 파란 쿨 그레이 |
| green | 500 = #16A34A | 600 (4.63) | |
| amber | 200 = #FAC748 | **700** (#6B5626) | 노랑은 어둡게 내려야 글자가 된다 |
| red | 600 = #CE2D4F | 600 (5.11) | |
| purple | 500 = #9B7EDE | 600 | 차트·장식 전용 |
| pink | 400 = #F88DAD | 600 | 차트·장식 전용 |

전 단계의 대비 수치는 `tokens/src/palette.json` 의 `$extensions["wh.contrast"]` 에 들어 있다.

## 3. 시맨틱 색 — 무엇을 언제

### surface (면)
| 토큰 | 라이트 | 다크 | 언제 |
|---|---|---|---|
| `canvas` | snow #F7F9F9 | neutral.950 | `body`. 한 페이지에 한 번 |
| `default` | white | neutral.900 | 카드·패널·인풋·사이드바. canvas 위에 놓이는 것 |
| `raised` | white + shadow | neutral.800 | 모달·드롭다운·팝오버. **라이트에선 default 와 같은 색**이고 그림자로 구분한다. 다크에선 한 단계 밝다 |
| `sunken` | neutral.100 | #12161B | 코드블록·표 헤더·세그먼트 탭 트랙·스켈레톤. 안으로 들어간 느낌 |
| `overlay` | 950 @50% | black @60% | 모달 스크림 |
| `inverse` | neutral.900 | neutral.50 | 툴팁·토스트 |
| `brand` | twilight | indigo.800 | 히어로·로그인 사이드·프로모션. 위 글자는 `text.on-brand` |
| `brand-subtle` | blue.50 | blue.950 | 브랜드 기운만. 선택된 항목·활성 탭 배경·안내 카드 |
| `disabled` | neutral.100 | neutral.800 | 비활성 인풋 |

**면 쌓기 규칙**: canvas 위에 default, default 위에 raised. 같은 면을 같은 면 위에 바로 올리지 않는다(흰 카드 안에 흰 카드 ❌ → 안쪽은 `sunken` 이나 테두리만).

### text (글자)
| 토큰 | 라이트 | 대비(흰 배경) | 언제 |
|---|---|---|---|
| `primary` | neutral.900 | 13.12 | 본문·제목. 기본값 |
| `secondary` | neutral.700 | 6.98 | 설명·메타. 제목 아래 한 줄 |
| `tertiary` | neutral.600 | 4.76 | 캡션·타임스탬프·아이콘 라벨. **이보다 옅은 글자는 없다** |
| `placeholder` | neutral.600 | 4.76 | 인풋 플레이스홀더 |
| `disabled` | neutral.400 | 2.43 | 비활성. 대비 예외 |
| `inverse` | white | | inverse 면 위 |
| `on-brand` | white | 4.89 (blue.600) / 12.44 (twilight) | brand 면·primary 버튼 위 |
| `brand` | blue.700 | 6.92 | 강조 숫자·키워드 |
| `link` / `link-hover` | blue.600 / 700 | 4.89 / 6.92 | 링크는 밑줄을 같이 쓴다(색만으로 구분 금지) |
| `success` `warning` `danger` `info` | 각 700 | 6.6 이상 | 상태 문구. 아이콘과 같이 |

**글자에 원시색을 쓰지 않는다.** 특히 `#2081C3` 은 브랜드 원색이지만 글자로는 4.21:1 로 AA 미달이다. 브랜드색 글자가 필요하면 `text.brand`(700) 을 쓴다.

### border (테두리)
| 토큰 | 라이트 | 언제 |
|---|---|---|
| `subtle` | neutral.100 | 리스트 아이템 구분선, 카드 내부 섹션 |
| `default` | neutral.200 | 카드·패널 외곽, 표 선 |
| `strong` | neutral.400 | 인풋·셀렉트·텍스트에어리어 |
| `input-strict` | neutral.500 | 체크박스·라디오·토글 같은 **작은 컨트롤**. WCAG 1.4.11 비텍스트 3:1 을 맞춘 값 |
| `brand` | blue.500 | 선택·활성 표시 |
| `focus` | blue.500 | 포커스 링 |
| `danger` | red.500 | 오류 인풋 |
| `inverse` | white 20% | 어두운 면 위 구분선 |

`strong`(2.43:1) 이 3:1 미달인 것은 알고 정한 값이다. 인풋은 라벨·배경·높이로 이미 구분되고, 40px 짜리 큰 상자에 진한 테두리를 두르면 화면이 무거워진다. 접근성 기준을 엄격히 맞춰야 하는 화면(공공·금융)이면 인풋도 `input-strict` 로 올린다.

### action (버튼)
| variant | 언제 | 화면당 개수 |
|---|---|---|
| `primary` | 그 화면의 **주 목적** 행동(저장·결제·시작) | 1개. 두 개 있으면 하나는 secondary 로 내린다 |
| `secondary` | 주 행동 옆 대안(취소·뒤로·더보기) | 제한 없음 |
| `ghost` | 카드·표 안의 가벼운 행동(편집·필터·닫기 X) | 제한 없음 |
| `danger` | 되돌릴 수 없는 파괴(삭제·탈퇴·초기화). **확인 다이얼로그 안에서만** primary 자리를 차지한다 | |
| `danger-ghost` | 표 행의 삭제 아이콘처럼 눈에 덜 띄어야 하는 파괴 행동 | |
| `disabled` | 조건 미충족. 왜 안 되는지 도움말·툴팁을 같이 준다 | |

hover 는 `bg-hover`, 누르는 중은 `bg-active`. 색이 아니라 밝기 한 단계 차이라 눈에 튀지 않는다.

### status (상태 피드백)
| 상태 | 언제 | 아이콘 |
|---|---|---|
| `success` | 완료·저장됨·연결됨·정상 | check-circle |
| `warning` | 주의·곧 만료·되돌리기 어려움·부분 실패 | alert-triangle |
| `danger` | 실패·오류·삭제됨·차단 | x-circle / alert-octagon |
| `info` | 안내·팁·새 기능·중립 알림 | info |
| `neutral` | 상태가 아닌 분류 태그(카테고리·초안·보관) | 없음 |

각 상태는 `bg` `border` `text` `icon` `solid` `on-solid` 6종을 갖는다.
- 배너·인라인 메시지·토스트(컬러형): `bg` + `border` + `text` + `icon`
- 배지·도트·프로그레스 채움: `solid` + `on-solid`
- **warning.solid 는 노랑이라 검은 글자**(`on-solid` = neutral.900). 흰 글자를 얹으면 안 보인다. 빌드가 이 조합의 대비를 검사한다.

색만으로 상태를 말하지 않는다. 아이콘이나 문구가 반드시 같이 간다(색각 이상 사용자).

### interactive
- `focus-ring`: 모든 포커스 가능한 요소. `outline: 2px solid` + `outline-offset: 2px`. `typography.css` 가 `:focus-visible` 에 전역으로 걸어 둔다.
- `selected-bg` / `selected-border` / `selected-text`: 리스트·표·탭·세그먼트의 선택 상태.
- `hover-overlay` / `pressed-overlay`: 배경색이 무엇이든 위에 덧칠하는 반투명 층. 이미지 카드·표 행 hover 에 쓴다.

### accent (장식)
`ice` `aqua` `mist` `steel` `twilight`. 그라데이션 재료, 아이콘 배경, 구분 장식, 일러스트. **글자·상태·버튼에는 쓰지 않는다.**

## 4. 색 조합 규칙

1. **한 화면에 색상(hue)은 세 개까지**: 브랜드 파랑 + 중립 + 상태색 1개. 차트는 예외.
2. **채도 높은 면은 작게**: primary 버튼·배지·도트 정도. 큰 면(카드·섹션)은 `brand-subtle`, `frost` 그라데이션처럼 옅게.
3. **상태색은 상태에만.** "포인트 컬러" 로 빨강·초록을 쓰면 사용자가 오류·성공으로 읽는다.
4. **텍스트 대비 4.5:1, 아이콘·테두리 3:1.** 빌드(`node tokens/build.mjs`)가 시맨틱 조합 86쌍을 자동 검사한다. 새 조합을 만들면 `build.mjs` 의 `pairs` 에 추가한다.
5. **다크는 시맨틱이 알아서 바꾼다.** 컴포넌트에 `dark:` 분기를 쓰지 않는다. 09 참조.

## 5. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| `color: #2081C3` 로 브랜드색 글자 | `color: var(--wh-color-text-brand)` |
| 카드 배경 `#fff` 하드코딩 | `var(--wh-color-surface-default)` |
| primary 버튼 두 개 나란히 | 하나는 secondary |
| 삭제 버튼을 빨강 primary 로 목록 화면에 노출 | `danger-ghost` 아이콘 버튼, 확인 다이얼로그에서 `danger` |
| 노란 배지에 흰 글자 | `status.warning.solid` + `on-solid`(검정) |
| 회색 글자 `#999` 로 캡션 | `text.tertiary` (#64748B). #999 는 2.85:1 로 안 읽힌다 |
| 링크를 색만으로 표시 | 색 + 밑줄(hover 시라도) |
| 성공 체크를 초록색 원만으로 | 초록 + check 아이콘 + "저장됨" 문구 |
| 랜딩에 그라데이션 5종 | `gradient.brand` 하나, 보조로 `aurora` 하나 |

## 6. 원시 램프를 직접 써도 되는 유일한 경우

- 차트에서 시리즈가 8개를 넘어 `chart.categorical` 이 모자랄 때(그 전에 차트를 나누는 게 먼저다).
- 일러스트·OG 이미지·이메일 템플릿처럼 **다크모드가 없는 정적 산출물**.
- 이 경우에도 `var(--wh-blue-300)` 처럼 변수로 쓴다. hex 는 여전히 쓰지 않는다.

## 7. 코드 예시

```css
.card {
  background: var(--wh-color-surface-default);
  border: var(--wh-border-width-hairline) solid var(--wh-color-border-default);
  border-radius: var(--wh-radius-lg);
  box-shadow: var(--wh-shadow-sm);
  color: var(--wh-color-text-primary);
}
.card__meta { color: var(--wh-color-text-tertiary); }
.btn-primary {
  background: var(--wh-color-action-primary-bg);
  color: var(--wh-color-action-primary-text);
}
.btn-primary:hover { background: var(--wh-color-action-primary-bg-hover); }
.alert--warning {
  background: var(--wh-color-status-warning-bg);
  border: 1px solid var(--wh-color-status-warning-border);
  color: var(--wh-color-status-warning-text);
}
```

Tailwind(프리셋 적용 후):
```html
<div class="bg-surface-default border border-border-default rounded-lg shadow-sm text-text-primary">
  <p class="text-text-tertiary">…</p>
  <button class="bg-action-primary-bg text-action-primary-text hover:bg-action-primary-bg-hover">저장</button>
</div>
```
