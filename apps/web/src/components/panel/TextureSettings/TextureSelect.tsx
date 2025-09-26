import { SimpleSelect } from '@repo/ui';
import { batch } from 'solid-js';

import {
  setSelectedTexture,
  selectedTexture,
  textureOptions,
  setCurrentSelectableTextures,
} from '@/store/textures';
import {
  setUsedTextures,
  setOrderTextures,
  setAnimatedTextures,
  setTexturePlayingType,
} from '@/store/config';

import { assetsMap } from '@/pixi/assets';

export function TextureSelect() {
  function handleSelect(data: string | null) {
    if (!data) return;
    const value = data;
    const currentSelection = selectedTexture();

    batch(() => {
      setSelectedTexture(value);

      if (assetsMap.isTextureIsSpritesheet(value)) {
        setCurrentSelectableTextures(assetsMap.getTexturesFromImage(value));
      } else {
        setCurrentSelectableTextures([value]);
      }
      setUsedTextures([value]);

      const isSameGroup =
        currentSelection && assetsMap.isSameGroup(currentSelection, value);

      // since if they not same texture, they would not able to play the same spritesheet
      if (!isSameGroup) {
        setOrderTextures([]);
        setAnimatedTextures([]);
      }

      if (!assetsMap.isTextureIsSpritesheet(value)) {
        setTexturePlayingType('static');
      }
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
