import { SimpleTabs, Switch } from '@repo/ui';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { ValueInputList } from '@/components/ValueInputList';

import {
  scaleConfig,
  setScaleConfig,
  scaleList,
  setScaleList,
  enabledConfig,
  setEnabledConfig,
  type TransitionType,
} from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

const scaleInputDisabled = () => !enabledConfig.scale;

export function ScaleSetting() {
  const tabs = [
    {
      label: 'Static',
      value: 'static',
      content: <StaticScaleSetting />,
    },
    {
      label: 'List',
      value: 'list',
      content: <ListScaleSetting />,
    },
  ];

  return (
    <div class="flex flex-col gap-2">
      <SimpleTabs
        tabs={tabs}
        value={enabledConfig.scaleType}
        onChange={(v) => setEnabledConfig('scaleType', v as TransitionType)}
      />
    </div>
  );
}

function ListScaleSetting() {
  return (
    <div class="flex flex-col gap-2">
      <Switch
        label="Stepped"
        checked={scaleList.isStepped}
        onChange={(v) => setScaleList('isStepped', v)}
      />
      <ValueInputList
        data={scaleList}
        onChange={setScaleList}
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

function StaticScaleSetting() {
  return (
    <MinMaxInputGroup
      step={0.01}
      min={0.01}
      slideMultiplier={0.01}
      numberPrecision={2}
      minValue={scaleConfig.min}
      maxValue={scaleConfig.max}
      sync={syncConfig.scale}
      setMinValue={(v) => setScaleConfig('min', v)}
      setMaxValue={(v) => setScaleConfig('max', v)}
      setSync={(v) => setSyncConfig('scale', v)}
      disabled={scaleInputDisabled()}
    />
  );
}
