# memoir 브랜드 자산

심볼 원본은 앱의 `apple-icon.png`와 `icon.svg`, 캐릭터 원본은 `mascot.png`다. 로크업은 디자인 시스템 정본인 Plus Jakarta Sans 800, 로즈 `m`, 잉크 `emoir` 규격으로 다시 만들었다.

## 생성 방식

- 원본: `apple-icon.png`, `mascot.png`
- 파생 스크립트: `../../../scripts/build-brand-assets.py`
- 실행: 저장소 루트에서 `python scripts/build-brand-assets.py`
- 파생: 컬러·단색 SVG, 로크업 2종, 16/32/48 PNG, 멀티사이즈 ICO, 512 앱 아이콘, 1600×900 PNG/WebP 히어로

히어로는 생성형 이미지가 아니라 기존 마스코트와 memoir의 paper·blush·periwinkle 팔레트를 Pillow로 합성한 결정론적 자산이다.
