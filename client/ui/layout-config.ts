export const DEFAULT_BOX_WIDTH = 88;
export const MIN_BOX_WIDTH = 64;
export const MAX_BOX_WIDTH = 110;

export function clampWidth(width: number) {
  return Math.max(MIN_BOX_WIDTH, Math.min(MAX_BOX_WIDTH, width));
}
