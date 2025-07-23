import { type ParticleContainer, Point, Ticker, type Texture } from 'pixi.js';
import {
  generateEase,
  rotatePoint,
  parseTextures,
  type SimpleEase,
} from './ParticleUtils';
import { Particle } from './Particle';
import type { EmitterConfigV3 } from './EmitterConfig';
import {
  BehaviorOrder,
  type IEmitterBehavior,
  type IEmitterBehaviorClass,
} from './behaviors/Behaviors';
// get the shared ticker
/**
 * @hidden
 */
const ticker = Ticker.shared;

/**
 * Key used in sorted order to determine when to set particle position from the emitter position
 * and rotation.
 */
const PositionParticle = Symbol('Position particle per emitter position');

/**
 * A particle emitter.
 */
export class Emitter {
  private static knownBehaviors: { [key: string]: IEmitterBehaviorClass } = {};

  /**
   * Registers a new behavior, so that it will be recognized when initializing emitters.
   * Behaviors registered later with duplicate types will override older ones, although there is no limit on
   * the allowed types.
   * @param behaviorClass The behavior class to register.
   */
  public static registerBehavior(behaviorClass: IEmitterBehaviorClass): void {
    Emitter.knownBehaviors[behaviorClass.type] = behaviorClass;
  }

  /**
   * Active initialization behaviors for this emitter.
   */
  protected initBehaviors: (IEmitterBehavior | typeof PositionParticle)[];
  /**
   * Active update behaviors for this emitter.
   */
  protected updateBehaviors: IEmitterBehavior[];
  /**
   * Active recycle behaviors for this emitter.
   */
  protected recycleBehaviors: IEmitterBehavior[];
  // properties for individual particles
  /**
   * The minimum lifetime for a particle, in seconds.
   */
  public minLifetime: number;
  /**
   * The maximum lifetime for a particle, in seconds.
   */
  public maxLifetime: number;
  /**
   * An easing function for nonlinear interpolation of values. Accepts a single
   * parameter of time as a value from 0-1, inclusive. Expected outputs are values
   * from 0-1, inclusive.
   */
  public customEase?: SimpleEase;
  // properties for spawning particles
  /**
   * Time between particle spawns in seconds.
   */
  protected _frequency: number;
  /**
   * Chance that a particle will be spawned on each opportunity to spawn one.
   * 0 is 0%, 1 is 100%.
   */
  public spawnChance: number;
  /**
   * Maximum number of particles to keep alive at a time. If this limit
   * is reached, no more particles will spawn until some have died.
   */
  public maxParticles: number;
  /**
   * The amount of time in seconds to emit for before setting emit to false.
   * A value of -1 is an unlimited amount of time.
   */
  public emitterLifetime: number;
  /**
   * Position at which to spawn particles, relative to the emitter's owner's origin.
   * For example, the flames of a rocket travelling right might have a spawnPos
   * of {x:-50, y:0}.
   * to spawn at the rear of the rocket.
   * To change this, use updateSpawnPos().
   */
  public spawnPos: Point;
  /**
   * Number of particles to spawn time that the frequency allows for particles to spawn.
   */
  public particlesPerWave: number;
  /**
   * Rotation of the emitter or emitter's owner in degrees. This is added to
   * the calculated spawn angle.
   * To change this, use rotate().
   */
  protected rotation: number;
  /**
   * The world position of the emitter's owner, to add spawnPos to when
   * spawning particles. To change this, use updateOwnerPos().
   */
  protected ownerPos: Point;
  /**
   * The origin + spawnPos in the previous update, so that the spawn position
   * can be interpolated to space out particles better.
   */
  protected _prevEmitterPos: Point;
  /**
   * If _prevEmitterPos is valid, to prevent interpolation on the first update
   */
  protected _prevPosIsValid: boolean;
  /**
   * If either ownerPos or spawnPos has changed since the previous update.
   */
  protected _posChanged: boolean;
  /**
   * The container to add particles to.
   */
  protected _parent: ParticleContainer | undefined;
  /**
   * If particles should be added at the back of the display list instead of the front.
   */
  public addAtBack: boolean;
  /**
   * The current number of active particles.
   */
  public particleCount: number;
  /**
   * If particles should be emitted during update() calls. Setting this to false
   * stops new particles from being created, but allows existing ones to die out.
   */
  protected _emit: boolean;
  /**
   * The timer for when to spawn particles in seconds, where numbers less
   * than 0 mean that particles should be spawned.
   */
  protected _spawnTimer: number;
  /**
   * The life of the emitter in seconds.
   */
  protected _emitterLife: number;
  /**
   * The particles that are active and on the display list. This is the first particle in a
   * linked list.
   */
  protected _activeParticlesFirst?: Particle;
  /**
   * The particles that are active and on the display list. This is the last particle in a
   * linked list.
   */
  protected _activeParticlesLast?: Particle;
  /**
   * The particles that are not currently being used. This is the first particle in a
   * linked list.
   */
  protected _poolFirst?: Particle;
  /**
   * The original config object that this emitter was initialized with.
   */
  protected _origConfig?: any;
  /**
   * If the update function is called automatically from the shared ticker.
   * Setting this to false requires calling the update function manually.
   */
  protected _autoUpdate: boolean;
  /**
   * If the emitter should destroy itself when all particles have died out. This is set by
   * playOnceAndDestroy();
   */
  protected _destroyWhenComplete: boolean;
  /**
   * A callback for when all particles have died out. This is set by
   * playOnceAndDestroy() or playOnce();
   */
  protected _completeCallback?: () => void;

