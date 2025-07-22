import { onMount, onCleanup } from 'solid-js';
import {
  Application,
  Assets,
  Sprite,
  ParticleContainer,
  Ticker,
} from 'pixi.js';
import { Emitter } from '@repo/emitter';

import { exampleConfigs } from './exampleConfigs';
import { assets, spriteSheetAssets, loadSpriteSheet } from './assets';
import { fps, setFps } from '@/store/fps';

export function PixiApp() {
  let containerRef!: HTMLDivElement;

  function refreshFps() {
    setFps(Math.round(Ticker.shared.FPS));
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

    const config = exampleConfigs.animatedBubble;

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

    const emitter = new Emitter(container, config.textures, config.config);
    emitter.autoUpdate = true;

    app.stage.addChild(container);
    containerRef.appendChild(app.canvas);

    Ticker.shared.add(refreshFps);

    function clickHandler(e: MouseEvent) {
      emitter.emit = true;
      emitter.resetPositionTracking();
      emitter.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
    }
    containerRef.addEventListener('click', clickHandler);

    onCleanup(() => {
      containerRef.removeChild(app.canvas);
      emitter.destroy();
      app.destroy();
      Ticker.shared.remove(refreshFps);
      containerRef.removeEventListener('click', clickHandler);
    });
  });

  return (
    <div class="w-full h-full relative" ref={containerRef}>
      <div class="absolute top-0 left-0">FPS: {fps()}</div>
    </div>
  );
}
