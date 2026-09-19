# memoir 브랜드 자산

심볼 원본은 `memoir-symbol.png`, 캐릭터 원본은 `mascot.png`다. 심볼은 벚꽃의 갈라진 꽃잎과 네잎클로버의 행운을 한 윤곽으로 합치고, 넓은 보석면으로 기억의 여러 단면을 표현한다. 로크업은 디자인 시스템 정본인 Plus Jakarta Sans 800, 로즈 `m`, 잉크 `emoir` 규격을 쓴다.

## 생성 방식

- 원본: `memoir-symbol.png`, `mascot.png`
- 파생 스크립트: `../../../scripts/build-brand-assets.py`
- 실행: 저장소 루트에서 `python scripts/build-brand-assets.py`
- 파생: 컬러·단색 SVG, 로크업 2종, 16/32/48 PNG, 멀티사이즈 ICO, 512 앱 아이콘, 1600×900 PNG/WebP 히어로

`memoir-symbol.png`는 이미지 생성 모델로 만든 로고 원안을 투명 배경으로 정리한 마스터다. 나머지 로고·파비콘·앱 아이콘은 이 마스터의 같은 알파 윤곽에서 결정론적으로 파생된다. `apple-icon.png`는 이전 앱과의 호환을 위해 남긴 레거시 파일이며 더 이상 생성 원본이 아니다.

히어로는 기존 마스코트와 memoir의 paper·blush·periwinkle 팔레트를 Pillow로 합성한 결정론적 자산이다.
