# 01 · 색 (여행가쟈)

## 1. 출처와 원칙
색은 원본 `frontend/src/styles/tokens.css` 의 값 그대로다(이 저장소는 값을 만들지 않고 역할을 기록한다). 무드는 **한지 배경 + 단청 가는 선 + 민화 + 가챠 도파민**. 박물관(사극)도 일반 가챠앱도 아니다.

원본 Bright Line 중 색에 관한 것:
- **2. 배경은 한지 계열.** 순백 `#fff` 금지. 어두운 배경은 가챠 연출(prelude·결과 공개)에만.
- **3. 단청 5색은 액센트로만.** 캡슐 띠·카드 띠·탭 밑줄·버튼처럼 가는 라인·작은 면에. 큰 면을 단청 원색으로 채우지 않는다.
- **9 > 5·6·8 > 2·3** 우선순위: 접근성이 색을 이긴다.

## 2. 원시 팔레트 (램프 없음 — 이름 그룹)

### 한지 5단계 `hanji.*`
| 토큰 | 값 | 원본 | 언제 |
|---|---|---|---|
| `bright` | #FBF5E5 | `--hanji-bright` | 카드·입력·칩·시트처럼 떠 있는 표면. "흰" 표면은 전부 이것 |
| `base` | #F4ECDA | `--hanji` | 앱 메인 배경(+ 점 텍스처) |
| `2` | #E8DCBE | `--hanji-2` | 연한 구분면·프로그레스 트랙·선택 항목·비활성 탭 |
| `dark` | #D9C99E | `--hanji-dark` | 리스트 경계선 |
| `deep` | #B8A578 | `--hanji-deep` | 텍스처 점·스크롤바·시트 손잡이 |

### 단청 오방색 `dancheong.*`
| 토큰 | 값 | 깊은 톤 | 역할 |
|---|---|---|---|
| `red` | #C8362E | `red-deep` #9E2521 | 주 액센트: CTA·도장·탭 밑줄·활성 네비·Epic |
| `blue` | #2A5E8C | `blue-deep` #18416B | 보조 액센트: 링크·포커스·파랑 버튼·Rare |
| `yellow` | #E8B632 | `yellow-deep` #B8881A | 오방색 띠·경고 띠. 글자 금지(1.6) |
| `white` | #F6F0E2 | | 오방색 띠의 흰 |
| `black` | #1A1611 | | = ink |

오방색 띠 = 빨강·파랑·노랑·흰·검 20% 씩(`gradient.band`). 앱 상단 6px, 캡슐 띠, 카드 띠에 반복. 브랜드 시그니처.

### 잉크 4단계 `ink.*` (한지 위 대비, 2026-09-19 실측)
| 토큰 | 값 | on hanji | on bright | 언제 |
|---|---|---|---|---|
| `1` | #1A1611 | 15.3 | 16.5 | 본문·제목·먹선 |
| `2` | #4A3D2E | 8.94 | 9.66 | 보조·라벨 |
| `3` | #735F47 | 5.17 | 5.58 | 메타·비활성 탭. **읽어야 하는 글자의 하한**(AA 통과) |
| `4` | #A89479 | 2.49 | 2.69 | **글자 금지.** 장식 선·워터마크·텍스처 |

> 원본 스킬 `tokens.md` 는 `--ink-3` 를 `#7c6b53`(4.37, 미달)로 적고 있지만 코드 `tokens.css` 는 `#735f47`(5.17, 통과)다. 코드가 정본. `--ink-4` 21곳 사용은 원본 부채 트래커에 있다(15).

### 보조 한국색 `korean.*`
`jade` #4A8A6D · `persimmon` #DC6B43 · `indigo` #2F3D6E · `plum` #8B3A5E · `gold` #C9A032 · `gold-bright` #E8C44E · `twilight` #4A3A6E · `moon-white` #9FB3C0. 칩 변형·등급색 재료. 큰 면 금지. jade(3.47)·persimmon(2.87)·gold 계열은 글자 단독 금지.

### 홀로 `holo.*`
`red` #FF5247 · `blue` #4DB5FF · `yellow` #FFD84D · `jade` #5FCFA0 · `plum` #D14F8E. **어두운 무대 위 빛 효과 전용.** 일반 UI 글자·배경 금지. 무대(tone=dark)에서는 칩·상태 아이콘·등급 액센트가 이 색으로 자동 교체된다.

### 무대 `stage.*`
`bg` #1A1611 · `bg-deep` #110E0A · `text` #FBF5E5. Bright Line 2 의 명시된 예외.

## 3. 시맨틱 — 무엇을 언제

### surface
| 토큰 | 값 | 언제 |
|---|---|---|
| `canvas` | hanji.base + 점 텍스처(`texture.*`) | body. 셸 배경 |
| `default` | hanji.bright | 카드·입력·칩·탭바·도감 셀·드롭다운 |
| `raised` | hanji.bright + `shadow.paper` | 시트·다이얼로그·플로팅 필터 |
| `sunken` | hanji.2 | 프로그레스 트랙·선택 항목·비활성·card-shell |
| `line` | hanji.dark | 리스트 경계(면으로 쓸 때) |
| `deep` | hanji.deep | 텍스처·스크롤바 thumb |
| `overlay` | ink 60% | 시트·다이얼로그 스크림 |
| `inverse` | ink | 툴팁·토스트·무대 |
| `brand` | dancheong.red | CTA 버튼 면만. 카드·섹션 배경 금지 |
| `brand-subtle` | hanji.2 | 선택된 항목(단청 대신 종이 한 단계 진하게) |
| `stage` | stage.bg | 연출 화면 배경(`data-tone="dark"`) |

