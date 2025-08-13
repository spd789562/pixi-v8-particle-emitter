import { SimpleTabs, Switch, MouseNumberInput } from '@repo/ui';
import { ValueInputList } from '@/components/ValueInputList';

import {
  alphaConfig,
  setAlphaConfig,
  alphaList,
  setAlphaList,
  enabledConfig,
  setEnabledConfig,
  type TransitionType,
} from '@/store/config';

const alphaInputDisabled = () => !enabledConfig.alpha;

export function AlphaSetting() {
  const tabs = [
    {
      label: 'Static',
      value: 'static',
      content: <StaticAlphaSetting />,
    },
    {
      label: 'List',
      value: 'list',
      content: <ListAlphaSetting />,
    },
  ];

  return (
    <div class="flex flex-col gap-2">
      <SimpleTabs
        tabs={tabs}
        value={enabledConfig.alphaType}
        onChange={(v) => setEnabledConfig('alphaType', v as TransitionType)}
      />
    </div>
  );
}

function ListAlphaSetting() {
  return (
    <div class="flex flex-col gap-2">
      <Switch
        label="Stepped"
        checked={alphaList.isStepped}
        onChange={(v) => setAlphaList('isStepped', v)}
      />
      <ValueInputList
        data={alphaList}
        onChange={setAlphaList}
        valueInputProps={{
          step: 0.01,
          minValue: 0.01,
          slideMultiplier: 0.01,
          numberPrecision: 2,
        }}
      />
    </div>
  );
}

function StaticAlphaSetting() {
  return (
    <div class="w-1/2">
      <MouseNumberInput
        label="Alpha"
        step={0.01}
        minValue={0}
        maxValue={1}
        slideMultiplier={0.01}
        numberPrecision={2}
        rawValue={alphaConfig.alpha}
        onRawValueChange={(v) => setAlphaConfig('alpha', v)}
        disabled={alphaInputDisabled()}
      />
    </div>
  );
}
