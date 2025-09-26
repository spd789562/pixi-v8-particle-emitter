import { createMemo } from 'solid-js';

import { SegmentedControl } from '@repo/ui';

import { currentSelectableTextures } from '@/store/textures';
import {
  texturePlayingType,
  setTexturePlayingType,
  setUsedTextures,
  type TexturePlayingType,
} from '@/store/config';

export function PlayingTypeSegmentGroup() {
  const disabledItems = createMemo(() => {
    if (currentSelectableTextures().length === 1) {
      return ['Ordered', 'Random', 'Animated'];
    } else {
      return [];
    }
  });

  function handleChange(value: string) {
    const v = value as TexturePlayingType;
    setTexturePlayingType(v);
    if (v === 'static') {
      setUsedTextures((textures) => [textures[0]]);
    }
  }

  return (
    <SegmentedControl
      class="w-full mt-2"
      value={texturePlayingType()}
      onChange={handleChange}
      label="Playing Type"
      items={['Static', 'Random', 'Ordered', 'Animated']}
      disabledItems={disabledItems()}
    />
  );
}
