import { Switch, Match } from 'solid-js';

import { TextureSelect } from './TextureSettings/TextureSelect';
import {
  TextureToggleGroup,
  MultipleTextureToggleGroup,
} from './TextureSettings/TextureToggleGroup';
import {
  TextureOrderGroup,
  TextureAnimatedGroup,
} from './TextureSettings/TextureOrderGroup';
import { PlayingTypeSegmentGroup } from './TextureSettings/PlayingTypeSegmentGroup';
import { UploadTextureButton } from './TextureSettings/UploadTextureButton';

import { texturePlayingType } from '@/store/config';

export function TextureSetting() {
  return (
    <div class="flex flex-col gap-2">
      <h5 class="text-sm font-medium">Texture</h5>
      <div>
        <UploadTextureButton />
      </div>
      <TextureSelect />
      <PlayingTypeSegmentGroup />
      <span class="-mt-0.5 text-xs text-stone-600">
        You must use spritesheet to enabled multiple textures playing.
      </span>
      <Switch>
        <Match when={texturePlayingType() === 'static'}>
          <TextureToggleGroup />
        </Match>
        <Match when={texturePlayingType() === 'random'}>
          <MultipleTextureToggleGroup />
        </Match>
        <Match when={texturePlayingType() === 'ordered'}>
          <TextureOrderGroup />
        </Match>
        <Match when={texturePlayingType() === 'animated'}>
          <TextureAnimatedGroup />
        </Match>
      </Switch>
    </div>
  );
}
