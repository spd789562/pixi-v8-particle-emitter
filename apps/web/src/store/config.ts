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

  scale: false,
  scaleType: 'static' as TransitionType,

  anchor: false,

  spawnType: 'point' as SpawnType,
});

export const [speedList, setSpeedList] = createStore<ValueList<number>>({
  list: [
    {
      value: 100,
      time: 0,
    },
    {
      value: 200,
      time: 1,
    },
  ],
  isStepped: false,
});
export const [speedMinMult, setSpeedMinMult] = createSignal(1);
export const [speedConfig, setSpeedConfig] = createStore<
  BehaviorConfigRecord['StaticSpeedBehavior']['config']
>({
  min: 200,
  max: 200,
});

export const [scaleList, setScaleList] = createStore<ValueList<number>>({
  list: [
    {
      value: 0.5,
      time: 0,
    },
    {
      value: 0.8,
      time: 1,
    },
  ],
  isStepped: false,
});
export const [scaleMinMult, setScaleMinMult] = createSignal(1);
export const [scaleConfig, setScaleConfig] = createStore<
  BehaviorConfigRecord['StaticScaleBehavior']['config']
>({
  min: 0.5,
  max: 0.7,
});

export const [alphaList, setAlphaList] = createStore<ValueList<number>>({
  list: [
    {
      value: 1,
      time: 0,
    },
    {
      value: 0,
      time: 1,
    },
  ],
  isStepped: false,
});
export const [alphaConfig, setAlphaConfig] = createStore<
  BehaviorConfigRecord['StaticAlphaBehavior']['config']
>({
  alpha: 1,
});

export const [rotationConfig, setRotationConfig] = createStore<
  BehaviorConfigRecord['RotationBehavior']['config']
>({
  minStart: 0,
  maxStart: 0,
  minSpeed: 0,
  maxSpeed: 0,
  accel: 0,
});
export const [noRotation, setNoRotation] = createSignal(false);

const fullConfigTracker = () => {
  trackStore(generalConfig);
  trackStore(speedList);
  trackStore(enabledConfig);
  trackStore(speedConfig);
  trackStore(rotationConfig);
  trackStore(scaleConfig);
  trackStore(scaleList);
  trackStore(alphaList);
  trackStore(alphaConfig);
  speedMinMult();
  scaleMinMult();
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
            // should I sort the inner list?
            speed: unwrap(speedList),
            minMult: speedMinMult(),
          },
        });
      }
    }
    if (enabledConfig.scale) {
      if (enabledConfig.scaleType === 'static') {
        fullConfig.behaviors.push({
          type: 'scaleStatic',
          config: scaleConfig,
        });
      } else {
        fullConfig.behaviors.push({
          type: 'scale',
          config: {
            scale: unwrap(scaleList),
            minMult: scaleMinMult(),
          },
        });
      }
    }
    if (enabledConfig.alpha) {
      if (enabledConfig.alphaType === 'static') {
        fullConfig.behaviors.push({
          type: 'alphaStatic',
          config: alphaConfig,
        });
      } else {
        fullConfig.behaviors.push({
          type: 'alpha',
          config: {
            alpha: unwrap(alphaList),
          },
        });
      }
    }
    if (enabledConfig.rotation) {
      const isStatic = rotationConfig.accel === 0;
      if (isStatic) {
        fullConfig.behaviors.push({
          type: 'rotationStatic',
          config: {
            min: rotationConfig.minStart,
            max: rotationConfig.maxStart,
          },
        });
      } else {
        fullConfig.behaviors.push({
          type: 'rotation',
          config: {
            ...rotationConfig,
          },
        });
      }
      if (noRotation()) {
        fullConfig.behaviors.push({
          type: 'noRotation',
          config: {},
        });
      }
    }

    return fullConfig;
  }),
);