  private _particleImages: Texture[];

  /**
   * @param particleParent The container to add the particles to.
   * @param particleImages A texture or array of textures to use
   *                       for the particles. Strings will be turned
   *                       into textures via Texture.from().
   * @param config A configuration object containing settings for the emitter.
   * @param config.emit If config.emit is explicitly passed as false, the
   *                    Emitter will start disabled.
   * @param config.autoUpdate If config.autoUpdate is explicitly passed as
   *                          true, the Emitter will automatically call
   *                          update via the PIXI shared ticker.
   */
  constructor(
    particleParent: ParticleContainer,
    particleImages: Texture | Texture[] | string | string[],
    config: EmitterConfigV3,
  ) {
    this.initBehaviors = [];
    this.updateBehaviors = [];
    this.recycleBehaviors = [];
    // properties for individual particles
    this.minLifetime = 0;
    this.maxLifetime = 0;
    this.customEase = undefined;
    // properties for spawning particles
    this._frequency = 1;
    this.spawnChance = 1;
    this.maxParticles = 1000;
    this.emitterLifetime = -1;
    this.spawnPos = new Point();
    this.particlesPerWave = 1;
    // emitter properties
    this.rotation = 0;
    this.ownerPos = new Point();
    this._prevEmitterPos = new Point();
    this._prevPosIsValid = false;
    this._posChanged = false;
    this._parent = undefined;
    this.addAtBack = false;
    this.particleCount = 0;
    this._emit = false;
    this._spawnTimer = 0;
    this._emitterLife = -1;
    // this._activeParticlesFirst = undefined;
    // this._activeParticlesLast = undefined;
    // this._poolFirst = undefined;
    this._origConfig = undefined;
    this._autoUpdate = false;
    this._destroyWhenComplete = false;
    this._completeCallback = undefined;
    this._particleImages = [];

    // set the initial parent
    this.parent = particleParent;

    this.particleImages = particleImages;
    this.init(config);
    // save often used functions on the instance instead of the prototype for better speed
    this.recycle = this.recycle;
    this.update = this.update;
    this.rotate = this.rotate;
    this.updateSpawnPos = this.updateSpawnPos;
    this.updateOwnerPos = this.updateOwnerPos;
  }

  /**
   * Time between particle spawns in seconds. If this value is not a number greater than 0,
   * it will be set to 1 (particle per second) to prevent infinite loops.
   */
  public get frequency(): number {
    return this._frequency;
  }
  public set frequency(value: number) {
    // do some error checking to prevent infinite loops
    if (typeof value === 'number' && value > 0) {
      this._frequency = value;
    } else {
      this._frequency = 1;
    }
  }

  /**
   * The container to add particles to. Settings this will dump any active particles.
   */
  public get parent(): ParticleContainer | undefined {
    return this._parent;
  }
  public set parent(value: ParticleContainer | undefined) {
    this.cleanup();
    this._parent = value;
  }

