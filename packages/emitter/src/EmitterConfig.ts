/* eslint-disable no-lonely-if */
import type { EaseSegment, SimpleEase } from './ParticleUtils';

/**
 * Full Emitter configuration for initializing an Emitter instance.
 */
export interface EmitterConfigV3 {
  /**
   * Random number configuration for picking the lifetime for each particle..
   */
  lifetime: RandNumber;
  /**
   * Easing to be applied to all interpolated or stepped values across the particle lifetime.
   */
  ease?: SimpleEase | EaseSegment[];
  /**
   * How many particles to spawn at once, each time that it is determined that particles should be spawned.
   * If omitted, only one particle will spawn at a time.
   */
  particlesPerWave?: number;
  /**
   * How often to spawn particles. This is a value in seconds, so a value of 0.5 would be twice a second.
   */
  frequency: number;
  /**
   * Defines a chance to not spawn particles. Values lower than 1 mean particles may not be spawned each time.
   * If omitted, particles will always spawn.
   */
  spawnChance?: number;
  /**
   * How long to run the Emitter before it stops spawning particles. If omitted, runs forever (or until told to stop
   * manually).
   */
  emitterLifetime?: number;
  /**
   * Maximum number of particles that can be alive at any given time for this emitter.
   */
  maxParticles?: number;
  /**
   * If newly spawned particles should be added to the back of the parent container (to make them less conspicuous
   * as they pop in). If omitted, particles will be added to the top of the container.
   */
  addAtBack?: boolean;
  /**
   * Default position to spawn particles from inside the parent container.
   */
  pos: { x: number; y: number };
  /**
   * If the emitter should start out emitting particles. If omitted, it will be treated as `true` and will emit particles
   * immediately.
   */
  emit?: boolean;
  /**
   * If the Emitter should hook into PixiJS's shared ticker. If this is false or emitted, you will be responsible for
   * connecting it to update ticks.
   */
  autoUpdate?: boolean;

  /**
   * The list of behaviors to apply to this emitter. See the behaviors namespace for
   * a list of built in behaviors. Custom behaviors may be registered with {@link Emitter.registerBehavior}.
   */
  behaviors: BehaviorEntry[];
}

/**
 * See {@link EmitterConfigV3.behaviors}
 */
export interface BehaviorEntry {
  /**
   * The behavior type, as defined as the static `type` property of a behavior class.
   */
  type: string;
  /**
   * Configuration data specific to that behavior.
   */
  config: any;
}

/**
 * Configuration for how to pick a random number (inclusive).
 */
export interface RandNumber {
  /**
   * Maximum pickable value.
   */
  max: number;
  /**
   * Minimum pickable value.
   */
  min: number;
}

export interface BasicTweenable<T> {
  start: T;
  end: T;
}
