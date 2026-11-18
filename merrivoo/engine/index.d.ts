export type Compat = 'native' | 'allowed' | 'forbidden';
export interface Anchor { x: number; y: number }
export interface TreeMask { cols: number; rows: number; data: string[] }
export interface World {
  id: string; name?: string; version: string; style?: string;
  background: { file: string; width: number; height: number };
  treeAnchor: Anchor; treeWidth: number;
  groundShadow?: { rx: number; ry: number; opacity?: number };
  light?: { color: string }; grade?: { tint: string; blend?: 'multiply' };
  effects?: string[]; theme?: string; tone?: string;
  compat: { trees: Record<string, Compat> };
  environment?: { propId: string; x: number; y: number; w: number; z?: number }[];
  foreground?: { propId: string; x: number; y: number; w: number; z?: number }[];
  license?: string;
}
export interface Tree {
  id: string; name?: string; version: string; file: string; width: number; height: number; aspect: number; heightFrac?: number;
  baseAnchor?: Anchor; topAnchor?: Anchor; mask: TreeMask; tags: string[]; compat: { worlds: Record<string, Compat> }; license?: string;
}
export type OrnamentKind = 'hang' | 'perch' | 'ground' | 'topper';
export interface Ornament {
  id: string; name?: string; version: string; kind: OrnamentKind; tier: 'common' | 'world'; worlds: string[];
  file: string; width: number; height: number; aspect: number; anchor: Anchor; groundAnchor?: Anchor; baseWidth: number;
  placements: ('hang' | 'ground' | 'topper')[]; layer?: 'ornaments'; tags?: string[]; requiresTreeTags?: string[]; excludesTreeTags?: string[]; license?: string;
}
export interface Effect { id: string; name?: string; type: 'image' | 'particles'; file?: string; kind?: 'snow' | 'sparkle'; count?: number; blend?: 'screen' | 'normal'; opacity?: number; layer?: string }
export interface Prop { id: string; file: string; width: number; height: number; aspect: number; anchor?: Anchor; version: string }
export interface Catalog { version: string; assetBase: string; worlds: World[]; trees: Tree[]; ornaments: Ornament[]; effects?: Effect[]; props?: Prop[] }

export interface PlacementItem { id: string; ornament: Ornament; score: number }
export interface Placement { id: string; ornamentId: string; u: number; v: number; w: number; anchor: Anchor; rotate: number; z: number; zone: 'hang' | 'ground' | 'topper'; P: number; score: number; hero: boolean }
export interface Diagnostics { requested: number; placed: number; overflow: number; maxOverlap: number; overlapPairsOver25pct: number; outsideSilhouette: number; worstInsideFraction: number; outOfTreeBox: number; minOrnamentPx: number; minRenderPx: number; pass: boolean }
export interface PlacementResult { placements: Placement[]; overflow: { id: string; ornamentId: string; score: number }[]; densityFactor: number; diagnostics: Diagnostics }
export interface PlacementOptions { treePx?: number; minRenderPx?: number; maxOverlap?: number; relaxedOverlap?: number; minInside?: number; seed?: string; baseWidth?: number; densityStep?: number; gridU?: number }

