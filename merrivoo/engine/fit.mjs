// 뷰포트에 9:16 장면을 맞추는 규칙. 휴대폰은 꽉 채우고(cover), 넓은 화면은 가운데 무대(stage)로 두고 양옆을 채운다.
export const SCENE_ASPECT = 9 / 16;
export const COVER_MAX_ASPECT = 0.62; // 이보다 넓으면 stage

/** @returns {{mode:'cover'|'stage', stageW:number, stageH:number, offsetX:number, offsetY:number, sideW:number}} px */
export function fitScene(vw, vh, focus = { x: 0.5, y: 0.55 }) {
  const r = vw / vh;
  if (r > COVER_MAX_ASPECT) {
    const stageH = vh, stageW = vh * SCENE_ASPECT;
    return { mode: 'stage', stageW, stageH, offsetX: (vw - stageW) / 2, offsetY: 0, sideW: (vw - stageW) / 2 };
  }
  const scale = Math.max(vw / SCENE_ASPECT, vh); // stageH 후보
  const stageH = scale, stageW = scale * SCENE_ASPECT;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  return {
    mode: 'cover', stageW, stageH,
    offsetX: clamp(vw / 2 - focus.x * stageW, vw - stageW, 0),
    offsetY: clamp(vh / 2 - focus.y * stageH, vh - stageH, 0),
    sideW: 0,
  };
}
