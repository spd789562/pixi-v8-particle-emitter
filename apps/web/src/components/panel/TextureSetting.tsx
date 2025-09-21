import { createMemo } from 'solid-js';
import { Assets } from 'pixi.js';

import { Button, SegmentedControl, toast } from '@repo/ui';

import UploadIcon from 'lucide-solid/icons/upload';

import {
  texturePlayingType,
  usedTextures,
  setTexturePlayingType,
  setUsedTextures,
} from '@/store/config';
import { loadSpriteSheet } from '@/pixi/assets';

export function TextureSetting() {
  const disabledItems = createMemo(() => {
    if (usedTextures().length === 1) {
      return ['Ordered', 'Random', 'Animated'];
    } else {
      return [];
    }
  });

  return (
    <div class="flex flex-col gap-2">
      <h5 class="text-sm font-medium">Texture</h5>
      <div>
        <UploadTextureButton />
      </div>
      <SegmentedControl
        class="w-full mt-2"
        value={texturePlayingType()}
        onChange={setTexturePlayingType}
        label="Playing Type"
        items={['Static', 'Ordered', 'Random', 'Animated']}
        disabledItems={disabledItems()}
      />
      <span class="-mt-0.5 text-xs text-stone-600">
        You must use spritesheet to enabled multiple textures playing.
      </span>
    </div>
  );
}

export function UploadTextureButton() {
  let inputRef!: HTMLInputElement;

  async function handleUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    const filesArray = [...files];
    const jsonIndex = filesArray.findIndex((f) => f.name.includes('.json'));
    if (filesArray.length > 1 && jsonIndex === -1) {
      toast.error({
        title: 'Too many files',
        message:
          'Please either upload  a single image or upload a spritesheet json and a image.',
      });
      return;
    }
    if (filesArray.length === 1) {
      const file = filesArray[0];
      try {
        const url = URL.createObjectURL(file);
        await Assets.load({
          alias: file.name,
          loadParser: 'loadTextures',
          src: url,
        });
        setUsedTextures([file.name]);
        // URL.revokeObjectURL(url);
      } catch (error) {
        toast.error({
          title: 'Failed to load texture',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      return;
    }
    // load spritesheet
    const imageIndex = jsonIndex === 0 ? 1 : 0;
    const imageUrl = URL.createObjectURL(filesArray[imageIndex]);
    const jsonUrl = URL.createObjectURL(filesArray[jsonIndex]);

    try {
      const alias = filesArray[jsonIndex].name.replace('.json', '');
      const spritesheet = await loadSpriteSheet({
        alias,
        jsonUrl,
        imageUrl,
        skipAlias: true,
      });
      setUsedTextures(Object.keys(spritesheet.textures));
    } catch (error) {
      toast.error({
        title: 'Failed to load spritesheet',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  }

  return (
    <Button asChild="label" for="texture-upload" class="gap-2">
      <input
        ref={inputRef}
        id="texture-upload"
        type="file"
        accept="image/*,.json"
        onChange={handleUpload}
        multiple
      />
      <UploadIcon size="16" />
      Upload Image/Spritesheet
    </Button>
  );
}
