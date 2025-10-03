import { createResource, type Setter } from 'solid-js';

import { Button } from '@repo/ui';
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

export function TextureOrderGroup() {
  const [assets] = createSelectableTextures();

  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <ClearAllButton setter={setOrderTextures} />
        <AppendAllButton setter={setOrderTextures} />
      </div>
      <AddGroup
        class="flex-wrap"
        itemClass="w-[17.5%]"
        options={assets()}
        value={orderTextures()}
        onValueChange={setOrderTextures}
      />
    </div>
  );
}

export function TextureAnimatedGroup() {
  const [assets] = createSelectableTextures();

  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <ClearAllButton setter={setAnimatedTextures} />
        <AppendAllButton setter={setAnimatedTextures} />
      </div>
      <AddGroup
        class="flex-wrap"
        itemClass="w-[17.5%]"
        options={assets()}
        value={animatedTextures()}
        onValueChange={setAnimatedTextures}
      />
    </div>
  );
}

function ClearAllButton(props: { setter: Setter<string[]> }) {
  function handleClearAll() {
    props.setter([]);
  }
  return (
    <Button
      class="button--error"
      onClick={handleClearAll}
      title="clear all textures"
    >
      Clear All
    </Button>
  );
}

function AppendAllButton(props: { setter: Setter<string[]> }) {
  function handleAppendAll() {
    props.setter((values) => [...values, ...currentSelectableTextures()]);
  }
  return (
    <Button
      onClick={handleAppendAll}
      title="append all textures from spritesheet"
    >
      Append All
    </Button>
  );
}
