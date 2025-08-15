import { createEffect, on } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Container, type ContainerChild } from 'pixi.js';
import { trackDeep } from '@solid-primitives/deep';

import { BurstGraphic } from './spawnShape/BurstGraphic';
import { TorusGraphic } from './spawnShape/TorusGraphic';
import { RectGraphic } from './spawnShape/RectGraphic';
import { PathGraphic } from './spawnShape/PathGraphic';
import { SpawnPoint } from './spawnShape/SpawnPoint';
import type { ISpawnShapeContainer } from './spawnShape/type';

import {
  type SpawnType,
  enabledConfig,
  spawnPosition,
  spawnRectConfig,
  spawnTorusConfig,
  spawnPathConfig,
  spawnBurstConfig,
} from '@/store/config';
import { debugColor, spawnPointColor } from '@/store/debug';

export class DebugSpawn extends Container {
  private spawnRecord: Record<SpawnType, ISpawnShapeContainer<any>>;
  public spawnPoint: SpawnPoint;
  public shapeContainer: Container;

  constructor() {
    super();
    const spawnPoint = new SpawnPoint(14, { ...spawnPointColor });
    this.spawnPoint = spawnPoint;
    this.addChild(spawnPoint);

    const shapeContainer = new Container();
    this.shapeContainer = shapeContainer;
    this.addChild(shapeContainer);

    this.spawnRecord = {
      point: spawnPoint,
      rect: new RectGraphic({ ...spawnRectConfig }),
      torus: new TorusGraphic({ ...spawnTorusConfig }),
      polygonalChain: new PathGraphic(unwrap(spawnPathConfig), {
        ...debugColor,
      }),
      spawnBurst: new BurstGraphic({ ...spawnBurstConfig }),
    };
    this.listenConfig();
    this.listenPosition();
  }
  listenConfig() {
    createEffect(
      on(
        () => trackDeep(spawnRectConfig),
        () => {
          this.spawnRecord.rect.updateConfig(
            unwrap(spawnRectConfig),
            unwrap(debugColor),
          );
        },
      ),
    );
    createEffect(
      on(
        () => trackDeep(spawnTorusConfig),
        () => {
          this.spawnRecord.torus.updateConfig(
            unwrap(spawnTorusConfig),
            unwrap(debugColor),
          );
        },
      ),
    );
    createEffect(
      on(
        () => trackDeep(spawnPathConfig),
        () => {
          this.spawnRecord.polygonalChain.updateConfig(
            unwrap(spawnPathConfig),
            unwrap(debugColor),
          );
        },
      ),
    );
    createEffect(
      on(
        () => trackDeep(spawnBurstConfig),
        () => {
          this.spawnRecord.spawnBurst.updateConfig(
            unwrap(spawnBurstConfig),
            unwrap(debugColor),
          );
        },
      ),
    );
    createEffect(
      on(
        () => trackDeep(spawnPointColor),
        () => {
          this.spawnPoint.updateConfig(10, unwrap(spawnPointColor));
        },
      ),
    );
    createEffect(
      on(
        () => trackDeep(debugColor),
        () => {
          if (enabledConfig.spawnType === 'point') {
            return;
          }
          const current = this.spawnRecord[enabledConfig.spawnType];
          current.updateConfig(current.config, unwrap(debugColor));
        },
      ),
    );
    createEffect(
      on(
        () => enabledConfig.spawnType,
        () => {
          if (enabledConfig.spawnType === 'point') {
            return;
          }
          const current = this.spawnRecord[enabledConfig.spawnType];
          current.updateConfig(current.config, unwrap(debugColor));
          this.shapeContainer.removeChildren();
          this.shapeContainer.addChild(current as unknown as ContainerChild);
        },
      ),
    );
  }
  listenPosition() {
    createEffect(() => {
      const position = trackDeep(spawnPosition);
      this.position.set(position.x, position.y);
    });
  }
}
