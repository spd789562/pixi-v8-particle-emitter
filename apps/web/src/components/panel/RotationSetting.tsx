import { Switch, MouseNumberInput } from '@repo/ui';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { InputGroup } from '@/components/InputGroup';
import { TextWithTip } from '@/components/TextWithTip';

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
      <InputGroup
        title={
          <TextWithTip tip="Range of starting rotation of the particles, in degrees. 0 is facing right, 90 is upwards.">
            Start
          </TextWithTip>
        }
      >
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
          label={
            <TextWithTip tip="Constant rotational acceleration of the particles, in degrees/second.">
              Acceleration
            </TextWithTip>
          }
          rawValue={rotationConfig.accel}
          onRawValueChange={(v) => setRotationConfig('accel', v)}
        />
      </div>
      <InputGroup
        title={
          <TextWithTip tip="Range of rotation speed of the particles, in degrees/second. Positive is counter-clockwise.">
            Speed Limit
          </TextWithTip>
        }
      >
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
        label={
          <TextWithTip
            tip="Disable all rotation of the particles."
            icon="question"
          >
            No Particle Rotation
          </TextWithTip>
        }
        checked={noRotation()}
        onChange={(v) => setNoRotation(v)}
      />
    </div>
  );
}
