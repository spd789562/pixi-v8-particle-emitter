import type { Particle } from '../../Particle';
import { rotatePoint } from '../../ParticleUtils';
import type { SpawnShape } from './SpawnShape';

/**
 * A class for spawning particles in a circle or ring.
 * Can optionally apply rotation to particles so that they are aimed away from the center of the circle.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'torus',
 *     data: {
 *          radius: 30,
 *          x: 0,
 *          y: 0,
 *          innerRadius: 10,
 *          rotation: true
 *     }
 * }
 * ```
 */
export class Torus implements SpawnShape {
  public static type = 'torus';
  /**
   * X position of the center of the shape.
   */
  public x: number;
  /**
   * Y position of the center of the shape.
   */
  public y: number;
  /**
   * Radius of circle, or outer radius of a ring.
   */
  public radius: number;
  /**
   * Inner radius of a ring. Use 0 to have a circle.
   */
  public innerRadius: number;
  /**
   * If rotation should be applied to particles.
   */
  public rotation: boolean;

  constructor(config: {
    /**
     * Radius of circle, or outer radius of a ring. Note that this uses the full name of 'radius',
     * where earlier versions of the library may have used 'r'.
     */
    radius: number;
    /**
     * X position of the center of the shape.
     */
    x: number;
    /**
     * Y position of the center of the shape.
     */
    y: number;
    /**
     * Inner radius of a ring. Omit, or use 0, to have a circle.
     */
    innerRadius?: number;
    /**
     * If rotation should be applied to particles, pointing them away from the center of the torus.
     * Defaults to false.
     */
    affectRotation?: boolean;
  }) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.radius = config.radius;
    this.innerRadius = config.innerRadius || 0;
    this.rotation = !!config.affectRotation;
  }

  getRandPos(particle: Particle): void {
    // place the particle at a random radius in the ring
    if (this.innerRadius !== this.radius) {
      particle.x =
        Math.random() * (this.radius - this.innerRadius) + this.innerRadius;
    } else {
      particle.x = this.radius;
    }
    particle.y = 0;
    // rotate the point to a random angle in the circle
    const angle = Math.random() * Math.PI * 2;

    if (this.rotation) {
      particle.rotation += angle;
    }
    rotatePoint(angle, particle);
    // now add in the center of the torus
    particle.x += this.x;
    particle.y += this.y;
  }
}
