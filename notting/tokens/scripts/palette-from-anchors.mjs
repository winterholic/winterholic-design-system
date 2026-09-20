// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens/src/palette.json 은 이 스크립트 출력으로 갱신한다 — 손으로 hex 를 고치지 않는다.
// 사용: node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
import { buildRamp, contrast } from './ramp.mjs';

// notting 앵커. coolors 후보(Floral White · Black · Vibrant Coral · Verdigris · Soft Periwinkle)를 전부 역할로 나눠 썼다.
// teal 을 500 에 고정한 이유: Verdigris #1EA896 은 흰 배경 대비 2.96:1 로 글자·버튼 배경에 못 쓴다.
// 그래서 500 은 브랜드 원색, 600(#0D8273, 4.71:1)이 액션·포커스, 700(#01685C, 6.70:1)이 브랜드 글자·링크가 된다.
// periwinkle 은 AI·근거(citation) 전용 색이고, coral 은 위험·삭제·손실이다. 둘 다 원색(400)은 장식용이고 글자는 600 이상.
export const ANCHORS = {
  teal:       { hex: '#1EA896', step: 500, name: 'Verdigris',        role: '브랜드 주색·액션·선택·링크' },
  periwinkle: { hex: '#9395D3', step: 400, name: 'Soft Periwinkle',  role: 'AI·근거·Context Pack·검토(review)' },
  coral:      { hex: '#FF715B', step: 400, name: 'Vibrant Coral',    role: '위험·오류·삭제·손실(dropped)' },
  neutral:    { hex: '#8C8984', step: 500, name: 'Warm Stone',       role: '글자·테두리·표면 (따뜻한 회색, hue 80)', stone: true },
  green:      { hex: '#2F9E44', step: 500, name: 'Leaf Green',       role: '성공·무손실(lossless)·diff 추가. teal 과 hue 30° 이상 벌렸다' },
  amber:      { hex: '#E0A100', step: 400, name: 'Marigold',         role: '경고·진행 중(in progress)·검색 하이라이트' },
};

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.stone ? 'stone' : a.neutral ? 'neutral' : 'brand' });
    Object.assign(ramp, a.fixed ?? {});
    out[key] = { $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}${a.fixed ? ' · 고정 단계 ' + Object.keys(a.fixed).join('/') : ''}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = {
        $value: hex,
        $extensions: { 'nt.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } },
      };
    }
  }
  return out;
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify(generatePalette(), null, 2) + '\n');
}
