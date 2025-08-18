import { onMount, onCleanup, createEffect } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Application, Assets, ParticleContainer, Ticker } from 'pixi.js';
import { Emitter, type EmitterConfigV3 } from '@repo/emitter';

import { StatusPanel } from './StatusPanel';

import { DebugSpawn } from './elements/DebugSpawn';
import { BackgroundImage } from './elements/BackgroundImage';

import { assets, spriteSheetAssets, loadSpriteSheet } from './assets';

import { setFps, setParticleCounts } from '@/store/status';
import { fullConfig, usedTextures } from '@/store/config';
import {
  setParticleOwnerPosition,
  particleOwnerPosition,
  stageConfig,
  setScreenCenter,
} from '@/store/stage';
import { debugSpawn } from '@/store/debug';

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

  onMount(async () => {
    const app = new Application();
    await app.init({
      width: 800,
      height: 600,
      resizeTo: containerRef,
      preference: 'webgpu',
      backgroundColor: 0xdedede,
      hello: true,
    });
    await Assets.load(assets);
    await Promise.all(spriteSheetAssets.map(loadSpriteSheet));

    const textures = usedTextures();
    const config = unwrap(fullConfig());

    // Debug, display current textures
    // const currentSprites = textures.map((texture, index) => {
    //   const sprite = new Sprite(Assets.get(texture));
    //   sprite.y = 30;
    //   sprite.x = 30 + index * 100;
    //   return sprite;
    // });
    // app.stage.addChild(...currentSprites);
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

    emitter = new Emitter(particleContainer, textures, config);
    emitter.autoUpdate = true;

    const lastTextures = usedTextures().join(',');
    const throttledInitEmitter = leadingAndTrailing(
      throttle,
      (config: EmitterConfigV3) => {
        if (!emitter) return;
        const currentTextures = usedTextures();
        const texutreHash = currentTextures.join(',');

        // recreate particle container and emitter if textures changed
        if (lastTextures !== texutreHash) {
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

          emitter = new Emitter(particleContainer, currentTextures, config);
          emitter.autoUpdate = true;
        } else {
          emitter?.resetPositionTracking();
          emitter.particleImages = usedTextures();
          emitter.init({
            ...config,
            autoUpdate: true,
          });
        }
        emitter.updateOwnerPos(
          particleOwnerPosition.x,
          particleOwnerPosition.y,
        );
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
    </div>
  );
}
