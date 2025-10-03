import { batch } from 'solid-js';

import {
  setSelectedTexture,
  selectedTexture,
  setCurrentSelectableTextures,
} from '@/store/textures';
import {
  setStaticTexture,
  setRandomTextures,
  setOrderTextures,
  setAnimatedTextures,
  setTexturePlayingType,
} from '@/store/config';

import { assetsMap } from '@/pixi/assets';

export function setMainTexture(texture: string) {
  const currentSelection = selectedTexture();

  batch(() => {
    setSelectedTexture(texture);

    if (assetsMap.isTextureIsSpritesheet(texture)) {
      setCurrentSelectableTextures(assetsMap.getTexturesFromImage(texture));
    } else {
      setCurrentSelectableTextures([texture]);
    }

    const isSameGroup =
      currentSelection && assetsMap.isSameGroup(currentSelection, texture);

    // since if they not same texture, they would not able to play the same spritesheet
    if (!isSameGroup) {
      setOrderTextures([]);
      setAnimatedTextures([]);
      setRandomTextures([texture]);
    }

    setStaticTexture(texture);

    if (!assetsMap.isTextureIsSpritesheet(texture)) {
      setTexturePlayingType('static');
    }
  });
}
