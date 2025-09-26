import { SimpleSelect } from '@repo/ui';
import { batch } from 'solid-js';

import {
  setSelectedTexture,
  selectedTexture,
  textureOptions,
  setCurrentSelectableTextures,
} from '@/store/textures';
import { setUsedTextures } from '@/store/config';

import { assetsMap } from '@/pixi/assets';

export function TextureSelect() {
  function handleSelect(data: string | null) {
    if (!data) return;
    const value = data;
    batch(() => {
      setSelectedTexture(value);
      if (assetsMap.isTextureIsSpritesheet(value)) {
        setCurrentSelectableTextures(assetsMap.getTexturesFromImage(value));
      } else {
        setCurrentSelectableTextures([value]);
      }
      setUsedTextures([value]);
    });
  }

  return (
    <SimpleSelect
      options={textureOptions()}
      value={selectedTexture()}
      placeholder="Select Texture"
      onChange={handleSelect}
    />
  );
}