  public get particleImages(): Texture[] {
    return this._particleImages;
  }
  public set particleImages(value: Texture[] | string[] | string | Texture) {
    this._particleImages = parseTextures(value);
  }

  /**
   * Sets up the emitter based on the config settings.
   * @param config A configuration object containing settings for the emitter.
   */
  public init(config: EmitterConfigV3): void {
    if (!config) {
      return;
    }
    // clean up any existing particles
    this.cleanup();

    // store the original config and particle images, in case we need to re-initialize
    // when the particle constructor is changed
    this._origConfig = config;

    // /////////////////////////
    // Particle Properties    //
    // /////////////////////////

    // set up the lifetime
    this.minLifetime = config.lifetime.min;
    this.maxLifetime = config.lifetime.max;
    // use the custom ease if provided
    if (config.ease) {
      this.customEase =
        typeof config.ease === 'function'
          ? config.ease
          : generateEase(config.ease);
    } else {
      this.customEase = undefined;
    }
    // ////////////////////////
    // Emitter Properties    //
    // ////////////////////////
    // reset spawn type specific settings
    this.particlesPerWave = 1;
    if (config.particlesPerWave && config.particlesPerWave > 1) {
      this.particlesPerWave = config.particlesPerWave;
    }
    // set the spawning frequency
    this.frequency = config.frequency;
    this.spawnChance =
      typeof config.spawnChance === 'number' && config.spawnChance > 0
        ? config.spawnChance
        : 1;
    // set the emitter lifetime
    this.emitterLifetime = config.emitterLifetime || -1;
    // set the max particles
    const maxParticles = config.maxParticles ?? 0;
    this.maxParticles = maxParticles > 0 ? maxParticles : 1000;
    // determine if we should add the particle at the back of the list or not
    this.addAtBack = !!config.addAtBack;
    // reset the emitter position and rotation variables
    this.rotation = 0;
    this.ownerPos.set(0);
    if (config.pos) {
      this.spawnPos.copyFrom(config.pos);
    } else {
      this.spawnPos.set(0);
    }

    this._prevEmitterPos.copyFrom(this.spawnPos);
    // previous emitter position is invalid and should not be used for interpolation
    this._prevPosIsValid = false;
    // start emitting
    this._spawnTimer = 0;
    this.emit = config.emit === undefined ? true : !!config.emit;
    this.autoUpdate = !!config.autoUpdate;

    // ////////////////////////
    // Behaviors             //
    // ////////////////////////
    const behaviors: (IEmitterBehavior | typeof PositionParticle)[] =
      config.behaviors
        .map((data) => {
          const behaviorClass = Emitter.knownBehaviors[data.type];

          if (!behaviorClass) {
            console.error(`Unknown behavior: ${data.type}`);

            return null;
          }
          return new behaviorClass(data.config);
        })
        .filter((b) => !!b);

    behaviors.push(PositionParticle);
    behaviors.sort((a, b) => {
      if (a === PositionParticle) {
        return (b as IEmitterBehavior).order === BehaviorOrder.Spawn ? 1 : -1;
      } else if (b === PositionParticle) {
        return (a as IEmitterBehavior).order === BehaviorOrder.Spawn ? -1 : 1;
      }

      return (a as IEmitterBehavior).order - (b as IEmitterBehavior).order;
    });
    this.initBehaviors = behaviors.slice();
    this.updateBehaviors = behaviors.filter(
      (b) => b !== PositionParticle && b.updateParticle,
    ) as IEmitterBehavior[];
    this.recycleBehaviors = behaviors.filter(
      (b) => b !== PositionParticle && b.recycleParticle,
    ) as IEmitterBehavior[];
  }

  /**
   * Gets the instantiated behavior of the specified type, if it is present on this emitter.
   * @param type The behavior type to find.
   */
  public getBehavior(type: string): IEmitterBehavior | null {
    // bail if we don't know about such an emitter
    if (!Emitter.knownBehaviors[type]) return null;

    // find one that is an instance of the specified type
    return (
      (this.initBehaviors.find(
        (b) => b instanceof Emitter.knownBehaviors[type],
      ) as IEmitterBehavior) || null
    );
  }

