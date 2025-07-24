import type { Particle } from '../Particle';
import { PropertyList } from '../PropertyList';
import { PropertyNode, type ValueList } from '../PropertyNode';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';

/**
 * A Scale behavior that applies an interpolated or stepped list of values to the particle's x & y scale.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'scale',
 *     config: {
 *          scale: {
 *              list: [{value: 0, time: 0}, {value: 1, time: 0.25}, {value: 0, time: 1}],
 *              isStepped: true
 *          },
 *          minMult: 0.5
 *     }
 * }
 * ```
 */
export class ScaleBehavior implements IEmitterBehavior {
  public static type = 'scale' as const;

  public order = BehaviorOrder.Normal;
  private list: PropertyList<number>;
  private minMult: number;
  constructor(config: {
    /**
     * Scale of the particles, with a minimum value of 0
     */
    scale: ValueList<number>;
    /**
     * A value between minimum scale multipler and 1 is randomly
     * generated and multiplied with each scale value to provide the actual scale for each particle.
     */
    minMult: number;
  }) {
    this.list = new PropertyList(false);
    this.list.reset(PropertyNode.createList(config.scale));
    this.minMult = config.minMult ?? 1;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      const mult = Math.random() * (1 - this.minMult) + this.minMult;

      next.config.scaleMult = mult;
      next.scaleX = next.scaleY = this.list.first!.value * mult;

      next = next.next;
    }
  }

  updateParticle(particle: Particle): undefined {
    particle.scaleX = particle.scaleY =
      this.list.interpolate!(particle.agePercent) * particle.config.scaleMult;
  }
}

/**
 * A Scale behavior that applies a randomly picked value to the particle's x & y scale at initialization.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'scaleStatic',
 *     config: {
 *         min: 0.25,
 *         max: 0.75,
 *     }
 * }
 * ```
 */
export class StaticScaleBehavior implements IEmitterBehavior {
  public static type = 'scaleStatic' as const;

  public order = BehaviorOrder.Normal;
  private min: number;
  private max: number;
  constructor(config: {
    /**
     * Minimum scale of the particles, with a minimum value of 0
     */
    min: number;
    /**
     * Maximum scale of the particles, with a minimum value of 0
     */
    max: number;
  }) {
    this.min = config.min;
    this.max = config.max;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      const scale = Math.random() * (this.max - this.min) + this.min;

      next.scaleX = next.scaleY = scale;

      next = next.next;
    }
  }
}
