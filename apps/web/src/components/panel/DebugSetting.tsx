import { Switch, ColorPickerField, MouseNumberInput } from '@repo/ui';

import {
  debugSpawn,
  setDebugSpawn,
  spawnPointColor,
  setSpawnPointColor,
  debugColor,
  setDebugColor,
} from '@/store/debug';

export function DebugSetting() {
  return (
    <div class="flex flex-col gap-2">
      <Switch
        label="Enabled Spawn Point"
        checked={debugSpawn.enabledPoint}
        onChange={(checked) => setDebugSpawn('enabledPoint', checked)}
      />
      <Switch
        label="Enabled Shape Debugger"
        checked={debugSpawn.enabledShape}
        onChange={(checked) => setDebugSpawn('enabledShape', checked)}
      />
      <div class="flex flex-col gap-2 w-3/5">
        <ColorPickerField
          label="Spawn Point Color"
          value={spawnPointColor.stroke}
          onChange={(color) =>
            setSpawnPointColor('stroke', color.toString('hex'))
          }
        />
        <MouseNumberInput
          label="Spawn Point Alpha"
          rawValue={spawnPointColor.alpha}
          onRawValueChange={(value) => setSpawnPointColor('alpha', value)}
          numberPrecision={2}
          minValue={0}
          maxValue={1}
          step={0.01}
        />
        <ColorPickerField
          label="Shape Debugger Fill"
          value={debugColor.fill}
          onChange={(color) => setDebugColor('fill', color.toString('hex'))}
        />
        <ColorPickerField
          label="Shape Debugger Stroke"
          value={debugColor.stroke}
          onChange={(color) => setDebugColor('stroke', color.toString('hex'))}
        />
        <MouseNumberInput
          label="Shape Fill Alpha"
          rawValue={debugColor.alpha}
          onRawValueChange={(value) => setDebugColor('alpha', value)}
          numberPrecision={2}
          minValue={0}
          maxValue={1}
          step={0.01}
        />
        <MouseNumberInput
          label="Shape Stroke Alpha"
          rawValue={debugColor.strokeAlpha}
          onRawValueChange={(value) => setDebugColor('strokeAlpha', value)}
          numberPrecision={2}
          minValue={0}
          maxValue={1}
          step={0.01}
        />
      </div>
    </div>
  );
}
