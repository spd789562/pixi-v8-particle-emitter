import type { ShapeConfigRecord } from '@repo/emitter';
import { BaseGraphic } from './BaseGraphic';

type TorusConfig = ShapeConfigRecord['Torus']['config'];

export class TorusGraphic extends BaseGraphic<TorusConfig> {
  drawShape() {
    this.graphics.clear();

    const hasInnerRadius =
      this.config.innerRadius && this.config.innerRadius > 0;
    if (hasInnerRadius) {
      this.graphics.circle(
        this.config.x,
        this.config.y,
        this.config.innerRadius!,
      );
      this.graphics.stroke({
        color: this.colorOption.stroke,
        pixelLine: true,
        alpha: this.colorOption.strokeAlpha,
      });
    }
    this.graphics.circle(this.config.x, this.config.y, this.config.radius);
    this.graphics.stroke({
      color: this.colorOption.stroke,
      pixelLine: true,
      alpha: this.colorOption.strokeAlpha,
    });
    if (!hasInnerRadius) {
      this.graphics.fill({
        color: this.colorOption.fill,
        alpha: this.colorOption.alpha,
      });
    }
  }
}
