import {
  ColorPickerField,
  MouseNumberInput,
  Switch,
  Button,
  toast,
} from '@repo/ui';
import { Assets } from 'pixi.js';

import { TextWithTip } from '@/components/TextWithTip';

import {
  stageConfig,
  setStageConfig,
  setStageBackgroundColor,
  setStageFollowMouse,
} from '@/store/stage';

export function StageSetting() {
  return (
    <div class="flex flex-col gap-2">
      <div class="w-3/5">
        <ColorPickerField
          label="Background Color"
          value={stageConfig.backgroundColor}
          onChange={(value) => setStageBackgroundColor(value.toString('hex'))}
        />
      </div>
      <h5 class="text-sm font-bold">Background Image</h5>
      <div class="flex flex-row gap-2">
        <UploadBackgroundImage />
        <Button
          class="button--outline"
          onClick={() => setStageConfig('backgroundImage', '')}
        >
          Remove
        </Button>
      </div>
      <div class="w-3/5 flex flex-col gap-2">
        <MouseNumberInput
          label="Background Image Scale"
          rawValue={stageConfig.backgroundImageScale}
          onRawValueChange={(value) =>
            setStageConfig('backgroundImageScale', value)
          }
          minValue={0}
          maxValue={1}
          step={0.01}
          numberPrecision={2}
        />
        <MouseNumberInput
          label="Background Image Alpha"
          rawValue={stageConfig.backgroundImageAlpha}
          onRawValueChange={(value) =>
            setStageConfig('backgroundImageAlpha', value)
          }
          minValue={0}
          maxValue={1}
          step={0.01}
          numberPrecision={2}
        />
      </div>
      <Switch
        label={
          <TextWithTip tip="Particles origin will follow the mouse position.">
            Follow Mouse
          </TextWithTip>
        }
        checked={stageConfig.followMouse}
        onChange={(value) => setStageFollowMouse(value)}
      />
    </div>
  );
}

function UploadBackgroundImage() {
  async function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      try {
        await Assets.load({
          loadParser: 'loadTextures',
          src: url,
        });
        setStageConfig('backgroundImage', url);
      } catch (error) {
        toast.error({
          title: 'Failed to load image',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
  return (
    <>
      <input
        id="bg-image-input"
        class="hidden opacity-0"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button asChild="label" for="bg-image-input">
        Upload
      </Button>
    </>
  );
}
