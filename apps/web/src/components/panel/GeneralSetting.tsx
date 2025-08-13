import { produce } from 'solid-js/store';

import { MouseNumberInput, Switch } from '@repo/ui';
import { InputGroup } from '@/components/InputGroup';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';

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
          label="Spawn Frequency"
          rawValue={generalConfig.frequency}
          onRawValueChange={handleFrequencyChange}
          step={0.01}
          minValue={0.001}
          slideMultiplier={0.01}
          numberPrecision={3}
        />
        <MouseNumberInput
          label="Emitter Lifetime"
          rawValue={generalConfig.emitterLifetime}
          onRawValueChange={handleEmitterLifetimeChange}
          step={0.01}
          minValue={-1}
          slideMultiplier={0.01}
          numberPrecision={3}
        />
        <MouseNumberInput
          label="Max Particles"
          rawValue={generalConfig.maxParticles}
          onRawValueChange={handleMaxParticlesChange}
          step={1}
          minValue={1}
          maxValue={100000}
        />
        <MouseNumberInput
          label="Particles Per Wave"
          rawValue={generalConfig.particlesPerWave}
          onRawValueChange={handleParticlesPerWaveChange}
          step={1}
          minValue={1}
          numberPrecision={1}
        />
      </div>
      <InputGroup title="Particle Lifetime">
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
        <h5 class="text-sm font-medium mb-1">Add At Back</h5>
        <Switch
          checked={generalConfig.addAtBack}
          onChange={handleAddAtBackChange}
        />
      </div>
    </div>
  );
}
