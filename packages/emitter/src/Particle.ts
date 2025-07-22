import { Particle as PixiParticle, type ParticleContainer } from 'pixi.js';
import type { Emitter } from './Emitter';
/**
 * An individual particle image. You shouldn't have to deal with these.
 */
export class Particle extends PixiParticle {
  /**
   * The emitter that controls this particle.
   */
  public emitter: Emitter;
  /**
   * The maximum lifetime of this particle, in seconds.
   */
  public maxLife: number;
  /**
   * The current age of the particle, in seconds.
   */
  public age: number;
  /**
   * The current age of the particle as a normalized value between 0 and 1.
   */
  public agePercent: number;
  /**
   * One divided by the max life of the particle, saved for slightly faster math.
   */
  public oneOverLife: number;
  /**
   * Reference to the next particle in the list.
   */
  public next?: Particle;

  /**
   * Reference to the previous Particle in the list.
   */
  public prev?: Particle;

  /**
   * Static per-particle configuration for behaviors to use. Is not cleared when recycling.
   */
  public config: { [key: string]: any };

  public parent?: ParticleContainer;

  /**
   * @param emitter The emitter that controls this particle.
   */
  constructor(emitter: Emitter) {
    // start off the sprite with a blank texture, since we are going to replace it
    // later when the particle is initialized.
    super(emitter.particleImages[0]);

    this.emitter = emitter;
    this.config = {};
    // particles should be centered
    this.anchorX = this.anchorY = 0.5;
    this.maxLife = 0;
    this.age = 0;
    this.agePercent = 0;
    this.oneOverLife = 0;
    // save often used functions on the instance instead of the prototype for better speed
    this.init = this.init;
    this.kill = this.kill;
  }

  /**
   * Initializes the particle for use, based on the properties that have to
   * have been set already on the particle.
   */
  public init(maxLife: number): void {
    this.maxLife = maxLife;
    // reset the age
    this.age = this.agePercent = 0;
    // reset the sprite props
    this.rotation = 0;
    this.x = this.y = 0;
    this.scaleX = this.scaleY = 1;
    this.tint = 0xffffff;
    this.alpha = 1;
    // save our lerp helper
    this.oneOverLife = 1 / this.maxLife;
  }

  public appendTo(parent: ParticleContainer): void {
    this.parent?.removeParticle(this);
    this.parent = parent;
    parent.addParticle(this);
  }

  public appendAt(parent: ParticleContainer, index: number): void {
    this.parent?.removeParticle(this);
    this.parent = parent;
    parent.addParticleAt(this, index);
  }

  public removeFromParent(): void {
    this.alpha = 0;
    this.parent?.removeParticle(this);
    this.parent = undefined;
  }

  /**
   * Kills the particle, removing it from the display list
   * and telling the emitter to recycle it.
   */
  public kill(): void {
    // TODO: fix recycle in emitter
    this.emitter.recycle(this);
  }

  /**
   * Destroys the particle, removing references and preventing future use.
   */
  public destroy(): void {
    this.removeFromParent();
    // fix the link
    if (this.next && this.prev) {
      this.next.prev = this.prev;
      this.prev.next = this.next;
    }
    // @ts-expect-error destroy should be safe to do cleanup
    this.emitter = this.next = this.prev = null;
  }
}
