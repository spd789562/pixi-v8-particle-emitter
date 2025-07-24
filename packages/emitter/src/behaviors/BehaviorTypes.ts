import type * as behaviors from './index';

type ExtractBehaviorConfig<T extends behaviors.IEmitterBehaviorClass> = {
  type: T['type'];
  config: T extends new (
    config: infer U,
  ) => behaviors.IEmitterBehavior
    ? U
    : never;
};

type GetBehaviorType<T> = T extends { type: infer U } ? U : never;

export type BehaviorType = GetBehaviorType<
  (typeof behaviors)[keyof typeof behaviors]
>;

type BehaviorConfigRecord = {
  [K in keyof typeof behaviors]: (typeof behaviors)[K] extends behaviors.IEmitterBehaviorClass
    ? ExtractBehaviorConfig<(typeof behaviors)[K]>
    : never;
};

/**
 * A utility type for correctly type for every behavior.
 *
 * @example
 * ```ts
 * const speedStaticConfig: BehaviorConfigs = {
 *   type: 'moveSpeedStatic',
 *   // will type error
 *   config: {
 *   }
 * }
 */
export type BehaviorConfigs = BehaviorConfigRecord[keyof BehaviorConfigRecord];
