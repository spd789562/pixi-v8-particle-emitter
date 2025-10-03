import { batch } from 'solid-js';
import {
  upgradeConfig,
  type EmitterConfigV3,
  type BehaviorType,
  type ShapeType,
  type ValueList,
} from '@repo/emitter';

import {
  setAccelerationConfig,
  setGeneralConfig,
  setSpawnPosition,
  setColorConfig,
  setColorList,
  setAlphaConfig,
  setAlphaList,
  setSpawnTorusConfig,
  setSpawnPathConfig,
  setSpawnBurstConfig,
  setTexturePlayingType,
  setSpeedMinMult,
  setScaleMinMult,
  setSpawnRectConfig,
  setSpeedConfig,
  setSpeedList,
  setScaleList,
  setScaleConfig,
  setRotationConfig,
  setNoRotation,
  setAnchorConfig,
  setStaticTexture,
  setRandomTextures,
  setEnabledConfig,
  setOrderTextures,
  setAnimatedTextures,
  defaultEnabledConfig,
  setAnimatedConfigs,
} from '@/store/config';
import { setMainTexture } from '@/store/actions';

const parsingAnimatedTexture = (config: unknown) => {
  if (typeof config === 'string') {
    return config;
  }
  if (typeof config === 'object' && config !== null) {
    return (config as { texture: string })?.texture;
  }
  return '';
};

export function configToStore(_config: EmitterConfigV3, _textures?: string[]) {
  const config =
    'behaviors' in _config
      ? upgradeConfig(_config as unknown as any, [])
      : _config;

  batch(() => {
    const { behaviors, ...general } = config;

    setGeneralConfig({
      spawnChance: 1,
      emitterLifetime: -1,
      maxParticles: 1000,
      particlesPerWave: 1,
      addAtBack: false,
      ...general,
    });
    setSpawnPosition(general.pos);

    const enabledConfig = {
      ...defaultEnabledConfig,
      acceleration: false,
      color: false,
      alpha: false,
      speed: false,
      rotation: false,
      scale: false,
      anchor: false,
    };

    for (const behavior of behaviors) {
      switch (behavior.type as BehaviorType) {
        case 'alpha':
          setAlphaList(behavior.config.alpha);
          enabledConfig.alpha = true;
          enabledConfig.alphaType = 'list';
          break;
        case 'alphaStatic':
          setAlphaConfig(behavior.config);
          enabledConfig.alpha = true;
          enabledConfig.alphaType = 'static';
          break;
        case 'anchorStatic':
          setAnchorConfig(behavior.config);
          enabledConfig.anchor = true;
          break;
        case 'color': {
          const colorList = behavior.config.color as ValueList<string>;
          const parsedColorList = colorList.list.map(({ value, time }) => ({
            value: !value.startsWith('#') ? `#${value}` : value,
            time,
          }));
          enabledConfig.color = true;
          enabledConfig.colorType = 'list';
          setColorList({
            list: parsedColorList,
            isStepped: colorList.isStepped,
          });
          break;
        }
        case 'colorStatic':
          enabledConfig.color = true;
          enabledConfig.colorType = 'static';
          setColorConfig({
            color: !behavior.config.color.startsWith('#')
              ? `#${behavior.config.color}`
              : behavior.config.color,
          });
          break;
        case 'textureSingle':
          setTexturePlayingType('static');
          if (behavior.config.texture) {
            setStaticTexture(behavior.config.texture);
          }
          break;
        case 'textureRandom':
          setTexturePlayingType('random');
          if (behavior.config.textures) {
            setMainTexture(behavior.config.textures[0]);
            const parsedTextures = behavior.config.textures
              .map(parsingAnimatedTexture)
              .filter(Boolean);
            setRandomTextures(parsedTextures);
          }
          break;
        case 'textureOrdered':
          setTexturePlayingType('ordered');
          if ((behavior.config.textures || []).length > 0) {
            setMainTexture(behavior.config.textures[0]);
            setOrderTextures(behavior.config.textures);
          }
          break;
        case 'animatedSingle': {
          setTexturePlayingType('animated');
          const textures = behavior.config.anim.textures;
          if (textures.length > 0) {
            const parsedTextures = textures
              .map(parsingAnimatedTexture)
              .filter(Boolean);
            setMainTexture(parsedTextures[0]);
            setAnimatedTextures(parsedTextures);
          }
          setAnimatedConfigs({
            framerate: behavior.config.anim.framerate ?? -1,
            loop: behavior.config.anim.loop ?? true,
          });
          break;
        }
        case 'animatedRandom': {
          setTexturePlayingType('animated');
          const animeConfig = behavior.config.anims[0];
          if (!animeConfig) {
            break;
          }

          const textures = animeConfig.textures ?? [];
          if (textures.length > 0) {
            const parsedTextures = textures
              .map(parsingAnimatedTexture)
              .filter(Boolean);
            setMainTexture(parsedTextures[0]);
            setAnimatedTextures(parsedTextures);
          }
          setAnimatedConfigs({
            framerate: animeConfig.framerate ?? -1,
            loop: animeConfig.loop ?? true,
          });
          break;
        }
        case 'spawnPoint':
          enabledConfig.spawnType = 'point';
          setSpawnPosition(behavior.config);
          break;
        case 'spawnShape': {
          const { type, data } = behavior.config as any;
          switch (type as ShapeType) {
            case 'rect':
              enabledConfig.spawnType = 'rect';
              setSpawnRectConfig(data);
              break;
            case 'torus':
              enabledConfig.spawnType = 'torus';
              setSpawnTorusConfig(data);
              break;
            case 'polygonalChain':
              enabledConfig.spawnType = 'polygonalChain';
              setSpawnPathConfig(data);
              break;
          }
          break;
        }
        case 'spawnBurst':
          enabledConfig.spawnType = 'spawnBurst';
          setSpawnBurstConfig(behavior.config);
          break;
        case 'moveAcceleration':
          enabledConfig.acceleration = true;
          setAccelerationConfig(behavior.config);
          break;
        case 'moveSpeed':
          enabledConfig.speed = true;
          enabledConfig.speedType = 'list';
          setSpeedList(behavior.config.speed);
          setSpeedMinMult(behavior.config.minMult);
          break;
        case 'moveSpeedStatic':
          enabledConfig.speed = true;
          enabledConfig.speedType = 'static';
          setSpeedConfig(behavior.config);
          break;
        case 'scale':
          enabledConfig.scale = true;
          enabledConfig.scaleType = 'list';
          setScaleList(behavior.config.scale);
          setScaleMinMult(behavior.config.minMult);
          break;
        case 'scaleStatic':
          enabledConfig.scale = true;
          enabledConfig.scaleType = 'static';
          setScaleConfig(behavior.config);
          break;
        case 'rotation':
          enabledConfig.rotation = true;
          setRotationConfig(behavior.config);
          break;
        case 'rotationStatic': {
          enabledConfig.rotation = true;
          const { min, max } = behavior.config;
          setRotationConfig({ minStart: min, maxStart: max });
          break;
        }
        case 'noRotation':
          setNoRotation(true);
          break;
      }
    }
    setEnabledConfig(enabledConfig);
  });
}
