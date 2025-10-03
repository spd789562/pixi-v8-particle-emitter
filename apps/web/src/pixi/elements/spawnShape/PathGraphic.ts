import type { PointData } from 'pixi.js';

import type { ShapeConfigRecord } from '@spd789562/particle-emitter';
import { BaseGraphic } from './BaseGraphic';

type PathConfig = ShapeConfigRecord['PolygonalChain']['config'];

export class PathGraphic extends BaseGraphic<PathConfig> {
  drawShape() {
    this.graphics.clear();
    const points = Array.isArray(this.config[0])
      ? (this.config as PointData[][])
      : ([this.config] as PointData[][]);

    for (const path of points) {
      this.graphics.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        this.graphics.lineTo(path[i].x, path[i].y);
      }
    }

    this.graphics.stroke({
      color: this.colorOption.stroke,
      pixelLine: true,
      alpha: this.colorOption.strokeAlpha,
    });
  }
}
