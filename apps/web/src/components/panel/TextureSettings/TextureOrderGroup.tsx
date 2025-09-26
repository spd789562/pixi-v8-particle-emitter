import { createResource } from 'solid-js';

import { AddGroup } from '@repo/ui';

import { getPixiApp } from '@/store/app';
import { currentSelectableTextures } from '@/store/textures';
import {
  orderTextures,
  setOrderTextures,
  animatedTextures,
  setAnimatedTextures,
} from '@/store/config';
import { assetsMap } from '@/pixi/assets';

function createSelectableTextures() {
  return createResource(
    currentSelectableTextures(),
    (textures) => {
      const renderer = getPixiApp().renderer;

      return Promise.all(
        textures.map(async (texture) => ({
          label: texture,
          value: texture,
          image: await assetsMap.getAvatarFromImage(texture, renderer),
        })),
      );
    },
    {
      initialValue: [],
    },
  );
}

export function TextureOrderGroup() {
  const [assets] = createSelectableTextures();

  return (
    <AddGroup
      class="flex-wrap"
      itemClass="w-[17.5%]"
      options={assets()}
      value={orderTextures()}
      onValueChange={setOrderTextures}
    />
  );
}

export function TextureAnimatedGroup() {
  const [assets] = createSelectableTextures();

  return (
    <AddGroup
      class="flex-wrap"
      itemClass="w-[17.5%]"
      options={assets()}
      value={animatedTextures()}
      onValueChange={setAnimatedTextures}
    />
  );
}
