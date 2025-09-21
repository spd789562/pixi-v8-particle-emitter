import {
  Sprite,
  Container,
  Assets,
  Texture,
  type DestroyOptions,
} from 'pixi.js';
import { createEffect, createRoot, on } from 'solid-js';
import { trackDeep } from '@solid-primitives/deep';

import { stageConfig, screenCenter } from '@/store/stage';

export class BackgroundImage extends Container {
  private backgroundImage: Sprite;
  private disposeSignal?: () => void;
  constructor() {
    super();
    this.backgroundImage = new Sprite({
      texture: Texture.EMPTY,
      anchor: 0.5,
    });
    this.addChild(this.backgroundImage);
    createRoot((dispose) => {
      this.disposeSignal = dispose;
      this.listenConfig();
      this.listenPosition();
    });
  }

  listenConfig() {
    createEffect(
      on(
        () => stageConfig.backgroundImage,
        () => {
          this.backgroundImage.texture = Assets.get(
            stageConfig.backgroundImage,
          );
        },
      ),
    );
    createEffect(
      on(
        () => stageConfig.backgroundImageScale,
        () => {
          this.backgroundImage.scale.set(stageConfig.backgroundImageScale);
        },
      ),
    );
    createEffect(
      on(
        () => stageConfig.backgroundImageAlpha,
        () => {
          this.backgroundImage.alpha = stageConfig.backgroundImageAlpha;
        },
      ),
    );
  }
  listenPosition() {
    createEffect(() => {
      const position = trackDeep(screenCenter);
      this.position.set(position.x, position.y);
    });
  }
  destroy(options?: DestroyOptions): void {
    this.disposeSignal?.();
    super.destroy(options);
  }
}
