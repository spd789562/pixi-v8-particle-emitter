import { createMemo, createSignal, on } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import type {
  EmitterConfigV3,
  BehaviorConfigRecord,
  BehaviorConfigs,
  ShapeType,
  ShapeConfigRecord,
  ValueList,
} from '@repo/emitter';
import { trackStore } from '@solid-primitives/deep';

export const [usedTextures, setUsedTextures] = createSignal<string[]>([
  'Bubbles99',
]);
export type TexturePlayingType = 'static' | 'ordered' | 'random' | 'animated';
export const [texturePlayingType, setTexturePlayingType] =
  createSignal<TexturePlayingType>('static');

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
export type SpawnType = 'point' | 'spawnBurst' | ShapeType;

export const defaultEnabledConfig = {
  acceleration: false,
  color: true,
  colorType: 'static' as TransitionType,

  alpha: true,
  alphaType: 'static' as TransitionType,

  speed: true,
  speedType: 'static' as TransitionType,

  rotation: true,

  scale: true,
  scaleType: 'static' as TransitionType,

  anchor: false,

  spawnType: 'point' as SpawnType,
};

export const [enabledConfig, setEnabledConfig] =
  createStore(defaultEnabledConfig);

export const [accelerationConfig, setAccelerationConfig] = createStore<
  BehaviorConfigRecord['AccelerationBehavior']['config']
