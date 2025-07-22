import type { Texture } from 'pixi.js';
import type { Particle } from '../Particle';
import { type IEmitterBehavior, BehaviorOrder } from './Behaviors';
import { parseTextures } from '../ParticleUtils';

/**
 * A Texture behavior that assigns a random texture to each particle from its list.
 * String values will be converted to textures with {@link ParticleUtils.GetTextureFromString}.
 * and ensure the textures are from the same source.
 *
 * Example config:
 * ```javascript
 * {
 *     type: 'textureRandom',
 *     config: {
 *         textures: ["myTex1Id", "myTex2Id", "myTex3Id", "myTex4Id"],
 *     }
 * }
 * ```
 */
export class RandomTextureBehavior implements IEmitterBehavior {
  public static type = 'textureRandom';

  public order = BehaviorOrder.Normal;
  private textures: Texture[];
  constructor(config: {
    /**
     * Images to use for each particle, randomly chosen from the list.
     */
    textures: Texture[] | string[] | string | Texture;
  }) {
    this.textures = parseTextures(config.textures);
  }

  initParticles(first: Particle): void {
    let next: Particle | undefined = first;

    while (next) {
      const index = Math.floor(Math.random() * this.textures.length);

      console.log(this.textures[index]);

      next.texture = this.textures[index];

      next = next.next;
    }
  }
}
