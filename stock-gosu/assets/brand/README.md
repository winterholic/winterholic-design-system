# stock-gosu 브랜드 자산

정본은 기존 PWA 원본 `stock-gosu.png`(1024×1024 투명 PNG)다. 기존 `stock-gosu.svg`는 자동 트레이스된 검정 path와 레거시 DOCTYPE 때문에 브라우저 파비콘으로 쓰지 않고, 이 원본에서 다시 파생한다.

## 생성 방식

- 원본: `stock-gosu.png`
- 파생 스크립트: `../../../scripts/build-brand-assets.py`
- 실행: 저장소 루트에서 `python scripts/build-brand-assets.py`
- 파생: 컬러·단색 SVG, 로크업 2종, 16/32/48 PNG, 멀티사이즈 ICO, 512 앱 아이콘, 1600×900 PNG/WebP 히어로
- 단색 SVG는 원본 파랑새 알파 윤곽을 그대로 쓰며 외부 이미지에서는 브랜드 블루, 인라인에서는 `currentColor`로 표시한다.

히어로는 생성형 이미지가 아니라 원본 파랑새와 stock-gosu의 파랑·차트 모티프를 Pillow로 합성한 결정론적 자산이다.
