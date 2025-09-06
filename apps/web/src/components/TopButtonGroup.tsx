import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItemList,
  toast,
} from '@repo/ui';
import UploadIcon from 'lucide-solid/icons/upload';
import DownloadIcon from 'lucide-solid/icons/download';
import CopyIcon from 'lucide-solid/icons/copy';

import { fullConfig, usedTextures } from '@/store/config';

import { configToStore } from '@/utils/configToStore';
import { exampleConfigs } from '@/pixi/exampleConfigs';
import { batch } from 'solid-js';
import { isSameSource, parseTextures } from '@/utils/texture';

function getFullConfigJson() {
  return JSON.stringify(fullConfig(), null, 2);
}

export function TopButtonGroup() {
  function handleCopy() {
    navigator.clipboard.writeText(getFullConfigJson());
    toast.success({ title: 'Copied to clipboard' });
  }

  function handleDownload() {
    const blob = new Blob([getFullConfigJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
  }

  return (
    <div class="flex flex-row gap-2">
      <UploadConfigButton />
      <SelectPresetButton />
      <Button
        class="button--outline"
        title="Copy to clipboard"
        onClick={handleCopy}
      >
        <CopyIcon size="16" />
      </Button>
      <Button
        class="button--outline"
        title="Download Config"
        onClick={handleDownload}
      >
        <DownloadIcon size="16" />
      </Button>
    </div>
  );
}

export function UploadConfigButton() {
  function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const config = JSON.parse(e.target?.result as string);
        configToStore(config);
        // check the textures nextTick since the configStore is batched.
        setTimeout(() => {
          const currentTextures = usedTextures();
          if (!isSameSource(parseTextures(currentTextures))) {
            toast.error({
              title: 'Texture Error',
              message:
                'Please ensure all textures are loaded, if you using multiple textures, ensure upload via spritesheet.',
            });
          }
        }, 32);
      };
      reader.readAsText(file);
    }
  }

  return (
    <Button
      asChild="label"
      class="button--outline gap-1"
      title="Upload ExistingConfig"
    >
      <input type="file" accept=".json" onChange={handleUpload} />
      <UploadIcon size="16" />
      Upload
    </Button>
  );
}

// not need to use Set since it's quite small
const excludedExamples = ['bubbleStreamPath', 'snowSvgEase', 'animatedBubbles'];

export function SelectPresetButton() {
  const presetNames = Object.keys(exampleConfigs).filter(
    (name) => !excludedExamples.includes(name),
  ) as (keyof typeof exampleConfigs)[];

  function handleSelectPreset(preset: keyof typeof exampleConfigs) {
    const targetConfig = exampleConfigs[preset];
    batch(() => {
      configToStore(targetConfig.config, targetConfig.textures);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger class="button--outline" title="Select Preset">
        Presets
      </DropdownMenuTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="dropdown-menu__content">
          <DropdownMenu.Arrow />
          <DropdownMenuItemList
            items={presetNames}
            onSelectItem={handleSelectPreset}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
