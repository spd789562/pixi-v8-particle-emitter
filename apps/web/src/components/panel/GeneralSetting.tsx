import { produce } from 'solid-js/store';

import { MouseNumberInput, Switch } from '@repo/ui';
import { InputGroup } from '@/components/InputGroup';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { TextWithTip } from '@/components/TextWithTip';

import { generalConfig, setGeneralConfig } from '@/store/config';
import { syncConfig, setSyncConfig } from '@/store/input';

export function GeneralSetting() {
  const handleFrequencyChange = (value: number) => {
    setGeneralConfig('frequency', value);
  };
  const handleEmitterLifetimeChange = (value: number) => {
    setGeneralConfig('emitterLifetime', value);
  };
  const handleMaxParticlesChange = (value: number) => {
    setGeneralConfig('maxParticles', value);
  };
  const handleParticlesPerWaveChange = (value: number) => {
    setGeneralConfig('particlesPerWave', value);
  };
  const handleSpawnChanceChange = (value: number) => {
    setGeneralConfig('spawnChance', value);
  };
  const handleSyncLifetimeChange = (checked: boolean) => {
    setSyncConfig('lifetime', checked);
  };
  const handleMinLifetimeChange = (value: number) => {
    setGeneralConfig(
      produce((draft) => {
        draft.lifetime.min = value;
      }),
    );
  };
  const handleMaxLifetimeChange = (value: number) => {
    setGeneralConfig(
      produce((draft) => {
        draft.lifetime.max = value;
      }),
    );
  };
  const handleAddAtBackChange = (checked: boolean) => {
    setGeneralConfig('addAtBack', checked);
  };
  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2 w-3/5">
        <MouseNumberInput
          label={
            <TextWithTip tip="Seconds between each particle being spawned.">
              Spawn Frequency
            </TextWithTip>
          }
          rawValue={generalConfig.frequency}
          onRawValueChange={handleFrequencyChange}
          step={0.01}
          minValue={0.001}
          slideMultiplier={0.01}
          numberPrecision={3}
        />
        <MouseNumberInput
          label={
            <TextWithTip tip="Lifetime of the emitter in seconds before it disables itself. Values of 0 or -1 are infinite">
              Emitter Lifetime
            </TextWithTip>
          }
          rawValue={generalConfig.emitterLifetime}
          onRawValueChange={handleEmitterLifetimeChange}
          step={0.01}
          minValue={-1}
          slideMultiplier={0.01}
          numberPrecision={3}
        />
        <MouseNumberInput
          label={
            <TextWithTip tip="Maximum number of particles that can exist at once.">
              Max Particles
            </TextWithTip>
          }
          rawValue={generalConfig.maxParticles}
          onRawValueChange={handleMaxParticlesChange}
          step={1}
          minValue={1}
          maxValue={100000}
        />
        <MouseNumberInput
          label={
            <TextWithTip tip="Number of particles to spawn in each wave.">
              Particles Per Wave
            </TextWithTip>
          }
          rawValue={generalConfig.particlesPerWave}
          onRawValueChange={handleParticlesPerWaveChange}
          step={1}
          minValue={1}
          numberPrecision={1}
        />
        <MouseNumberInput
          label={
            <TextWithTip tip="Chance of a particle being spawned. Values lower than 1 mean particles may not be spawned each time.">
              Particles Spawn Chance
            </TextWithTip>
          }
          rawValue={generalConfig.spawnChance}
          onRawValueChange={handleSpawnChanceChange}
          step={0.01}
          minValue={0}
          maxValue={1}
          numberPrecision={2}
        />
      </div>
      <InputGroup
        title={
          <TextWithTip tip="Lifetime range of each particle in seconds.">
            Particle Lifetime
          </TextWithTip>
        }
      >
        <MinMaxInputGroup
          step={0.01}
          min={0.01}
          slideMultiplier={0.01}
          numberPrecision={3}
          minValue={generalConfig.lifetime.min}
          maxValue={generalConfig.lifetime.max}
          sync={syncConfig.lifetime}
          setMinValue={handleMinLifetimeChange}
          setMaxValue={handleMaxLifetimeChange}
          setSync={handleSyncLifetimeChange}
        />
      </InputGroup>
      <div>
        <h5 class="text-sm font-medium mb-1">
          <TextWithTip tip="If particles should be added to the back of the display list instead of the top.">
            Add At Back
          </TextWithTip>
        </h5>
        <Switch
          checked={generalConfig.addAtBack}
          onChange={handleAddAtBackChange}
        />
      </div>
    </div>
  );
}
