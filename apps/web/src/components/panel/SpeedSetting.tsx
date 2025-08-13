import { MouseNumberInput, Switch } from '@repo/ui';

import { setSpeedConfig, speedConfig, enabledConfig } from '@/store/config';
import { syncConfig, setSyncConfig } from '@/store/input';

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
  function handleMinChange(value: number) {
    setSpeedConfig('min', value);
    if (syncConfig.speed) {
      setSpeedConfig('max', value);
    }
  }
  function handleMaxChange(value: number) {
    setSpeedConfig('max', value);
    if (syncConfig.speed) {
      setSpeedConfig('min', value);
    }
  }
  function handleSyncChange(checked: boolean) {
    setSyncConfig('speed', checked);
  }
  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <MouseNumberInput
          label="Min"
          rawValue={speedConfig.min}
          onRawValueChange={handleMinChange}
          step={1}
          minValue={0}
          slideMultiplier={1}
          numberPrecision={3}
          disabled={speedInputDisabled()}
        />
        <span class="pt-5">~</span>
        <MouseNumberInput
          label="Max"
          rawValue={speedConfig.max}
          onRawValueChange={handleMaxChange}
          step={1}
          minValue={0}
          slideMultiplier={1}
          numberPrecision={3}
          disabled={speedInputDisabled()}
        />
      </div>

      <Switch
        label="sync min & max"
        checked={syncConfig.speed}
        onChange={handleSyncChange}
        disabled={speedInputDisabled()}
      />
    </div>
  );
}