  /**
   * Fills the pool with the specified number of particles, so that they don't have to be instantiated later.
   * @param count The number of particles to create.
   */
  public fillPool(count: number): void {
    for (; count > 0; --count) {
      const p = new Particle(this);

      p.next = this._poolFirst;
      this._poolFirst = p;
    }
  }

  /**
   * Recycles an individual particle. For internal use only.
   * @param particle The particle to recycle.
   * @param fromCleanup If this is being called to manually clean up all particles.
   * @internal
   */
  public recycle(particle: Particle, fromCleanup = false): void {
    for (let i = 0; i < this.recycleBehaviors.length; ++i) {
      this.recycleBehaviors[i].recycleParticle?.(particle, !fromCleanup);
    }
    if (particle.next) {
      particle.next.prev = particle.prev;
    }
    if (particle.prev) {
      particle.prev.next = particle.next;
    }
    if (particle === this._activeParticlesLast) {
      this._activeParticlesLast = particle.prev;
    }
    if (particle === this._activeParticlesFirst) {
      this._activeParticlesFirst = particle.next;
    }
    // add to pool
    particle.prev = undefined;
    particle.next = this._poolFirst;
    this._poolFirst = particle;
    // remove child from display, or make it invisible if it is in a ParticleContainer
    particle.removeFromParent();
    // decrease count
    --this.particleCount;
  }

  /**
   * Sets the rotation of the emitter to a new value. This rotates the spawn position in addition
   * to particle direction.
   * @param newRot The new rotation, in degrees.
   */
  public rotate(newRot: number): void {
    if (this.rotation === newRot) return;
    // caclulate the difference in rotation for rotating spawnPos
    const diff = newRot - this.rotation;

    this.rotation = newRot;
    // rotate spawnPos
    rotatePoint(diff, this.spawnPos);
    // mark the position as having changed
    this._posChanged = true;
  }

  /**
   * Changes the spawn position of the emitter.
   * @param x The new x value of the spawn position for the emitter.
   * @param y The new y value of the spawn position for the emitter.
   */
  public updateSpawnPos(x: number, y: number): void {
    this._posChanged = true;
    this.spawnPos.x = x;
    this.spawnPos.y = y;
  }

  /**
   * Changes the position of the emitter's owner. You should call this if you are adding
   * particles to the world container that your emitter's owner is moving around in.
   * @param x The new x value of the emitter's owner.
   * @param y The new y value of the emitter's owner.
   */
  public updateOwnerPos(x: number, y: number): void {
    this._posChanged = true;
    this.ownerPos.x = x;
    this.ownerPos.y = y;
  }

  /**
   * Prevents emitter position interpolation in the next update.
   * This should be used if you made a major position change of your emitter's owner
   * that was not normal movement.
   */
  public resetPositionTracking(): void {
    this._prevPosIsValid = false;
  }

  /**
   * If particles should be emitted during update() calls. Setting this to false
   * stops new particles from being created, but allows existing ones to die out.
   */
  public get emit(): boolean {
    return this._emit;
  }
  public set emit(value: boolean) {
    this._emit = !!value;
    this._emitterLife = this.emitterLifetime;
  }

  /**
   * If the update function is called automatically from the shared ticker.
   * Setting this to false requires calling the update function manually.
   */
  public get autoUpdate(): boolean {
    return this._autoUpdate;
  }
  public set autoUpdate(value: boolean) {
    if (this._autoUpdate && !value) {
      ticker.remove(this.updateByTicker, this);
    } else if (!this._autoUpdate && value) {
      ticker.add(this.updateByTicker, this);
    }
    this._autoUpdate = !!value;
  }

  /**
   * Starts emitting particles, sets autoUpdate to true, and sets up the Emitter to destroy itself
   * when particle emission is complete.
   * @param callback Callback for when emission is complete (all particles have died off)
   */
  public playOnceAndDestroy(callback?: () => void): void {
    this.autoUpdate = true;
    this.emit = true;
    this._destroyWhenComplete = true;
    this._completeCallback = callback;
  }

  /**
   * Starts emitting particles and optionally calls a callback when particle emission is complete.
   * @param callback Callback for when emission is complete (all particles have died off)
   */
  public playOnce(callback?: () => void): void {
    this.emit = true;
    this._completeCallback = callback;
  }

