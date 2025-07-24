import type { Texture } from 'pixi.js';
import type { Particle } from '../Particle';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';
import { parseTextures } from '../ParticleUtils';

/**
 * A Texture behavior that assigns a texture to each particle from its list, in order, before looping around to the first
 * texture again. String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'textureOrdered',
 *     config: {
 *         textures: ["myTex1Id", "myTex2Id", "myTex3Id", "myTex4Id"],
 *     }
 * }
 * ```
 */
export class OrderedTextureBehavior implements IEmitterBehavior {
  public static type = 'textureOrdered' as const;

  public order = BehaviorOrder.Normal;
  private textures: Texture[];
  private index: number;
  constructor(config: {
    /**
     * Images to use for each particle, used in order before looping around
     */
    textures: (Texture | string)[];
  }) {
    this.index = 0;
    this.textures = parseTextures(config.textures);
  }

  initParticles(first: Particle): undefined {
    let next: Particle | undefined = first;

    while (next) {
      next.texture = this.textures[this.index];
      if (++this.index >= this.textures.length) {
        this.index = 0;
      }
      next = next.next;
    }
  }
}
