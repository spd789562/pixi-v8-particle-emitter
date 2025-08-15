import { Button, toast } from '@repo/ui';

import { UploadIcon, DownloadIcon, CopyIcon } from 'lucide-solid';

import { fullConfig } from '@/store/config';

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
      <Button class="button--outline gap-1" disabled>
        <UploadIcon size="16" />
        Upload
      </Button>
      <Button class="button--outline" disabled>
        Select Presets
      </Button>
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