  /**
   * Pixi V8 Ticker.add will passing Ticker as the first argument. if you want to directly attach the update
   * to Ticker like `ticker.add(emitter.updateByTicker, emitter)`
   */
  public updateByTicker(delta: Ticker): void {
    this.update(delta.elapsedMS * 0.001);
  }

  /**
   * Updates all particles spawned by this emitter and emits new ones.
   * @param delta Time elapsed since the previous frame, in __seconds__.
   */
  public update(delta: number): void {
    // if we don't have a parent to add particles to, then don't do anything.
    // this also works as a isDestroyed check
    if (!this._parent) return;

    // == update existing particles ==

    // update all particle lifetimes before turning them over to behaviors
    for (
      let particle = this._activeParticlesFirst, next: Particle | undefined;
      particle;
      particle = next
    ) {
      // save next particle in case we recycle this one
      next = particle.next;
      // increase age
      particle.age += delta;
      // recycle particle if it is too old
      if (particle.age > particle.maxLife || particle.age < 0) {
        this.recycle(particle);
      } else {
        // determine our interpolation value
        let lerp = particle.age * particle.oneOverLife; // lifetime / maxLife;

        // global ease affects all interpolation calculations
        if (this.customEase) {
          if (this.customEase.length === 4) {
            // the t, b, c, d parameters that some tween libraries use
            // (time, initial value, end value, duration)
            lerp = (this.customEase as any)(lerp, 0, 1, 1);
          } else {
            // the simplified version that we like that takes
            // one parameter, time from 0-1. TweenJS eases provide this usage.
            lerp = this.customEase(lerp);
          }
        }

        // set age percent for all interpolation calculations
        particle.agePercent = lerp;

        // let each behavior run wild on the active particles
        for (let i = 0; i < this.updateBehaviors.length; ++i) {
          if (this.updateBehaviors[i].updateParticle?.(particle, delta)) {
            this.recycle(particle);
            break;
          }
        }
      }
    }

    let prevX = 0;
    let prevY = 0;

    // if the previous position is valid, store these for later interpolation
    if (this._prevPosIsValid) {
      prevX = this._prevEmitterPos.x;
      prevY = this._prevEmitterPos.y;
    }
    // store current position of the emitter as local variables
    const curX = this.ownerPos.x + this.spawnPos.x;
    const curY = this.ownerPos.y + this.spawnPos.y;
    // spawn new particles

    if (this._emit) {
      // decrease spawn timer
      this._spawnTimer -= delta < 0 ? 0 : delta;
      // while _spawnTimer < 0, we have particles to spawn
      while (this._spawnTimer <= 0) {
        // determine if the emitter should stop spawning
        if (this._emitterLife >= 0) {
          this._emitterLife -= this._frequency;
          if (this._emitterLife <= 0) {
            this._spawnTimer = 0;
            this._emitterLife = 0;
            this.emit = false;
            break;
          }
        }
        // determine if we have hit the particle limit
        if (this.particleCount >= this.maxParticles) {
          this._spawnTimer += this._frequency;
          continue;
        }
        let emitPosX: number;
        let emitPosY: number;

        // If the position has changed and this isn't the first spawn,
        // interpolate the spawn position
        if (this._prevPosIsValid && this._posChanged) {
          // 1 - _spawnTimer / delta, but _spawnTimer is negative
          const lerp = 1 + this._spawnTimer / delta;

          emitPosX = (curX - prevX) * lerp + prevX;
          emitPosY = (curY - prevY) * lerp + prevY;
        }
        // otherwise just set to the spawn position
        else {
          emitPosX = curX;
          emitPosY = curY;
        }

        let waveFirst: Particle | undefined;
        let waveLast: Particle | undefined;

        // create enough particles to fill the wave
        for (
          let len = Math.min(
              this.particlesPerWave,
              this.maxParticles - this.particleCount,
            ),
            i = 0;
          i < len;
          ++i
        ) {
          // see if we actually spawn one
          if (this.spawnChance < 1 && Math.random() >= this.spawnChance) {
            continue;
          }
          // determine the particle lifetime
          let lifetime: number;

          if (this.minLifetime === this.maxLifetime) {
            lifetime = this.minLifetime;
          } else {
            lifetime =
              Math.random() * (this.maxLifetime - this.minLifetime) +
              this.minLifetime;
          }
          // only make the particle if it wouldn't immediately destroy itself
          if (-this._spawnTimer >= lifetime) {
            continue;
          }
          // create particle
          let p: Particle;

          if (this._poolFirst) {
            p = this._poolFirst;
            this._poolFirst = this._poolFirst.next;
            p.next = undefined;
          } else {
            p = new Particle(this);
          }

          // initialize particle
          p.init(lifetime);
          // add the particle to the display list
          if (this.addAtBack) {
            p.appendAt(this._parent, 0);
          } else {
            p.appendTo(this._parent);
          }
          // add particles to list of ones in this wave
          if (waveFirst) {
            waveLast!.next = p;
            p.prev = waveLast;
            waveLast = p;
          } else {
            waveLast = waveFirst = p;
          }
          // increase our particle count
          ++this.particleCount;
        }

        if (waveFirst) {
          // add particle to list of active particles
          if (this._activeParticlesLast) {
            this._activeParticlesLast.next = waveFirst;
            waveFirst.prev = this._activeParticlesLast;
            this._activeParticlesLast = waveLast;
          } else {
            this._activeParticlesFirst = waveFirst;
            this._activeParticlesLast = waveLast;
          }
          // run behavior init on particles
          for (let i = 0; i < this.initBehaviors.length; ++i) {
            const behavior = this.initBehaviors[i];

            // if we hit our special key, interrupt behaviors to apply
            // emitter position/rotation
            if (behavior === PositionParticle) {
              for (
                let particle: Particle | undefined = waveFirst,
                  next: Particle | undefined;
                particle !== undefined;
                particle = next
              ) {
                // save next particle in case we recycle this one
                next = particle.next;
                // rotate the particle's position by the emitter's rotation
                if (this.rotation !== 0) {
                  rotatePoint(this.rotation, particle);
                  particle.rotation += this.rotation;
                }
                // offset by the emitter's position
                particle.x += emitPosX;
                particle.y += emitPosY;

                // also, just update the particle's age properties while we are looping through
                particle.age += -this._spawnTimer;
                // determine our interpolation value
                let lerp = particle.age * particle.oneOverLife; // lifetime / maxLife;

                // global ease affects all interpolation calculations
                if (this.customEase) {
                  if (this.customEase.length === 4) {
                    // the t, b, c, d parameters that some tween libraries use
                    // (time, initial value, end value, duration)
                    lerp = (this.customEase as any)(lerp, 0, 1, 1);
                  } else {
                    // the simplified version that we like that takes
                    // one parameter, time from 0-1. TweenJS eases provide this usage.
                    lerp = this.customEase(lerp);
                  }
                }
                // set age percent for all interpolation calculations
                particle.agePercent = lerp;
              }
            } else {
              behavior.initParticles(waveFirst);
            }
          }
          for (
            let particle: Particle | undefined = waveFirst,
              next: Particle | undefined;
            particle !== undefined;
            particle = next
          ) {
            // save next particle in case we recycle this one
            next = particle.next;
            // now update the particles by the time passed, so the particles are spread out properly
            for (let i = 0; i < this.updateBehaviors.length; ++i) {
              // we want a positive delta, because a negative delta messes things up
              if (
                this.updateBehaviors[i].updateParticle?.(
                  particle,
                  -this._spawnTimer,
                )
              ) {
                // bail if the particle got reycled
                this.recycle(particle);
                break;
              }
            }
          }
        }
        // increase timer and continue on to any other particles that need to be created
        this._spawnTimer += this._frequency;
      }
    }
    // if the position changed before this update, then keep track of that
    if (this._posChanged) {
      this._prevEmitterPos.x = curX;
      this._prevEmitterPos.y = curY;
      this._prevPosIsValid = true;
      this._posChanged = false;
    }

    // if we are all done and should destroy ourselves, take care of that
    if (!this._emit && !this._activeParticlesFirst) {
      if (this._completeCallback) {
        const cb = this._completeCallback;
        this._completeCallback = undefined;
        cb();
      }
      if (this._destroyWhenComplete) {
        this.destroy();
      }
    }
  }

