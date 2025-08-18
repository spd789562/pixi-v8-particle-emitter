import { createMemo } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';
import type { PointData } from 'pixi.js';

import { SimpleTabs, MouseNumberInput, Switch } from '@repo/ui';
import { InputGroup } from '@/components/InputGroup';
import { MinMaxInputGroup } from '@/components/MinMaxInputGroup';
import { PosInputList } from '../PosInputList';

import {
  spawnPosition,
  setSpawnPosition,
  enabledConfig,
  setEnabledConfig,
  type SpawnType,
  setSpawnRectConfig,
  spawnRectConfig,
  spawnTorusConfig,
  setSpawnTorusConfig,
  spawnPathConfig,
  setSpawnPathConfig,
  spawnBurstConfig,
  setSpawnBurstConfig,
} from '@/store/config';
import { setSyncConfig, syncConfig } from '@/store/input';

export function SpawnSetting() {
  const tabs = [
    {
      label: 'Point',
      value: 'point',
      content: <div>Not Thing</div>,
    },
    {
      label: 'Rect',
      value: 'rect',
      content: <RectShapeSetting />,
    },
    {
      label: 'Torus',
      value: 'torus',
      content: <TorusShapeSetting />,
    },
    {
      label: 'Path',
      value: 'polygonalChain',
      content: <PolygonalChainShapeSetting />,
    },
    {
      label: 'Burst',
      value: 'spawnBurst',
      content: <BurstSpawnSetting />,
    },
  ];

  return (
    <div class="flex flex-col gap-2">
      <InputGroup title="Spawn Position">
        <div class="flex gap-2">
          <MouseNumberInput
            label="X"
            rawValue={spawnPosition.x}
            onRawValueChange={(v) => setSpawnPosition('x', v)}
            numberPrecision={1}
          />
          <MouseNumberInput
            label="Y"
            rawValue={spawnPosition.y}
            onRawValueChange={(v) => setSpawnPosition('y', v)}
            numberPrecision={1}
          />
        </div>
      </InputGroup>
      <h5 class="text-md font-medium">Spawn Type</h5>
      <SimpleTabs
        tabs={tabs}
        value={enabledConfig.spawnType}
        onChange={(v) => setEnabledConfig('spawnType', v as SpawnType)}
      />
    </div>
  );
}

export function RectShapeSetting() {
  return (
    <div class="flex flex-col gap-2">
      <InputGroup title="Top Left Position">
        <div class="flex gap-2">
          <MouseNumberInput
            label="X"
            rawValue={spawnRectConfig.x}
            onRawValueChange={(v) => setSpawnRectConfig('x', v)}
            numberPrecision={1}
          />
          <MouseNumberInput
            label="Y"
            rawValue={spawnRectConfig.y}
            onRawValueChange={(v) => setSpawnRectConfig('y', v)}
            numberPrecision={1}
          />
        </div>
      </InputGroup>
      <InputGroup title="Size">
        <MinMaxInputGroup
          numberPrecision={1}
          minLabel="Width"
          maxLabel="Height"
          syncText="square"
          separator="x"
          minValue={spawnRectConfig.w}
          maxValue={spawnRectConfig.h}
          sync={syncConfig.spawnRect}
          setMinValue={(v) => setSpawnRectConfig('w', v)}
          setMaxValue={(v) => setSpawnRectConfig('h', v)}
          setSync={(v) => setSyncConfig('spawnRect', v)}
        />
      </InputGroup>
    </div>
  );
}

export function TorusShapeSetting() {
  return (
    <div class="flex flex-col gap-2">
      <InputGroup title="Center Position">
        <div class="flex gap-2">
          <MouseNumberInput
            label="X"
            rawValue={spawnTorusConfig.x}
            onRawValueChange={(v) => setSpawnTorusConfig('x', v)}
            numberPrecision={1}
          />
          <MouseNumberInput
            label="Y"
            rawValue={spawnTorusConfig.y}
            onRawValueChange={(v) => setSpawnTorusConfig('y', v)}
            numberPrecision={1}
          />
        </div>
      </InputGroup>
      <MouseNumberInput
        label="Radius"
        rawValue={spawnTorusConfig.radius}
        onRawValueChange={(v) => setSpawnTorusConfig('radius', v)}
        numberPrecision={1}
        minValue={0}
        description="Outer radius(in degree)"
      />
      <MouseNumberInput
        label="Inner Radius"
        rawValue={spawnTorusConfig.innerRadius}
        onRawValueChange={(v) => setSpawnTorusConfig('innerRadius', v)}
        numberPrecision={1}
        minValue={0}
        description="Inner radius(in degree)"
      />
      <Switch
        label="Affect Rotation"
        checked={spawnTorusConfig.affectRotation}
        onChange={(v) => setSpawnTorusConfig('affectRotation', v)}
      />
    </div>
  );
}

export function PolygonalChainShapeSetting() {
  const singleGroupData = createMemo(() => {
    if (Array.isArray(spawnPathConfig[0])) {
      return spawnPathConfig[0] as PointData[];
    }
    return spawnPathConfig as PointData[];
  });
  return (
    <div class="flex flex-col gap-2">
      <PosInputList
        data={singleGroupData()}
        onChange={setSpawnPathConfig as SetStoreFunction<PointData[]>}
      />
      <span class="text-sm text-gray-500">
        Path need at lease two points, and only support the first group of
        points.
      </span>
    </div>
  );
}

export function BurstSpawnSetting() {
  return (
    <div class="flex flex-col gap-2">
      <span class="text-sm text-gray-500">
        Don't forget to adjust the Particles Pre Wave to see it burst at each
        direction
      </span>
      <MouseNumberInput
        minValue={1}
        maxValue={360}
        label="Spacing"
        rawValue={spawnBurstConfig.spacing}
        onRawValueChange={(v) => setSpawnBurstConfig('spacing', v)}
        numberPrecision={1}
        description="Spacing between each spawn"
      />
      <MouseNumberInput
        label="Start"
        rawValue={spawnBurstConfig.start}
        onRawValueChange={(v) => setSpawnBurstConfig('start', v)}
        numberPrecision={1}
      />
      <MouseNumberInput
        label="Distance"
        rawValue={spawnBurstConfig.distance}
        onRawValueChange={(v) => setSpawnBurstConfig('distance', v)}
        numberPrecision={1}
        description="Distance away from the center"
      />
    </div>
  );
}
