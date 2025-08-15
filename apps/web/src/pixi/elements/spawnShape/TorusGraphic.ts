import type { ShapeConfigRecord } from '@repo/emitter';
import { BaseGraphic } from './BaseGraphic';

type TorusConfig = ShapeConfigRecord['Torus']['config'];

export class TorusGraphic extends BaseGraphic<TorusConfig> {
  drawShape() {
    this.graphics.clear();

    if (this.config.innerRadius) {
      this.graphics.circle(
        this.config.x,
        this.config.y,
        this.config.innerRadius,
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
    // this.graphics.fill({
    //   color: this.colorOption.fill,
    //   alpha: this.colorOption.alpha,
    // });
  }
}
