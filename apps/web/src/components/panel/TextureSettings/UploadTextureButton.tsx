import { Assets } from 'pixi.js';

import { Button, toast } from '@repo/ui';

import UploadIcon from 'lucide-solid/icons/upload';

import { setRandomTextures } from '@/store/config';
import { appendTextureOptions } from '@/store/textures';
import { setMainTexture } from '@/store/actions';

import {
  loadSpriteSheet,
  assetsMap,
  getNoneDuplicateAlias,
} from '@/pixi/assets';

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
        const alias = getNoneDuplicateAlias(file.name);
        const url = URL.createObjectURL(file);
        await Assets.load({
          alias,
          loadParser: 'loadTextures',
          src: url,
        });
        setMainTexture(alias);
        appendTextureOptions([alias]);
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
      });
      const textures = assetsMap.getSpritesheetTextures(spritesheet);
      appendTextureOptions(textures);
      setMainTexture(textures[0]);
      setRandomTextures(textures);
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
