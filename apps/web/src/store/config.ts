import { createMemo, createSignal, on } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import type {
  EmitterConfigV3,
  BehaviorConfigRecord,
  BehaviorConfigs,
  ShapeType,
  ValueList,
} from '@repo/emitter';
import { trackStore } from '@solid-primitives/deep';

export const [usedTextures, setUsedTextures] = createSignal<string[]>([
  'Bubbles99',
]);

export type GeneralConfig = Omit<
  EmitterConfigV3,
  'behaviors' | 'autoUpdate' | 'emit'
>;

export const [generalConfig, setGeneralConfig] = createStore<GeneralConfig>({
  lifetime: { min: 0.5, max: 1 },
  frequency: 0.1,
  pos: { x: 0, y: 0 },
  spawnChance: 1,
  emitterLifetime: -1,
  maxParticles: 1000,
  particlesPerWave: 1,
  addAtBack: false,
} satisfies GeneralConfig);

export type TransitionType = 'static' | 'list';
export type SpawnType = 'point' | ShapeType;

export const [enabledConfig, setEnabledConfig] = createStore({
  acceleration: false,
  color: false,
  colorType: 'static' as TransitionType,

  alpha: false,
  alphaType: 'static' as TransitionType,

  speed: false,
  speedType: 'static' as TransitionType,

  rotation: false,
  rotationType: 'static' as TransitionType,

  scale: false,
  scaleType: 'static' as TransitionType,

  anchor: false,

  spawnType: 'point' as SpawnType,
});

export const [speedList, setSpeedList] = createStore<ValueList<number>>({
  list: [],
  isStepped: false,
});
export const [speedConfig, setSpeedConfig] = createStore<
  BehaviorConfigRecord['StaticSpeedBehavior']['config']
>({
  min: 200,
  max: 200,
});

const fullConfigTracker = () => {
  trackStore(generalConfig);
  trackStore(speedList);
  trackStore(enabledConfig);
  trackStore(speedConfig);
};

export const fullConfig = createMemo(
  on(fullConfigTracker, () => {
    const fullConfig = {
      ...unwrap(generalConfig),
      behaviors: [] as BehaviorConfigs[],
    } satisfies EmitterConfigV3;

    if (enabledConfig.speed) {
      if (enabledConfig.speedType === 'static') {
        fullConfig.behaviors.push({
          type: 'moveSpeedStatic',
          config: speedConfig,
        });
      } else {
        fullConfig.behaviors.push({
          type: 'moveSpeed',
          config: {
            speed: unwrap(speedList),
            minMult: 1,
          },
        });
      }
    }

    return fullConfig;
  }),
);
