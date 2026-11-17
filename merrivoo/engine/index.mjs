export { SCENE_SIZE, LAYER_Z, LAYER_ORDER, composeScene, generateLights, treeSize } from './scene.mjs';
export { placeOrnaments, diagnose, prominence, targetProminence, sizeMultiplier, footprint, PLACEMENT_DEFAULTS } from './placement.mjs';
export { treeCompat, ornamentCompat, availableTrees, availableOrnaments } from './compat.mjs';
export { decodeMask, maskAt, rowSpans, insideFraction } from './mask.mjs';
export { validateCatalog, validateWorld, validateTree, validateOrnament } from './validate.mjs';
export { fitScene, SCENE_ASPECT, COVER_MAX_ASPECT } from './fit.mjs';
export { drawScene, loadImages, collectImageSrcs } from './canvas.mjs';
export { renderSceneDOM } from './dom.mjs';
export { mulberry32, hashString } from './prng.mjs';
