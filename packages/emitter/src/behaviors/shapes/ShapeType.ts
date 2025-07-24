import type * as shapes from './index';

type ExtractShapeConfig<T extends shapes.SpawnShapeClass> = {
  type: T['type'];
  config: T extends new (config: infer U) => shapes.SpawnShape ? U : never;
};

export type ShapeType = (typeof shapes)[keyof typeof shapes]['type'];

type ShapeConfigRecord = {
  [K in keyof typeof shapes]: ExtractShapeConfig<(typeof shapes)[K]>;
};

export type ShapeConfigs = ShapeConfigRecord[keyof ShapeConfigRecord];
