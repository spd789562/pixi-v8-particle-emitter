import { createSignal } from 'solid-js';

export const [selectedTexture, setSelectedTexture] = createSignal<
  string | null
>(null);

export const [textureOptions, setTextureOptions] = createSignal<string[]>([]);

export const [currentSelectableTextures, setCurrentSelectableTextures] =
  createSignal<string[]>([]);

export function appendTextureOptions(textures: string[]) {
  setTextureOptions((prev) => [...prev, ...textures]);
}
