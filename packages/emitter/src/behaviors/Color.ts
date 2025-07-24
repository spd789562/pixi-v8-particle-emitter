import { Color as PixiColor } from 'pixi.js';
import type { Particle } from '../Particle';
import type { Color } from '../ParticleUtils';
import { PropertyList } from '../PropertyList';
import { PropertyNode, type ValueList } from '../PropertyNode';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';

/**
 * A Color behavior that applies an interpolated or stepped list of values to the particle's tint property.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'color',
 *     config: {
 *         color: {
 *              list: [{value: '#ff0000' time: 0}, {value: '#00ff00', time: 0.5}, {value: '#0000ff', time: 1}]
 *         },
 *     }
 * }
 * ```
 */
export class ColorBehavior implements IEmitterBehavior {
  public static type = 'color' as const;

  public order = BehaviorOrder.Normal;
  private list: PropertyList<Color>;
  constructor(config: {
    /**
     * Color of the particles as 6 digit hex codes.
     */
    color: ValueList<string>;
  }) {
    this.list = new PropertyList(true);
    this.list.reset(PropertyNode.createList(config.color));
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;
    const color = this.list.first!.value;

    while (next) {
      next.tint = PixiColor.shared.setValue(color);
      next = next.next;
    }
  }

  updateParticle(particle: Particle): undefined {
    const color = this.list.interpolate!(particle.agePercent);
    particle.tint = PixiColor.shared.setValue(color);
  }
}

/**
 * A Color behavior that applies a single color to the particle's tint property at initialization.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'colorStatic',
 *     config: {
 *         color: '#ffff00',
 *     }
 * }
 * ```
 */
export class StaticColorBehavior implements IEmitterBehavior {
  public static type = 'colorStatic' as const;

  public order = BehaviorOrder.Normal;
  private value: PixiColor;
  constructor(config: {
    /**
     * Color of the particles as 6 digit hex codes.
     */
    color: string;
  }) {
    const color = new PixiColor(config.color);

    this.value = color;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.tint = this.value;
      next = next.next;
    }
  }
}
