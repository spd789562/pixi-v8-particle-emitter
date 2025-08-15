import type { ColorSource, Color } from 'pixi.js';
import type { BehaviorConfigRecord } from '@repo/emitter';

export type SpawnBurstConfig =
  BehaviorConfigRecord['BurstSpawnBehavior']['config'];

export interface SpawnShapeColorOption {
  fill: ColorSource;
  stroke: ColorSource;
  alpha: number;
  strokeAlpha: number;
}

export interface ISpawnShapeContainer<T> {
  config: T;
  colorOption: {
    fill: Color;
    stroke: Color;
    alpha: number;
    strokeAlpha: number;
  };
  updateConfig(config: T, color?: Partial<SpawnShapeColorOption>): void;
}