**면 쌓기**: canvas 위 default(먹선 테두리로 구분, 그림자는 paper/stamp). 종이가 종이 위에 올라가는 느낌이지 카드가 뜨는 느낌이 아니다. 데스크톱은 canvas 위 hanji.2 격자 책상 → 폰 프레임(hanji.base) → 카드.

### text
| 토큰 | 값 | 언제 |
|---|---|---|
| `primary` | ink | 본문·제목 |
| `secondary` | ink-2 | 보조·라벨·등급 한국어명 |
| `tertiary` | ink-3 | 메타·비활성 탭·플레이스홀더. 하한 |
| `decorative` | ink-4 | 글자 아님. 워터마크·텍스처 선 |
| `brand` | dancheong.red | 강조 단어·eyebrow·타이틀 밑줄. 14px 800 이상(4.44 on hanji) |
| `link` | dancheong.blue | 링크(밑줄 동반). 5.8 |
| `on-brand` / `inverse` | hanji.bright | 빨강·파랑 버튼·ink 면 위 |
| `danger` | red-deep | 오류 문구 6.5 |
| `success` `warning` `info` | jade / yellow-deep / blue | success·warning 은 글자 단독 금지 → 문구는 ink, 색은 아이콘·띠 |

### border — 먹선
| 토큰 | 값 | 언제 |
|---|---|---|
| `ink` | ink 2px (칩·입력 1.5, 카드 3) | 카드·버튼·캡슐·탭바·프레임·도감 셀. 이 시스템의 기본 테두리는 검은 먹선이다 |
| `subtle` | hanji.dark 1px | 리스트 구분 |
| `default` | hanji.deep 1px | 표·구획 |
| `faint` | ink 14% 1px | 데스크톱 플로팅 네비 외곽 |
| `brand` | dancheong.red | 선택·강조 띠 |
| `focus` | dancheong.blue 2px offset 3 | 포커스 링 |
| `danger` | red-deep | 오류 입력 |

### action (버튼 3변형 + danger)
| variant | 면 / 글자 / 그림자 | 언제 |
|---|---|---|
| `primary`(red) | 빨강 / hanji.bright(4.8) / `stamp` 빨강 | 가챠 굴리기·저장·다음. 화면당 1개 |
| `secondary`(blue) | 파랑 / hanji.bright(6.3) / `stamp-blue` | 보조 행동(공유·코스 보기) |
| `ghost` | 투명 / ink / `stamp-ink` | 닫기·건너뛰기·보조 |
| `danger` | red-deep / hanji.bright / `stamp` ink | 계정 연결 해제·기록 삭제. 확인 다이얼로그 안에서만 |
| `disabled` | hanji.2 / ink-3 / 1px ink-3, opacity .72 | 남은 횟수 0 등. 이유 문구 동반 |

hover 는 deep 톤, active 는 색이 아니라 `translate(1px,1px)` + 그림자 1px(도장이 눌리는 느낌).

### rarity (11 상세)
`common` `rare` `epic` `legend` `unique` `moment` × `accent`(띠·테두리·도장) · `text`(라벨) · `glow`(연출) · `solid`. 등급은 카드에 붙고 지역에 붙지 않는다. 색으로만 등급을 말하지 않는다(풀네임 병기).

### status
이 시스템은 상태색 **면**을 쓰지 않는다. 한지 면 + 색 테두리(1.5px) + 아이콘. 글자는 ink. 오류만 red-deep 글자 허용.

### chip
`red` `blue` `yellow`(deep) `jade` `plum` — 테두리·글자만 색, 배경 한지. 노랑 칩은 글자 대비 2.72 라 아이콘·굵기 동반.

### interactive
`focus-ring` 파랑 · `selected-bg` hanji.2 · `selected-border` 빨강 · `tab-active` 빨강 밑줄 · `nav-active` 빨강 아이콘.

### band · fx · chart
오방색 5색 · 연출 빛(무대 전용) · 진행바 트랙 hanji.2 채움 빨강.

## 4. 조합 규칙
1. 화면의 90% 는 한지·잉크. 색은 띠·테두리·도장·라벨·CTA 에만.
2. 한 화면에 단청 액센트 색은 두 종류(빨강 + 파랑). 노랑은 띠에서만.
3. 큰 면을 칠하는 것은 CTA 버튼과 무대 배경뿐.
4. 등급색은 카드 프레임·띠·글로우·라벨. 카드 배경은 항상 한지.
5. 홀로색·글로우는 `data-tone="dark"` 안에서만.
6. 상태(성공·오류)를 면색으로 말하지 않는다. 테두리·아이콘·문구.
7. 대비: 글자 4.5(`ink-3` 이상), 테두리·아이콘 3. 빌드가 92쌍 검사.

## 5. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `background: #fff` | `surface.default` (#FBF5E5) |
| 카드 배경 `--dc-blue` | 한지 + 파랑 띠/테두리 |
| `--ink-4` 로 메타 글자 | `text.tertiary`(ink-3) |
| 노랑·금 글자 | 띠·글로우로, 글자는 ink |
| 홀로색으로 일반 버튼 | 단청 원색. 홀로는 무대 |
| 등급을 색만으로 | 풀네임 라벨(Cinzel) + 한국어명 |
| 성공 배너 초록 면 | 한지 면 + jade 테두리 + 아이콘 |
| 회색 스켈레톤 `#eee` | `surface.sunken` (hanji-2) |
| 시스템 다크 모드 대응 | 없음. 무대만 `data-tone="dark"` |
