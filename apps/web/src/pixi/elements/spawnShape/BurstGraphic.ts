import { BaseGraphic } from './BaseGraphic';
import type { SpawnBurstConfig } from './type';

export class BurstGraphic extends BaseGraphic<SpawnBurstConfig> {
  static burstLineLength: number;

  init() {
    BurstGraphic.burstLineLength = 100;
  }

  drawShape() {
    this.graphics.clear();
    const { spacing, start, distance } = this.config;
    const count = Math.floor(360 / spacing);
    let angle = (start * Math.PI) / 180;

    const destLength = (distance || 0) + BurstGraphic.burstLineLength;

    console.log(count, 'count', this.config, BurstGraphic.burstLineLength);

    for (let i = 0; i < count; i++) {
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;

      const endX = Math.cos(angle) * destLength;
      const endY = Math.sin(angle) * destLength;

      this.graphics.moveTo(startX, startY);
      this.graphics.lineTo(endX, endY);

      this.graphics.stroke({
        color: this.colorOption.stroke,
        pixelLine: true,
        alpha: this.colorOption.strokeAlpha,
      });

      angle += (spacing * Math.PI) / 180;
    }
  }
}
