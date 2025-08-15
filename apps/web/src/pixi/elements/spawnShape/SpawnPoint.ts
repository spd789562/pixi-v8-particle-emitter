import { Container, Graphics, Color } from 'pixi.js';

import type { SpawnShapeColorOption, ISpawnShapeContainer } from './type';

export class SpawnPoint
  extends Container
  implements ISpawnShapeContainer<number>
{
  config: number;
  colorOption: {
    stroke: Color;
    fill: Color;
    alpha: number;
    strokeAlpha: number;
  };
  private graphics: Graphics;

  constructor(size: number, color?: Partial<SpawnShapeColorOption>) {
    super();

    this.config = size;
    this.colorOption = {
      stroke: new Color(color?.stroke ?? 0x000000),
      fill: new Color(color?.fill ?? 0x000000),
      alpha: color?.alpha ?? 1,
      strokeAlpha: color?.strokeAlpha ?? 1,
    };

    const graphics = new Graphics();
    this.graphics = graphics;
    this.updateConfig(size);

    this.addChild(graphics);
  }

  updateConfig(size: number, color?: Partial<SpawnShapeColorOption>) {
    this.config = size;

    if (color?.stroke) {
      console.log(color.stroke, 'color.stroke');
      this.colorOption.stroke.setValue(color.stroke);
    }

    this.graphics.clear();
    this.graphics.moveTo(-size / 2, 0);
    this.graphics.lineTo(size / 2, 0);
    this.graphics.moveTo(0, -size / 2);
    this.graphics.lineTo(0, size / 2);
    this.graphics.closePath();
    this.graphics.stroke({
      color: this.colorOption.stroke,
      pixelLine: true,
      alpha: this.colorOption.strokeAlpha,
    });
  }
}
