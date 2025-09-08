import type { ShapeConfigRecord } from '@repo/emitter';
import { BaseGraphic } from './BaseGraphic';

type RectConfig = ShapeConfigRecord['Rectangle']['config'];

export class RectGraphic extends BaseGraphic<RectConfig> {
  drawShape() {
    this.graphics.clear();
    this.graphics.rect(
      this.config.x,
      this.config.y,
      Math.max(this.config.w, 1),
      Math.max(this.config.h, 1),
    );
    this.graphics.fill({
      color: this.colorOption.fill,
      alpha: this.colorOption.alpha,
    });
    this.graphics.stroke({
      color: this.colorOption.stroke,
      pixelLine: true,
      alpha: this.colorOption.strokeAlpha,
    });
  }
}
