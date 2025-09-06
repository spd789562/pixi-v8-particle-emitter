import { InfoIconTooltip, MouseNumberInput, Switch } from '@repo/ui';
import { InputGroup } from '@/components/InputGroup';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { TextWithTip } from '@/components/TextWithTip';

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
      <InputGroup
        title={
          <TextWithTip tip="Speed range when initializing the particle.">
            Start Speed
          </TextWithTip>
        }
      >
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

      <InputGroup
        title={
          <TextWithTip tip="Constant acceleration, in the coordinate space of the particle parent.">
            Acceleration
          </TextWithTip>
        }
      >
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
          label={
            <TextWithTip tip="Maximum linear speed. 0 is unlimited.">
              Max Speed
            </TextWithTip>
          }
          rawValue={accelerationConfig.maxSpeed}
          onRawValueChange={(v) => setAccelerationConfig('maxSpeed', v)}
          disabled={accelerationInputDisabled()}
        />
      </div>

      <Switch
        label={
          <TextWithTip tip="Rotate the particle with its direction of movement. While initial movement direction reacts to rotation settings, this overrides any dynamic rotation.">
            Rotate with movement
          </TextWithTip>
        }
        checked={accelerationConfig.rotate}
        onChange={(v) => setAccelerationConfig('rotate', v)}
        disabled={accelerationInputDisabled()}
      />
    </div>
  );
}
