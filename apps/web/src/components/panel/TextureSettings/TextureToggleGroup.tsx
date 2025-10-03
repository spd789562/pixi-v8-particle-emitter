import { createResource, Suspense } from 'solid-js';

import { ImageToggleGroup } from '@repo/ui';

import { getPixiApp } from '@/store/app';
import { currentSelectableTextures } from '@/store/textures';
import {
  staticTexture,
  setRandomTextures,
  setStaticTexture,
  randomTextures,
} from '@/store/config';
import { assetsMap } from '@/pixi/assets';

function createSelectableTextures() {
  return createResource(
    currentSelectableTextures,
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

export function TextureToggleGroup() {
  const [assets] = createSelectableTextures();

  return (
    <Suspense>
      <ImageToggleGroup
        class="flex-wrap"
        itemClass="w-[17.5%]"
        items={assets()}
        value={staticTexture()}
        onChange={(value) => value && setStaticTexture(value)}
        multiple={false}
      />
    </Suspense>
  );
}

export function MultipleTextureToggleGroup() {
  const [assets] = createSelectableTextures();

  function handleChange(value: string[]) {
    if (value.length === 0) {
      return;
    }
    setRandomTextures(value);
  }

  return (
    <Suspense>
      <ImageToggleGroup
        class="flex-wrap"
        itemClass="w-[17.5%]"
        items={assets()}
        value={randomTextures()}
        onChange={handleChange}
        multiple
      />
    </Suspense>
  );
}
