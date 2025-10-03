import { onMount, onCleanup, createEffect, batch } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Assets, ParticleContainer, type Texture, Ticker } from 'pixi.js';
import { Emitter, type EmitterConfigV3 } from '@spd789562/particle-emitter';

import { StatusPanel } from './StatusPanel';
import { BottomTips } from './BottomTips';

import { DebugSpawn } from './elements/DebugSpawn';
import { BackgroundImage } from './elements/BackgroundImage';

import { loadDefaultTextures, updateSelectableTextures } from './assets';

import { getPixiApp } from '@/store/app';
import { setFps, setParticleCounts, setRendererType } from '@/store/status';
import {
  fullConfig,
  saveConfigToLocalStorage,
  loadConfigFromLocalStorage,
  loadUsedTexturesFromLocalStorage,
  usedTextures,
} from '@/store/config';
import {
  setParticleOwnerPosition,
  particleOwnerPosition,
  stageConfig,
  setScreenCenter,
} from '@/store/stage';
import {
  debugSpawn,
  saveDebugToLocalStorage,
  loadDebugFromLocalStorage,
} from '@/store/debug';

import { leadingAndTrailing, throttle } from '@solid-primitives/scheduled';

export function PixiApp() {
  let containerRef!: HTMLDivElement;
  let emitter: Emitter | null = null;

  function refreshStatus() {
    setFps(Ticker.shared.FPS);
    if (emitter) {
      setParticleCounts(emitter.particleCount);
    }
  }

  const saveConfig = leadingAndTrailing(
    throttle,
    () => {
      batch(() => {
        saveConfigToLocalStorage();
        saveDebugToLocalStorage();
      });
    },
    400,
  );

  onMount(async () => {
    const app = getPixiApp();
    await app.init({
      width: 800,
      height: 600,
      resizeTo: containerRef,
      preference: 'webgpu',
      backgroundColor: 0xdedede,
      hello: true,
    });
    await loadDefaultTextures();
    const texturesInStorage = loadUsedTexturesFromLocalStorage();
    batch(() => {
      setRendererType(app.renderer.name);
      loadConfigFromLocalStorage();
      loadDebugFromLocalStorage();
      if (texturesInStorage.length > 0) {
        updateSelectableTextures(texturesInStorage[0]);
      }
    });

    const textures =
      texturesInStorage.length > 0 ? texturesInStorage : usedTextures();
    const config = unwrap(fullConfig());

    const backgroundImage = new BackgroundImage();
    app.stage.addChild(backgroundImage);
    const debugSpawnContainer = new DebugSpawn();
    app.stage.addChild(debugSpawnContainer);

    let particleContainer = new ParticleContainer({
      dynamicProperties: {
        uvs: true, // enabled when you need multiple from same texture(aka spritesheet)
        vertex: true, // enabled when the spritesheet is not trimmed
        position: true,
        rotation: true,
        scale: true,
        color: true,
      },
    });

    emitter = new Emitter(particleContainer, config, textures);
    emitter.autoUpdate = true;

    const getUid = (textures: string[]) => {
      return Assets.get<Texture>(textures[0])?.source.uid;
    };
    let lastTextureHash = getUid(textures);
    const throttledInitEmitter = leadingAndTrailing(
      throttle,
      (config: EmitterConfigV3) => {
        if (!emitter) return;
        const currentTextures = usedTextures();
        const textureHash = getUid(currentTextures);

        // recreate particle container and emitter if textures changed
        if (lastTextureHash !== textureHash) {
          particleContainer.removeFromParent();
          particleContainer.destroy();
          particleContainer = new ParticleContainer({
            dynamicProperties: {
              uvs: true, // enabled when you need multiple from same texture(aka spritesheet)
              vertex: true, // enabled when the spritesheet is not trimmed
              position: true,
              rotation: true,
              scale: true,
              color: true,
            },
          });
          app.stage.addChild(particleContainer);

          // since we replace the particle completely, we can just destroy the old one
          emitter?.destroy();

          emitter = new Emitter(particleContainer, config, currentTextures);
          emitter.autoUpdate = true;
          lastTextureHash = textureHash;
        } else {
          emitter?.resetPositionTracking();
          emitter.particleImages = currentTextures;
          emitter.init({
            ...config,
            autoUpdate: true,
          });
        }
        emitter.updateOwnerPos(
          particleOwnerPosition.x,
          particleOwnerPosition.y,
        );

        saveConfig();
      },
      400,
    );

    refreshEmitterCenter();

    app.stage.addChild(particleContainer);
    containerRef.appendChild(app.canvas);

    Ticker.shared.add(refreshStatus);

    function clickHandler(e: MouseEvent) {
      if (!emitter) return;

      emitter.emit = true;
      setParticleOwnerPosition({
        x: e.offsetX || e.layerX,
        y: e.offsetY || e.layerY,
      });
    }
    function mouseMoveHandler(e: MouseEvent) {
      if (!stageConfig.followMouse) return;
      setParticleOwnerPosition({
        x: e.offsetX || e.layerX,
        y: e.offsetY || e.layerY,
      });
    }
    function refreshEmitterCenter() {
      const screenCenter = {
        x: containerRef.clientWidth / 2,
        y: containerRef.clientHeight / 2,
      };
      setScreenCenter(screenCenter);
      setParticleOwnerPosition({
        x: screenCenter.x,
        y: screenCenter.y,
      });
    }
    containerRef.addEventListener('click', clickHandler);
    app.renderer.on('resize', refreshEmitterCenter);

    onCleanup(() => {
      containerRef.removeChild(app.canvas);
      emitter?.destroy();
      app.renderer.off('resize', refreshEmitterCenter);
      app.destroy();
      Ticker.shared.remove(refreshStatus);
      containerRef.removeEventListener('click', clickHandler);
    });

    // config update
    createEffect(() => {
      const _config = unwrap(fullConfig());
      throttledInitEmitter(_config);
    });

    // emitter position update
    createEffect(() => {
      emitter?.resetPositionTracking();
      emitter?.updateOwnerPos(particleOwnerPosition.x, particleOwnerPosition.y);
    });

    // follow mouse setting
    createEffect(() => {
      if (stageConfig.followMouse) {
        containerRef.addEventListener('mousemove', mouseMoveHandler);
      } else {
        containerRef.removeEventListener('mousemove', mouseMoveHandler);
      }
    });

    // debug spawn setting
    createEffect(() => {
      const enabledPoint = debugSpawn.enabledPoint;
      const enabledShape = debugSpawn.enabledShape;
      debugSpawnContainer.spawnPoint.visible = enabledPoint;
      debugSpawnContainer.shapeContainer.visible = enabledShape;
    });

    // background color update
    createEffect(() => {
      const backgroundColor = stageConfig.backgroundColor;
      app.renderer.background.color = backgroundColor;
    });
  });

  return (
    <div class="w-full h-full relative" ref={containerRef}>
      <StatusPanel />
      <BottomTips />
    </div>
  );
}
