import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';

import { setSpeedConfig, speedConfig, enabledConfig } from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

const speedInputDisabled = () => !enabledConfig.speed;

export function SpeedSetting() {
  return (
    <div class="flex flex-col gap-2">
      {/* TODO: Add Tab */}
      <StaticSpeedSetting />
    </div>
  );
}

function StaticSpeedSetting() {
  return (
    <MinMaxInputGroup
      step={1}
      min={0}
      slideMultiplier={1}
      numberPrecision={3}
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
