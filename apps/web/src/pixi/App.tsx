import { onMount, onCleanup, createEffect } from 'solid-js';
import { unwrap } from 'solid-js/store';
import {
  Application,
  Assets,
  Sprite,
  ParticleContainer,
  Ticker,
} from 'pixi.js';
import { Emitter, type EmitterConfigV3 } from '@repo/emitter';

import { StatusPanel } from './StatusPanel';

import { assets, spriteSheetAssets, loadSpriteSheet } from './assets';

import { setFps, setParticleCounts } from '@/store/status';
import {
  fullConfig,
  setSpawnPosition,
  spawnPosition,
  usedTextures,
} from '@/store/config';

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

    const currentSprites = textures.map((texture, index) => {
      const sprite = new Sprite(Assets.get(texture));
      sprite.y = 30;
      sprite.x = 30 + index * 100;
      return sprite;
    });
    app.stage.addChild(...currentSprites);

    const container = new ParticleContainer({
      dynamicProperties: {
        uvs: true, // enabled when you need multiple from same texture(aka spritesheet)
        vertex: true, // enabled when the spritesheet is not trimmed
        position: true,
        rotation: true,
        scale: true,
        color: true,
      },
    });

    emitter = new Emitter(container, textures, config);
    emitter.autoUpdate = true;

    const throttledInitEmitter = leadingAndTrailing(
      throttle,
      (config: EmitterConfigV3) => {
        emitter?.init({
          ...config,
          autoUpdate: true,
        });
      },
      400,
    );

    refreshEmitterCenter();

    app.stage.addChild(container);
    containerRef.appendChild(app.canvas);

    Ticker.shared.add(refreshStatus);

    function clickHandler(e: MouseEvent) {
      if (!emitter) return;

      emitter.emit = true;
      setSpawnPosition({
        x: e.offsetX || e.layerX,
        y: e.offsetY || e.layerY,
      });
    }
    function refreshEmitterCenter() {
      const screenCenter = {
        x: containerRef.clientWidth / 2,
        y: containerRef.clientHeight / 2,
      };
      setSpawnPosition({
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

    createEffect(() => {
      const _config = unwrap(fullConfig());
      throttledInitEmitter(_config);
    });
    createEffect(() => {
      const _x = spawnPosition.x;
      const _y = spawnPosition.y;
      emitter?.resetPositionTracking();
      emitter?.updateOwnerPos(0, 0);
    });
  });

  return (
    <div class="w-full h-full relative" ref={containerRef}>
      <StatusPanel />
    </div>
  );
}
