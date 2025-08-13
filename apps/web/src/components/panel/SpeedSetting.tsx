import { SimpleTabs, Switch } from '@repo/ui';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { ValueInputList } from '@/components/ValueInputList';

import {
  speedConfig,
  setSpeedConfig,
  speedList,
  setSpeedList,
  enabledConfig,
  setEnabledConfig,
  type TransitionType,
} from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

const speedInputDisabled = () => !enabledConfig.speed;

export function SpeedSetting() {
  const tabs = [
    {
      label: 'Static',
      value: 'static',
      content: <StaticSpeedSetting />,
    },
    {
      label: 'List',
      value: 'list',
      content: <ListSpeedSetting />,
    },
  ];

  return (
    <div class="flex flex-col gap-2">
      <SimpleTabs
        tabs={tabs}
        value={enabledConfig.speedType}
        onChange={(v) => setEnabledConfig('speedType', v as TransitionType)}
      />
    </div>
  );
}

function ListSpeedSetting() {
  return (
    <div class="flex flex-col gap-2">
      <Switch
        label="Stepped"
        checked={speedList.isStepped}
        onChange={(v) => setSpeedList('isStepped', v)}
      />
      <ValueInputList data={speedList} onChange={setSpeedList} />
    </div>
  );
}

function StaticSpeedSetting() {
  return (
    <MinMaxInputGroup
      step={1}
      min={0}
      slideMultiplier={1}
      minValue={speedConfig.min}
      maxValue={speedConfig.max}
      sync={syncConfig.speed}
      setMinValue={(v) => setSpeedConfig('min', v)}
      setMaxValue={(v) => setSpeedConfig('max', v)}
      setSync={(v) => setSyncConfig('speed', v)}
      disabled={speedInputDisabled()}
    />
  );
}
