import { Color } from 'pixi.js';

export function getInverseTextColor(color: string) {
  const sharedColor = Color.shared.setValue(color);
  const [r, g, b] = sharedColor.toArray();
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const mid = (max + min) / 2;
  return sharedColor.setValue([1 - mid, 1 - mid, 1 - mid]);
}
