# 05 · 모션

원칙: 모션은 **상태 변화**와 **장면 등장**만 설명한다. 장식용 반복은 전구 트윙클·장식 스웨이·눈 파티클뿐이고, 모두 reduced-motion 에서 정지한다.

| 용도 | 토큰 |
|---|---|
| 눌림·토글 | `duration.fast` 120 + `easing.spring`, `scale.press` 0.97 |
| 카드 선택·툴팁 | `normal` 220 |
| 시트·화면 전환 | `slow` 360 + `soft-out` |
| 트리 등장 | `scene-reveal` 1400, 장식 낙하 `scene-enter` 900 + `spring`, 낙하 거리 `distance.drop` 48, 순서 지연 55ms |
| 전구 | `twinkle` 2400 주기, 전구마다 위상 다름 |
| 점수 카운트업 | 1100ms ease-out(코드), reduced-motion 이면 즉시 |

성능 기준(저사양 근사: CPU 4배 감속, 390×844 DPR2): 랜딩·공개 연출·장식 51개 트리 모두 60fps, 33ms 초과 프레임 0(서비스 저장소 `scripts/measure-perf.mjs`). 헤드리스 측정이라 GPU 합성 부하는 실기기에서 재확인 필요.
`will-change` 를 쓰지 않고 transform·opacity·translate·rotate 만 애니메이션한다. 장면 컨테이너는 `contain: layout paint`.
