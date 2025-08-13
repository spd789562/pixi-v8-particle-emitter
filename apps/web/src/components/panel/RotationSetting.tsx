import { Switch, MouseNumberInput } from '@repo/ui';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { InputGroup } from '@/components/InputGroup';

import {
  enabledConfig,
  noRotation,
  rotationConfig,
  setNoRotation,
  setRotationConfig,
} from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

const rotationInputDisabled = () => !enabledConfig.rotation;

export function RotationSetting() {
  return (
    <div class="flex flex-col gap-2">
      <InputGroup title="Start">
        <MinMaxInputGroup
          step={1}
          numberPrecision={0}
          minValue={rotationConfig.minStart}
          maxValue={rotationConfig.maxStart}
          sync={syncConfig.rotation}
          disabled={rotationInputDisabled()}
          setMinValue={(v) => setRotationConfig('minStart', v)}
          setMaxValue={(v) => setRotationConfig('maxStart', v)}
          setSync={(v) => setSyncConfig('rotation', v)}
        />
      </InputGroup>
      <div class="w-1/2">
        <MouseNumberInput
          slideMultiplier={0.1}
          numberPrecision={1}
          label="Acceleration"
          rawValue={rotationConfig.accel}
          onRawValueChange={(v) => setRotationConfig('accel', v)}
        />
      </div>
      <InputGroup title="Speed Limit">
        <div class="flex gap-2">
          <MouseNumberInput
            label="Min"
            rawValue={rotationConfig.minSpeed}
            onRawValueChange={(v) => setRotationConfig('minSpeed', v)}
            disabled={rotationInputDisabled()}
          />
          <MouseNumberInput
            label="Max"
            rawValue={rotationConfig.maxSpeed}
            onRawValueChange={(v) => setRotationConfig('maxSpeed', v)}
            disabled={rotationInputDisabled()}
          />
        </div>
      </InputGroup>
      <Switch
        label="No Particle Rotation"
        checked={noRotation()}
        onChange={(v) => setNoRotation(v)}
      />
    </div>
  );
}