export interface FixedPlacement { id: string; ornamentId: string; u: number; v: number; w: number; zone: 'hang' | 'ground' | 'topper'; score: number; anchor?: Anchor; rotate?: number; z?: number; hero?: boolean }
export interface PropPlacement { propId: string; x: number; y: number; w: number; z?: number }
export interface SceneState { worldId: string; treeId: string; ornaments?: { id: string; ornamentId: string; score: number }[]; placed?: FixedPlacement[]; background?: { file: string }; environment?: PropPlacement[]; foreground?: PropPlacement[]; effectIds?: string[]; lights?: 'off' | 'soft' | 'full'; seed?: string; treePx?: number; treeScale?: number; treeLift?: number }
export type SceneLayer = {
  key: string; layer: string; z: number; type: 'image' | 'shadow' | 'lights' | 'ornament' | 'particles' | 'grade';
  src?: string; x?: number; y?: number; w?: number; h?: number; blend?: string; opacity?: number;
  cx?: number; cy?: number; rx?: number; ry?: number; color?: string; points?: { x: number; y: number; r: number; phase: number; tone: number }[];
  id?: string; ornamentId?: string; ax?: number; ay?: number; anchor?: Anchor; rotate?: number; hero?: boolean; zone?: 'hang' | 'ground' | 'topper'; score?: number;
  kind?: 'snow' | 'sparkle'; count?: number;
};
export interface ComposedScene {
  size: { w: number; h: number }; worldId: string; treeId: string; compat: Compat; theme: string; layers: SceneLayer[];
  overflow: PlacementResult['overflow']; rejected: { id: string; why: string }[]; densityFactor: number; diagnostics: Diagnostics;
  tree: { x: number; y: number; w: number; h: number; anchorX: number; anchorY: number };
}
export const SCENE_SIZE: { w: number; h: number };
export const LAYER_Z: Record<string, number>;
export const LAYER_ORDER: string[];
export function composeScene(catalog: Catalog, state: SceneState, options?: { treePx?: number }): ComposedScene;
export function treeSize(world: World, tree: Tree, scale?: number): { w: number; h: number };
export function generateLights(tree: Tree, density?: 'off' | 'soft' | 'full', seed?: string): { u: number; v: number; phase: number; tone: number }[];
export function placeOrnaments(tree: Tree, items: PlacementItem[], options?: PlacementOptions): PlacementResult;
export function placeIncremental(tree: Tree, fixed: (FixedPlacement & { ornament: Ornament })[], items: PlacementItem[], options?: PlacementOptions): { placements: Placement[]; overflow: PlacementResult['overflow'] };
export function diagnose(tree: Tree, items: PlacementItem[], result: Pick<PlacementResult, 'placements' | 'overflow'>, options?: PlacementOptions): Diagnostics;
export function prominence(g: unknown, u: number, v: number): number;
export function targetProminence(score: number): number;
export function sizeMultiplier(score: number): number;
export const PLACEMENT_DEFAULTS: Required<PlacementOptions>;
export function treeCompat(world: World, tree: Tree): Compat;
export function ornamentCompat(orn: Ornament, world: World, tree: Tree): { ok: boolean; why?: string };
export function availableTrees(catalog: Catalog, world: World): Tree[];
export function availableOrnaments(catalog: Catalog, world: World, tree: Tree): Ornament[];
export function decodeMask(mask: TreeMask): { cols: number; rows: number; cells: Uint8Array };
export function maskAt(m: { cols: number; rows: number; cells: Uint8Array }, u: number, v: number): boolean;
export function validateCatalog(cat: Catalog, opts?: { fileExists?: (file: string) => boolean }): string[];
export function validateWorld(w: World): string[];
export function validateTree(t: Tree): string[];
export function validateOrnament(o: Ornament): string[];
export function fitScene(vw: number, vh: number, focus?: { x: number; y: number }): { mode: 'cover' | 'stage'; stageW: number; stageH: number; offsetX: number; offsetY: number; sideW: number };
export const SCENE_ASPECT: number;
export const COVER_MAX_ASPECT: number;
export function drawScene(ctx: CanvasRenderingContext2D, scene: ComposedScene, images: Map<string, CanvasImageSource>, opts?: { width?: number; height?: number; time?: number; shadowColor?: string; particleScale?: number }): void;
export function loadImages(srcs: string[]): Promise<Map<string, HTMLImageElement>>;
export function collectImageSrcs(scene: ComposedScene): string[];
export function renderSceneDOM(container: HTMLElement, scene: ComposedScene, opts?: { interactive?: boolean; labelFor?: (l: SceneLayer) => string }): HTMLElement;
export function mulberry32(seed: number): () => number;
export function hashString(s: string): number;
