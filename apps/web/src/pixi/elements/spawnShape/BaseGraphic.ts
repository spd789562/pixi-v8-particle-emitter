import { Container, Graphics, Color } from 'pixi.js';

import type {
  SpawnShapeColorOption,
  ISpawnShapeContainer,
  SpawnBurstConfig,
} from './type';
import type { ShapeConfigs } from '@repo/emitter';

type Configs = ShapeConfigs['config'] | SpawnBurstConfig;

export abstract class BaseGraphic<Config extends Configs>
  extends Container
  implements ISpawnShapeContainer<Config>
{
  config: Config;
  colorOption: {
    fill: Color;
    stroke: Color;
    alpha: number;
    strokeAlpha: number;
  };
  protected graphics: Graphics;

  constructor(config: Config, color?: Partial<SpawnShapeColorOption>) {
    super();
    this.config = config;
    this.colorOption = {
      stroke: new Color(color?.stroke ?? 0x000000),
      fill: new Color(color?.fill ?? 0x990000),
      alpha: color?.alpha ?? 0.2,
      strokeAlpha: color?.strokeAlpha ?? 1,
    };
    this.init();

    const graphics = new Graphics();
    this.graphics = graphics;
    this.updateConfig(config);

    this.addChild(this.graphics);
  }

  init() {}

  updateConfig(config: Config, color?: Partial<SpawnShapeColorOption>) {
    this.config = config;
    if (color?.stroke) {
      this.colorOption.stroke.setValue(color.stroke);
    }
    if (color?.fill) {
      this.colorOption.fill.setValue(color.fill);
    }
    if (color?.alpha) {
      this.colorOption.alpha = color.alpha;
    }
    if (color?.strokeAlpha) {
      this.colorOption.strokeAlpha = color.strokeAlpha;
    }
    this.drawShape();
  }

  abstract drawShape(): void;
}
