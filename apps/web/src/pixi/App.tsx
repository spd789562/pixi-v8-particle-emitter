import { onMount, onCleanup } from 'solid-js';
import {
  Application,
  Assets,
  Sprite,
  ParticleContainer,
  Ticker,
} from 'pixi.js';
import { Emitter } from '@repo/emitter';

import { StatusPanel } from './StatusPanel';

import { exampleConfigs } from './exampleConfigs';
import { assets, spriteSheetAssets, loadSpriteSheet } from './assets';
import { setFps, setParticleCounts } from '@/store/status';

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

    const config = exampleConfigs.bubbleVertical;

    const currentSprites = config.textures.map((texture, index) => {
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

    emitter = new Emitter(container, config.textures, config.config);
    emitter.autoUpdate = true;
    refreshEmitterCenter();

    app.stage.addChild(container);
    containerRef.appendChild(app.canvas);

    Ticker.shared.add(refreshStatus);

    function clickHandler(e: MouseEvent) {
      if (!emitter) return;

      emitter.emit = true;
      emitter.resetPositionTracking();
      emitter.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
    }
    function refreshEmitterCenter() {
      const screenCenter = {
        x: containerRef.clientWidth / 2,
        y: containerRef.clientHeight / 2,
      };
      emitter?.updateOwnerPos(screenCenter.x, screenCenter.y);
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
  });

  return (
    <div class="w-full h-full relative" ref={containerRef}>
      <StatusPanel />
    </div>
  );
}
