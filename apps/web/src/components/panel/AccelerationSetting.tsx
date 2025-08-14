import { MouseNumberInput, Switch } from '@repo/ui';
import { InputGroup } from '@/components/InputGroup';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';

import {
  accelerationConfig,
  enabledConfig,
  setAccelerationConfig,
} from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

const accelerationInputDisabled = () => !enabledConfig.acceleration;

export function AccelerationSetting() {
  return (
    <div class="flex flex-col gap-2">
      <InputGroup title="Start Speed">
        <MinMaxInputGroup
          step={1}
          numberPrecision={0}
          minValue={accelerationConfig.minStart}
          maxValue={accelerationConfig.maxStart}
          sync={syncConfig.acceleration}
          disabled={accelerationInputDisabled()}
          setMinValue={(v) => setAccelerationConfig('minStart', v)}
          setMaxValue={(v) => setAccelerationConfig('maxStart', v)}
          setSync={(v) => setSyncConfig('acceleration', v)}
        />
      </InputGroup>

      <InputGroup title="Acceleration">
        <div class="flex gap-2">
          <MouseNumberInput
            label="X"
            rawValue={accelerationConfig.accel.x}
            onRawValueChange={(v) =>
              setAccelerationConfig('accel', {
                ...accelerationConfig.accel,
                x: v,
              })
            }
            slideMultiplier={1}
            numberPrecision={0}
            disabled={accelerationInputDisabled()}
          />
          <MouseNumberInput
            label="Y"
            rawValue={accelerationConfig.accel.y}
            onRawValueChange={(v) =>
              setAccelerationConfig('accel', {
                ...accelerationConfig.accel,
                y: v,
              })
            }
            slideMultiplier={1}
            numberPrecision={0}
            disabled={accelerationInputDisabled()}
          />
        </div>
      </InputGroup>

      <div class="w-3/5">
        <MouseNumberInput
          label="Max Speed"
          rawValue={accelerationConfig.maxSpeed}
          onRawValueChange={(v) => setAccelerationConfig('maxSpeed', v)}
          disabled={accelerationInputDisabled()}
        />
      </div>

      <Switch
        label="Rotate with movement"
        checked={accelerationConfig.rotate}
        onChange={(v) => setAccelerationConfig('rotate', v)}
        disabled={accelerationInputDisabled()}
      />
    </div>
  );
}
