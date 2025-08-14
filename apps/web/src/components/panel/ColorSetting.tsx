import { SimpleTabs, Switch, ColorPickerBlock } from '@repo/ui';
import { ValueInputList } from '@/components/ValueInputList';

import {
  colorConfig,
  setColorConfig,
  colorList,
  setColorList,
  enabledConfig,
  setEnabledConfig,
  type TransitionType,
} from '@/store/config';

const colorInputDisabled = () => !enabledConfig.color;

export function ColorSetting() {
  const tabs = [
    {
      label: 'Static',
      value: 'static',
      content: <StaticColorSetting />,
    },
    {
      label: 'List',
      value: 'list',
      content: <ListColorSetting />,
    },
  ];

  return (
    <div class="flex flex-col gap-2">
      <SimpleTabs
        tabs={tabs}
        value={enabledConfig.colorType}
        onChange={(v) => setEnabledConfig('colorType', v as TransitionType)}
      />
    </div>
  );
}

function ListColorSetting() {
  return (
    <div class="flex flex-col gap-2">
      <Switch
        label="Stepped"
        checked={colorList.isStepped}
        onChange={(v) => setColorList('isStepped', v)}
      />
      <ValueInputList data={colorList} onChange={setColorList} type="color" />
    </div>
  );
}

function StaticColorSetting() {
  return (
    <div class="w-32 h-8">
      <ColorPickerBlock
        value={colorConfig.color}
        onChange={(c) => setColorConfig('color', c.toString('hex'))}
        disabled={colorInputDisabled()}
      />
    </div>
  );
}
