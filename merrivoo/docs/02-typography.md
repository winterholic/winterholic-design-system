# 02 · 타이포그래피

## 서체와 라이선스(검증 결과)
| 서체 | 용도 | 라이선스 | 검증 |
|---|---|---|---|
| Pretendard Variable | 질문·본문·버튼·입력 | SIL OFL 1.1 | npm 메타데이터 + 배포 CSS 헤더 확인 |
| Cormorant Garamond 600/700 | 타이틀·점수의 라틴·숫자 | SIL OFL 1.1 | 패키지 라이선스 파일 확인 |
| MaruBuri SemiBold/Bold | 타이틀의 한글 | 네이버 안내는 나눔글꼴 전체를 OFL 1.1 로 명시 | **마루부리를 직접 지목한 문구는 못 찾음 → 출시 전 확인 필요.** 폰트 파일 name 테이블에는 라이선스 기록 없음(저작권자 표기만) |

이 저장소는 **폰트 파일을 담지 않는다**(스택에 이름만). 파일은 소비 서비스가 자체 호스팅한다.

## 스택과 규칙
- `font.family.display` = Cormorant Garamond → MaruBuri → Nanum Myeongjo → serif. 한글에는 Cormorant 글리프가 없어 자연히 MaruBuri 로 폴백한다. 한 줄 짧은 글에만 쓴다.
- `font.family.sans` = Pretendard Variable → 시스템 한글 폴백.
- 크기 12~56px(모바일 하한 12, 입력 16 미만 금지). 굵기는 400·500·600·700 네 단계.
- 행간 한글 본문 1.6, 제목 1.3, display·점수 1.15. 자간 display -0.02em, 제목 -0.01em.

## 스타일(역할)
display-lg/md/sm · score · heading-1/2 · question · body-lg/md/sm · label-lg/md/sm · caption · overline · numeric. 컴포넌트 토큰이 `typography.*` 를 참조한다.

## 줄바꿈·최대 줄·반응형
- 전역 `word-break: keep-all; overflow-wrap: anywhere`. 질문·제목은 `text-wrap: balance`, 본문은 `pretty`.
- 최대 줄: 질문 4 · 선택 카드 제목 3(부제 2) · 세계관 이름 2 · 결과 본문 6 · 한마디 입력 60자. 넘치면 `line-clamp`.
- 작은 휴대폰(~374px)은 display-lg 34 / display-md 28 로 한 단계 내림, 태블릿(600+)은 한 단계 올림.
- 숫자: 점수·수치는 라이닝 숫자(`lining-nums`), 표·카운터는 `tabular-nums`. 영문 브랜드명은 Cormorant, 한글 문장 안의 숫자 단위는 붙여 쓴다(`91점`, `3명`).
- 폰트 로딩: `font-display: swap`. Pretendard 는 unicode-range 분할본을 쓰고, display 용 Cormorant 는 700 라틴만 preload 한다.
