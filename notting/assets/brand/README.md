# notting 브랜드 자산

사용 규칙은 [`../../docs/14-brand-assets.md`](../../docs/14-brand-assets.md), 통합 미리보기는 [`../../examples/preview.html`](../../examples/preview.html) 첫 영역.

## 생성 방식

- 로고 도구: `build-brand-assets.py` (Pillow). 로고 심볼은 생성형 이미지가 아니라 스크립트의 기하가 정본이다.
- 심볼 좌표(`GEOMETRY`, 512 기준)에서 SVG 와 PNG 가 같이 나온다. 모양을 바꾸려면 `GEOMETRY` 만 고치고 다시 실행한다.
- 히어로: `gradient.brand`(teal.800 → verdigris → periwinkle, 135deg) 위 심볼 480 + 옅은 종이 줄. 1600×900 PNG/WebP.
- 캐릭터 원본: `mascot.png`. 기존 로고를 참조해 이미지 생성 모델로 만든 뒤 빨간 키 배경을 제거한 투명 마스터다. 잉크 문서 몸체·종이 얼굴·verdigris 북마크·periwinkle 근거 불빛을 고정한다.
- 캐릭터 파생: `mascot.webp`, `mascot-avatar-512.png`. 앱 설치용으로 `apple-touch-icon-180.png`, 안전 영역을 확보한 `app-icon-maskable-512.png`도 만든다.
- 이 스크립트가 유일하게 hex 를 직접 쓰는 곳이다(정적 산출물 예외, 01 §6). 값은 `tokens/src/brand.json`·`palette.json` 과 같아야 한다.

```bash
python build-brand-assets.py
```
