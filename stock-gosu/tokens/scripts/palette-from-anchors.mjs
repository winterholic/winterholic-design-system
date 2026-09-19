// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens.json 의 color.<ramp> 블록은 이 스크립트 출력으로 갱신한다 — 손으로 hex 를 고치지 않는다.
// 사용: node palette-from-anchors.mjs > ../generated-palette.json
import { buildRamp, contrast } from './ramp.mjs';

// step: 앵커를 고정할 단계. fixed: 기존 global.css 에서 이미 쓰이던 손조정 값 — 화면 호환을 위해 그대로 둔다.
// 새로 생성한 단계(950, red/green/yellow 의 중간 단계 등)만 OKLCH 값이다.
// blue-600 은 기존 #2272EB(흰 글자 4.49:1, AA 0.01 미달)를 #216FE8(4.53:1)로 아주 조금 내렸다 — 액션 배경용.
// green/yellow 는 기존 500/600 값이 실제 밝기로는 400/500, 300/400 자리라 그 단계로 옮겼다(legacy-aliases.css 가 옛 이름을 이어 준다).
// red-600 도 같은 이유로 #E42939(4.49) → #E0263A(4.62). 등락 글자색이 AA 를 넘도록.
export const ANCHORS = {
  blue: { hex: '#3182F6', step: 500, name: 'Toss Blue', role: '브랜드·액션·하락', fixed: {
    50: '#E8F3FF', 100: '#C9E2FF', 200: '#90C2FF', 300: '#64A8FF', 400: '#4593FC', 500: '#3182F6', 600: '#216FE8', 700: '#1B64DA', 800: '#1957C2', 900: '#194AA6' } },
  gray: { hex: '#8B95A1', step: 500, name: 'Toss Gray', role: '텍스트·면·테두리', neutral: true, fixed: {
    50: '#F9FAFB', 100: '#F2F4F6', 200: '#E5E8EB', 300: '#D1D6DB', 400: '#B0B8C1', 500: '#8B95A1', 600: '#6B7684', 700: '#4E5968', 800: '#333D4B', 900: '#191F28', 950: '#111418' } },
  red:    { hex: '#F04452', step: 500, name: 'Rise Red',     role: '상승(한국 관례)·오류', fixed: { 50: '#FFEEEE', 500: '#F04452', 600: '#E0263A' } },
  green:  { hex: '#15C39A', step: 400, name: 'Mint Green',   role: '성공·긍정 신호', fixed: { 50: '#E7F8F3', 400: '#15C39A', 500: '#03B488' } },
  yellow: { hex: '#FFB200', step: 300, name: 'Signal Amber', role: '경고·주의 신호', fixed: { 50: '#FFF7E6', 300: '#FFB200', 400: '#F59B00' } },
  orange: { hex: '#EB6834', step: 500, name: 'Series Orange', role: '차트 2' },
  violet: { hex: '#4A3AA7', step: 700, name: 'Series Violet', role: '차트 7' },
  magenta:{ hex: '#E87BA4', step: 400, name: 'Series Magenta', role: '차트 5' },
};

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.neutral ? 'neutral' : 'brand' });
    // fixed: 이미 제품에서 쓰이는 손조정 값이 있으면 그 단계만 생성값 대신 고정한다(기존 화면과의 호환).
    Object.assign(ramp, a.fixed ?? {});
    out[key] = { $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}${a.fixed ? ' · 고정 단계 ' + Object.keys(a.fixed).join('/') : ''}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = {
        $value: hex,
        $extensions: { 'sg.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } },
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