  /**
   * Emits a single wave of particles, using standard spawnChance & particlesPerWave settings. Does not affect
   * regular spawning through the frequency, and ignores the emit property. The max particle count is respected, however,
   * so if there are already too many particles then nothing will happen.
   */
  public emitNow(): void {
    if (!this._parent) return;

    const emitPosX = this.ownerPos.x + this.spawnPos.x;
    const emitPosY = this.ownerPos.y + this.spawnPos.y;

    let waveFirst: Particle | undefined;
    let waveLast: Particle | undefined;

    // create enough particles to fill the wave
    for (
      let len = Math.min(
          this.particlesPerWave,
          this.maxParticles - this.particleCount,
        ),
        i = 0;
      i < len;
      ++i
    ) {
      // see if we actually spawn one
      if (this.spawnChance < 1 && Math.random() >= this.spawnChance) {
        continue;
      }
      // create particle
      let p: Particle;

      if (this._poolFirst) {
        p = this._poolFirst;
        this._poolFirst = this._poolFirst.next;
        p.next = undefined;
      } else {
        p = new Particle(this);
      }

      let lifetime: number;

      if (this.minLifetime === this.maxLifetime) {
        lifetime = this.minLifetime;
      } else {
        lifetime =
          Math.random() * (this.maxLifetime - this.minLifetime) +
          this.minLifetime;
      }
      // initialize particle
      p.init(lifetime);
      // add the particle to the display list
      if (this.addAtBack) {
        p.appendAt(this._parent, 0);
      } else {
        p.appendTo(this._parent);
      }
      // add particles to list of ones in this wave
      if (waveFirst) {
        waveLast!.next = p;
        p.prev = waveLast;
        waveLast = p;
      } else {
        waveLast = waveFirst = p;
      }
      // increase our particle count
      ++this.particleCount;
    }

    if (waveFirst) {
      // add particle to list of active particles
      if (this._activeParticlesLast) {
        this._activeParticlesLast.next = waveFirst;
        waveFirst.prev = this._activeParticlesLast;
        this._activeParticlesLast = waveLast;
      } else {
        this._activeParticlesFirst = waveFirst;
        this._activeParticlesLast = waveLast;
      }
      // run behavior init on particles
      for (let i = 0; i < this.initBehaviors.length; ++i) {
        const behavior = this.initBehaviors[i];

        // if we hit our special key, interrupt behaviors to apply
        // emitter position/rotation
        if (behavior === PositionParticle) {
          for (
            let particle: Particle | undefined = waveFirst,
              next: Particle | undefined;
            particle !== undefined;
            particle = next
          ) {
            // save next particle in case we recycle this one
            next = particle.next;
            // rotate the particle's position by the emitter's rotation
            if (this.rotation !== 0) {
              rotatePoint(this.rotation, particle);
              particle.rotation += this.rotation;
            }
            // offset by the emitter's position
            particle.x += emitPosX;
            particle.y += emitPosY;
          }
        } else {
          behavior.initParticles(waveFirst);
        }
      }
    }
  }

