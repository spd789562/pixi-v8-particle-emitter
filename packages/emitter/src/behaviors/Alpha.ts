import type { Particle } from '../Particle';
import { PropertyList } from '../PropertyList';
import { PropertyNode, type ValueList } from '../PropertyNode';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';

/**
 * An Alpha behavior that applies an interpolated or stepped list of values to the particle's opacity.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'alpha',
 *     config: {
 *         alpha: {
 *              list: [{value: 0, time: 0}, {value: 1, time: 0.25}, {value: 0, time: 1}]
 *         },
 *     }
 * }
 * ```
 */
export class AlphaBehavior implements IEmitterBehavior {
  public static type = 'alpha' as const;

  public order = BehaviorOrder.Normal;
  private list: PropertyList<number>;
  constructor(config: {
    /**
     * Transparency of the particles from 0 (transparent) to 1 (opaque)
     */
    alpha: ValueList<number>;
  }) {
    this.list = new PropertyList(false);
    this.list.reset(PropertyNode.createList(config.alpha));
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.alpha = this.list.first!.value;
      next = next.next!;
    }
  }

  updateParticle(particle: Particle): undefined {
    particle.alpha = this.list.interpolate!(particle.agePercent);
  }
}

/**
 * An Alpha behavior that applies a static value to the particle's opacity at particle initialization.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'alphaStatic',
 *     config: {
 *         alpha: 0.75,
 *     }
 * }
 * ```
 */
export class StaticAlphaBehavior implements IEmitterBehavior {
  public static type = 'alphaStatic' as const;

  public order = BehaviorOrder.Normal;
  private value: number;
  constructor(config: {
    /**
     * Transparency of the particles from 0 (transparent) to 1 (opaque)
     */
    alpha: number;
  }) {
    this.value = config.alpha;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.alpha = this.value;
      next = next.next!;
    }
  }
}
