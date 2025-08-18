import { Assets, type Texture } from 'pixi.js';

export function parseTextures(
  textures: Texture[] | string[] | (Texture | string)[] | string | Texture,
): Texture[] {
  const images = (Array.isArray(textures) ? textures : [textures]).map((v) => {
    if (typeof v === 'string') {
      return Assets.get(v) as Texture;
    }
    return v;
  });

  return images;
}

export function isSameSource(textures: Texture[]) {
  return textures.every(
    (texture) => texture && texture.source === textures[0].source,
  );
}
