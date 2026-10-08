# 02 · 타이포그래피 (Ttakkari)

## 1. 전략 한 줄

**메시지·UI·문서는 Pretendard 한 서체, 기계값(코드·로그·경로·해시·용량·시각)만 JetBrains Mono.** 모노는 "이것은 기계가 만든 값이다"라는 표식이다. 에이전트가 쓴 문장은 sans, 에이전트가 실행한 흔적은 mono.

| 패밀리 | 토큰 | 쓰는 곳 | 로드 |
|---|---|---|---|
| Pretendard Variable | `font.family.sans` | 메시지·제목·본문·UI 전부 | `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css` |
| JetBrains Mono | `font.family.mono` | 코드·로그·인라인 코드·경로·확장자·해시·ID·시각·kbd | `https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5/index.min.css` |

PWA 는 오프라인에서도 열려야 한다. 두 글꼴을 서비스 워커 캐시에 넣거나 자체 호스팅한다(19 §6). 글꼴이 없어도 fallback 목록(Apple SD Gothic Neo·Noto Sans KR·Menlo)으로 레이아웃이 유지된다.

리거처는 끈다. 로그의 `!=` 가 `≠` 로 보이면 사람이 읽은 것과 기계가 출력한 것이 달라진다.

## 2. 스케일

`font.size`: xs 12 · sm 14 · md 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36. **12px 아래는 없다.**
`font.weight`: 400 · 500 · 600 · 700.
`font.line-height`: none 1 · snug 1.25 · heading 1.35 · normal 1.5 · relaxed 1.6 · prose 1.7.

AIP 보다 위쪽 단계가 짧다(48·60 없음). 앱 화면에는 마케팅 제목이 없고, 가장 큰 글자는 로그인 한 줄이다.

## 3. 역할 스타일

화면의 글자는 이 클래스 중 하나로만 놓는다. 개별 size·weight 조합은 금지다. 클래스는 색을 정하지 않는다(`.tk-text-secondary` 같은 유틸·컴포넌트가 정한다). 이름은 컴포넌트 블록(`.tk-code`·`.tk-log`·`.tk-message`)과 겹치지 않게 지었다(빌드가 막는다).

### 화면
| 클래스 | 값 | 언제 |
|---|---|---|
| `.tk-display` | 36/700/1.25/−0.02em | 로그인·온보딩. 모바일 30 |
| `.tk-heading-1` | 24/700 | 화면 제목(보관함·파일 찾기·설정). 모바일 20 |
| `.tk-heading-2` | 20/600 | 다이얼로그·시트 제목·화면 섹션. 모바일 18 |
| `.tk-heading-3` | 18/600 | 카드 묶음·상세 패널 제목 |
| `.tk-heading-4` | 16/600 | 실행·승인·결과물 카드 제목 |

채팅 화면의 제목은 헤더 한 줄(16/600)이다. 대화 위에 큰 제목을 두지 않는다. 세션 이름은 정보이지 표지가 아니다.

### 메시지·UI
| 클래스 | 값 | 언제 |
|---|---|---|
| `.tk-body-message` | 16/400/1.6 | 채팅 메시지 본문(컴포넌트가 이미 쓴다) |
| `.tk-body-md` | 16/400/1.6 | UI 본문. 모르면 이것 |
| `.tk-body-sm` | 14/400/1.6 | 카드 본문·검색 스니펫·승인 사유 |
| `.tk-label-lg` · `-md` · `-sm` | 16 · 14 · 12 / 500 | 버튼·라벨·탭·칩·탭바 |
| `.tk-caption` | 12/400/1.5 | 시각·도움말. tertiary 와 짝 |

### 문서 뷰어
`.tk-doc-title` 30/700 · `doc-h2` 24 · `doc-h3` 20 · `doc-h4` 16 / 600 · `doc-body` 16/**1.7** · `doc-caption` 14. 실제로는 `.tk-prose` 가 맨 요소(h1~h4·p)에 같은 값을 준다(09 §3).

### 기계값
| 클래스 | 값 | 언제 |
|---|---|---|
| `.tk-source` | 모노 14/1.6 | 코드(`.tk-code` 가 쓴다) |
| `.tk-log-line` | 모노 12/1.6 | 로그(`.tk-log` 가 쓴다). 밀도 우선 |
| `.tk-mono-label` | 모노 12/500 | 경로·용량·해시·Artifact ID·경과 시간 |
| `.tk-eyebrow` | 모노 12/600/대문자/0.06em | 영문 분류 라벨(TODAY·PDF). 한국어 그룹 이름은 `label-sm` |
| `kbd` | 모노 12 | 단축키 |
| `.tk-numeric` | 16/500/tabular | 수치 |
| `.tk-mono` (유틸) | 모노 + tabular | 문장 안 한 조각 |

## 4. 메시지 본문의 리듬

- 사용자 말풍선: 16/1.6, `white-space: pre-wrap`(쓴 줄바꿈 그대로). 말풍선 최대 폭 85%.
- 에이전트 본문: `.tk-prose--compact` 로 Markdown 을 받는다. 문단 사이 12, 제목은 18·16 까지만(채팅이 문서처럼 보이지 않게), 코드·표·콜아웃 위아래 20.
- 문서 뷰어는 같은 prose 를 넓은 리듬으로: 문단 20, h2 위 40, 본문 열 720.

## 5. 한·영 혼용과 기계값

- `:lang(ko)` 에 `word-break: keep-all`. 긴 경로·해시는 `overflow-wrap: anywhere` 로 넘친다. 경로는 말줄임하지 않는다(정보가 사라진다). 파일 이름은 목록에서 한 줄 말줄임, 상세·뷰어 제목에서 전체.
- 시간: 오늘은 `14:32`, 이번 주는 요일(`화`), 그 밖은 `2026.10.09`. 경과는 `1분 42초`(짧은 문장)·`0:47`(진행 중 타이머, 모노).
- 용량: `148 KB` · `3.2 MB`(공백 하나, 단위 대문자). 개수: `파일 3개`.
- 제목에 `text-wrap: balance`, 문단에 `pretty`(base.css). 한글 줄 끝에 낱말 하나만 떨어지지 않는다.

## 6. 하지 말 것 → 대신

| ❌ | ✅ |
|---|---|
| 로그를 sans 로 | `.tk-log`(모노 12) |
| 에이전트 답 전체를 모노로 | 답은 sans. 모노는 그 안의 코드·경로만 |
| 메시지 14px(모바일에서 많이 보이게) | 16 고정. 밀도는 간격·접기로 |
| 입력 14px | 16. iOS 가 확대한다 |
| 13·15px | 스케일 안의 12·14·16 |
| font-weight 300 | 400 이상 |
| 경로를 `…/report.md` 로 말줄임 | Path(`.tk-path`)가 앞 단계를 접는다. 전체 경로는 상세에 |
