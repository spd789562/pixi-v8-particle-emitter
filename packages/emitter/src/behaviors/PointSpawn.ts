import type { Particle } from '../Particle';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';

/**
 * A Spawn behavior that sends particles out from a single point at the emitter's position.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'spawnPoint',
 *     config: {}
 * }
 * ```
 */
export class PointSpawnBehavior implements IEmitterBehavior {
  public static type = 'spawnPoint' as const;

  order = BehaviorOrder.Spawn;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initParticles(_first: Particle): undefined {
    // really just a no-op
  }
}