  /**
   * Kills all active particles immediately.
   */
  public cleanup(): void {
    let particle: Particle | undefined;
    let next: Particle | undefined;

    for (particle = this._activeParticlesFirst; particle; particle = next) {
      next = particle.next;
      this.recycle(particle, true);
    }
    this._activeParticlesFirst = this._activeParticlesLast = undefined;
    this.particleCount = 0;
  }

  /**
   * If this emitter has been destroyed. Note that a destroyed emitter can still be reused, after
   * having a new parent set and being reinitialized.
   */
  public get destroyed(): boolean {
    return !(this._parent && this.initBehaviors.length);
  }

  /**
   * Destroys the emitter and all of its particles.
   */
  public destroy(): void {
    // make sure we aren't still listening to any tickers
    this.autoUpdate = false;
    // puts all active particles in the pool, and removes them from the particle parent
    this.cleanup();
    // wipe the pool clean
    let next: Particle | undefined;

    for (let particle = this._poolFirst; particle; particle = next) {
      // store next value so we don't lose it in our destroy call
      next = particle.next;
      particle.destroy();
    }
    this._poolFirst =
      // @ts-expect-error
      this.spawnPos =
      // @ts-expect-error
      this.ownerPos =
      this._parent =
      this.customEase =
      this._completeCallback =
        undefined;

    this.initBehaviors.length =
      this.updateBehaviors.length =
      this.recycleBehaviors.length =
        0;
  }
}
