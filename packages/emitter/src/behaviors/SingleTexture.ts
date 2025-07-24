import type { Texture } from 'pixi.js';
import type { Particle } from '../Particle';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';
import { GetTextureFromString } from '../ParticleUtils';

/**
 * A Textuure behavior that assigns a single texture to each particle.
 * String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'textureSingle',
 *     config: {
 *         texture: Texture.from('myTexId'),
 *     }
 * }
 * ```
 */
export class SingleTextureBehavior implements IEmitterBehavior {
  public static type = 'textureSingle' as const;

  public order = BehaviorOrder.Normal;
  private texture: Texture;
  constructor(config: {
    /**
     * Image to use for each particle.
     */
    texture: Texture | string;
  }) {
    this.texture =
      typeof config.texture === 'string'
        ? GetTextureFromString(config.texture)
        : config.texture;
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.texture = this.texture;

      next = next.next;
    }
  }
}