>({
  minStart: 0,
  maxStart: 0,
  accel: { x: 0, y: 0 },
  rotate: false,
  maxSpeed: 0,
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
  min: 0.3,
  max: 0.5,
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

export const [colorList, setColorList] = createStore<ValueList<string>>({
  list: [
    {
      value: '#ffffff',
      time: 0,
    },
    {
      value: '#333399',
      time: 1,
    },
  ],
  isStepped: false,
});
export const [colorConfig, setColorConfig] = createStore<
  BehaviorConfigRecord['StaticColorBehavior']['config']
>({
  color: '#ffffff',
});

export const [rotationConfig, setRotationConfig] = createStore<
  BehaviorConfigRecord['RotationBehavior']['config']
>({
  minStart: 260,
  maxStart: 280,
  minSpeed: 0,
  maxSpeed: 0,
  accel: 0,
});
export const [noRotation, setNoRotation] = createSignal(false);

export const [spawnPosition, setSpawnPosition] = createStore({
  x: 0,
  y: 0,
});
export const [spawnRectConfig, setSpawnRectConfig] = createStore<
  ShapeConfigRecord['Rectangle']['config']
>({
  x: 0,
  y: 0,
  w: 100,
  h: 100,
});
export const [spawnTorusConfig, setSpawnTorusConfig] = createStore<
  ShapeConfigRecord['Torus']['config']
>({
  x: 0,
  y: 0,
  radius: 100,
  innerRadius: 50,
  affectRotation: false,
});
export const [spawnPathConfig, setSpawnPathConfig] = createStore<
  ShapeConfigRecord['PolygonalChain']['config']
>([
  { x: -50, y: -50 },
  { x: 50, y: 50 },
]);
export const [spawnBurstConfig, setSpawnBurstConfig] = createStore<
  BehaviorConfigRecord['BurstSpawnBehavior']['config']
>({
  spacing: 10,
  start: 0,
  distance: 100,
});

export const [anchorConfig, setAnchorConfig] = createStore<
  BehaviorConfigRecord['StaticAnchorBehavior']['config']
>({
  x: 0.5,
  y: 0.5,
});

const fullConfigTracker = () => {
  trackStore(generalConfig);
  trackStore(speedList);
  trackStore(enabledConfig);
  trackStore(speedConfig);
  trackStore(accelerationConfig);
  trackStore(rotationConfig);
  trackStore(scaleConfig);
  trackStore(scaleList);
  trackStore(alphaList);
  trackStore(alphaConfig);
  trackStore(colorList);
  trackStore(colorConfig);
  trackStore(spawnPosition);
  trackStore(spawnRectConfig);
  trackStore(spawnTorusConfig);
  trackStore(spawnPathConfig);
  trackStore(spawnBurstConfig);
  trackStore(anchorConfig);
  texturePlayingType();
  speedMinMult();
  scaleMinMult();
};

export const fullConfig = createMemo(
  on(fullConfigTracker, () => {
    const fullConfig = {
      ...unwrap(generalConfig),
      pos: {
        x: spawnPosition.x,
        y: spawnPosition.y,
      },
      behaviors: [] as BehaviorConfigs[],
    } satisfies EmitterConfigV3;

    if (usedTextures().length > 1) {
      if (texturePlayingType() === 'random') {
        fullConfig.behaviors.push({
          type: 'textureRandom',
          config: {
            textures: usedTextures(),
          },
        });
      } else if (texturePlayingType() === 'ordered') {
        fullConfig.behaviors.push({
          type: 'textureOrdered',
          config: {
            textures: usedTextures(),
          },
        });
      } else if (texturePlayingType() === 'animated') {
        fullConfig.behaviors.push({
          type: 'animatedSingle',
          config: {
            anim: {
              framerate: -1,
              loop: true,
              textures: usedTextures(),
            },
          },
        });
      }
    } else {
      fullConfig.behaviors.push({
        type: 'textureSingle',
        config: {
          texture: usedTextures()[0],
        },
      });
    }

    if (enabledConfig.spawnType === 'point') {
      // do nothing
    } else if (enabledConfig.spawnType === 'spawnBurst') {
      fullConfig.behaviors.push({
        type: 'spawnBurst',
        config: spawnBurstConfig,
      });
    } else if (enabledConfig.spawnType === 'rect') {
      fullConfig.behaviors.push({
        type: 'spawnShape',
        config: {
          type: 'rect',
          data: spawnRectConfig,
        },
      });
    } else if (enabledConfig.spawnType === 'torus') {
      fullConfig.behaviors.push({
        type: 'spawnShape',
        config: {
          type: 'torus',
          data: spawnTorusConfig,
        },
      });
    } else if (
      enabledConfig.spawnType === 'polygonalChain' &&
      spawnPathConfig.length > 0
    ) {
      fullConfig.behaviors.push({
        type: 'spawnShape',
        config: {
          type: 'polygonalChain',
          data: spawnPathConfig,
        },
      });
    }

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
    if (enabledConfig.acceleration) {
      fullConfig.behaviors.push({
        type: 'moveAcceleration',
        config: accelerationConfig,
      });
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
    if (enabledConfig.color) {
      if (enabledConfig.colorType === 'static') {
        fullConfig.behaviors.push({
          type: 'colorStatic',
          config: colorConfig,
        });
      } else {
        fullConfig.behaviors.push({
          type: 'color',
          config: {
            color: unwrap(colorList),
          },
        });
      }
    }
    if (enabledConfig.rotation) {
      const isStatic = rotationConfig.minSpeed === rotationConfig.maxSpeed;
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

    if (enabledConfig.anchor) {
      fullConfig.behaviors.push({
        type: 'anchorStatic',
        config: anchorConfig,
      });
    }

    return fullConfig;
  }),
);

export function saveConfigToLocalStorage() {
  // localStorage.setItem('usedTextures', JSON.stringify(unwrap(usedTextures)));
  localStorage.setItem('texturePlayingType', texturePlayingType());
  localStorage.setItem('generalConfig', JSON.stringify(unwrap(generalConfig)));
  localStorage.setItem('enabledConfig', JSON.stringify(unwrap(enabledConfig)));
  localStorage.setItem('speedList', JSON.stringify(unwrap(speedList)));
  localStorage.setItem('speedConfig', JSON.stringify(unwrap(speedConfig)));
  localStorage.setItem(
    'accelerationConfig',
    JSON.stringify(unwrap(accelerationConfig)),
  );
  localStorage.setItem(
    'rotationConfig',
    JSON.stringify(unwrap(rotationConfig)),
  );
  localStorage.setItem('scaleConfig', JSON.stringify(unwrap(scaleConfig)));
  localStorage.setItem('scaleList', JSON.stringify(unwrap(scaleList)));
  localStorage.setItem('alphaList', JSON.stringify(unwrap(alphaList)));
  localStorage.setItem('alphaConfig', JSON.stringify(unwrap(alphaConfig)));
  localStorage.setItem('colorList', JSON.stringify(unwrap(colorList)));
  localStorage.setItem('colorConfig', JSON.stringify(unwrap(colorConfig)));
  localStorage.setItem('spawnPosition', JSON.stringify(unwrap(spawnPosition)));
  localStorage.setItem(
    'spawnRectConfig',
    JSON.stringify(unwrap(spawnRectConfig)),
  );
  localStorage.setItem(
    'spawnTorusConfig',
    JSON.stringify(unwrap(spawnTorusConfig)),
  );
  localStorage.setItem(
    'spawnPathConfig',
    JSON.stringify(unwrap(spawnPathConfig)),
  );
  localStorage.setItem(
    'spawnBurstConfig',
    JSON.stringify(unwrap(spawnBurstConfig)),
  );
  localStorage.setItem('anchorConfig', JSON.stringify(unwrap(anchorConfig)));
  localStorage.setItem('noRotation', noRotation().toString());
}
export function loadConfigFromLocalStorage() {
  // const usedTextures = localStorage.getItem('usedTextures');
  // if (usedTextures) {
  //   setUsedTextures(JSON.parse(usedTextures));
  // }
  const texturePlayingType = localStorage.getItem('texturePlayingType');
  if (texturePlayingType) {
    setTexturePlayingType(texturePlayingType as TexturePlayingType);
  }
  const generalConfig = loadFromLocalStorageByKey('generalConfig');
  if (generalConfig) {
    setGeneralConfig(generalConfig);
  }
  const enabledConfig = loadFromLocalStorageByKey('enabledConfig');
  if (enabledConfig) {
    setEnabledConfig(enabledConfig);
  }
  const speedList = loadFromLocalStorageByKey('speedList');
  if (speedList) {
    setSpeedList(speedList);
  }
  const speedConfig = loadFromLocalStorageByKey('speedConfig');
  if (speedConfig) {
    setSpeedConfig(speedConfig);
  }
  const accelerationConfig = loadFromLocalStorageByKey('accelerationConfig');
  if (accelerationConfig) {
    setAccelerationConfig(accelerationConfig);
  }
  const rotationConfig = loadFromLocalStorageByKey('rotationConfig');
  if (rotationConfig) {
    setRotationConfig(rotationConfig);
  }
  const scaleConfig = loadFromLocalStorageByKey('scaleConfig');
  if (scaleConfig) {
    setScaleConfig(scaleConfig);
  }
  const scaleList = loadFromLocalStorageByKey('scaleList');
  if (scaleList) {
    setScaleList(scaleList);
  }
  const alphaList = loadFromLocalStorageByKey('alphaList');
  if (alphaList) {
    setAlphaList(alphaList);
  }
  const alphaConfig = loadFromLocalStorageByKey('alphaConfig');
  if (alphaConfig) {
    setAlphaConfig(alphaConfig);
  }
  const colorList = loadFromLocalStorageByKey('colorList');
  if (colorList) {
    setColorList(colorList);
  }
  const colorConfig = loadFromLocalStorageByKey('colorConfig');
  if (colorConfig) {
    setColorConfig(colorConfig);
  }
  const spawnPosition = loadFromLocalStorageByKey('spawnPosition');
  if (spawnPosition) {
    setSpawnPosition(spawnPosition);
  }
  const spawnRectConfig = loadFromLocalStorageByKey('spawnRectConfig');
  if (spawnRectConfig) {
    setSpawnRectConfig(spawnRectConfig);
  }
  const spawnTorusConfig = loadFromLocalStorageByKey('spawnTorusConfig');
  if (spawnTorusConfig) {
    setSpawnTorusConfig(spawnTorusConfig);
  }
  const spawnPathConfig = loadFromLocalStorageByKey('spawnPathConfig');
  if (spawnPathConfig) {
    setSpawnPathConfig(spawnPathConfig);
  }
  const spawnBurstConfig = loadFromLocalStorageByKey('spawnBurstConfig');
  if (spawnBurstConfig) {
    setSpawnBurstConfig(spawnBurstConfig);
  }
  const anchorConfig = loadFromLocalStorageByKey('anchorConfig');
  if (anchorConfig) {
    setAnchorConfig(anchorConfig);
  }
  setNoRotation(localStorage.getItem('noRotation') === 'true');
}

export function loadFromLocalStorageByKey(key: string): any {
  const value = localStorage.getItem(key);
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Error loading from localStorage', error);
    return undefined;
  }
}
