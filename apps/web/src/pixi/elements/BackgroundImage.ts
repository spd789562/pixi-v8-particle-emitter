import { Sprite, Container, Assets, Texture } from 'pixi.js';
import { createEffect, on } from 'solid-js';
import { trackDeep } from '@solid-primitives/deep';

import { stageConfig, screenCenter } from '@/store/stage';

export class BackgroundImage extends Container {
  private backgroundImage: Sprite;
  constructor() {
    super();
    this.backgroundImage = new Sprite({
      texture: Texture.EMPTY,
      anchor: 0.5,
    });
    this.addChild(this.backgroundImage);
    this.listenConfig();
    this.listenPosition();
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
}
