import type { Particle } from '../Particle';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';

/**
 * A Anchor behavior that applies a static x & y anchor at initialization.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'anchorStatic',
 *     config: {
 *         x: 0.5,
 *         y: 0.5,
 *     }
 * }
 * ```
 */
export class StaticAnchorBehavior implements IEmitterBehavior {
  public static type = 'anchorStatic' as const;

  public order = BehaviorOrder.Normal;
  private x: number;
  private y: number;
  constructor(config: {
    /**
     * x anchor of the particles
     */
    x: number;
    /**
     * y anchor of the particles
     */
    y: number;
  }) {
    this.x = config.x;
    this.y = config.y;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.anchorX = this.x;
      next.anchorY = this.y;

      next = next.next;
    }
  }
}
