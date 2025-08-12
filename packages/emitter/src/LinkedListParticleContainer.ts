import { ViewContainer, Bounds, particleData } from 'pixi.js';

import type { Particle } from './Particle';

/* internal pixi types */
import type {
  ParticleBuffer,
  IRenderLayer,
  Instruction,
  Shader,
  Texture,
  ContainerChild,
  DestroyOptions,
  IParticle,
  ParticleRendererProperty,
  ParticleProperties,
  ParticleContainerOptions,
} from 'pixi.js';

const emptyBounds = new Bounds(0, 0, 0, 0);

export interface LinkedListChild extends IParticle {
  nextChild: LinkedListChild | null;
  prevChild: LinkedListChild | null;
  parent?: IParticleContainer;
}

export interface IParticleContainer {
  addParticle(...children: LinkedListChild[]): LinkedListChild;
  removeParticle(...children: LinkedListChild[]): LinkedListChild;
  addParticleAt<U extends LinkedListChild>(child: U, index: number): U;
  removeParticleAt<U extends LinkedListChild>(index: number): U;
  removeParticles(beginIndex?: number, endIndex?: number): LinkedListChild[];
}

// eslint-disable-next-line
export interface LinkedListParticleContainer
  extends PixiMixins.ParticleContainer,
    ViewContainer<ParticleBuffer> {}

/**
 * A semi-experimental Container that uses a doubly linked list to manage children instead of an
 * array. This means that adding/removing children often is not the same performance hit that
 * it would to be continually pushing/splicing.
 * However, this is primarily intended to be used for heavy particle usage, and may not handle
 * edge cases well if used as a complete Container replacement.
 */
// currently not working without custom render pipe
export class LinkedListParticleContainer
  extends ViewContainer<ParticleBuffer>
  implements Instruction
{
  /**
   * Defines the default options for creating a ParticleContainer.
   * @example
   * ```ts
   * // Change defaults globally
   * LinkedListParticleContainer.defaultOptions = {
   *     dynamicProperties: {
   *         position: true,  // Update positions each frame
   *         rotation: true,  // Update rotations each frame
   *         vertex: false,   // Static vertices
   *         uvs: false,      // Static texture coordinates
   *         color: false     // Static colors
   *     },
   *     roundPixels: true // Enable pixel rounding for crisp rendering
   * };
   * ```
   * @property {Record<string, boolean>} dynamicProperties - Specifies which properties are dynamic.
   * @property {boolean} roundPixels - Indicates if pixels should be  rounded.
   */
  public static defaultOptions: ParticleContainerOptions = {
    /** Specifies which properties are dynamic. */
    dynamicProperties: {
      /** Indicates if vertex positions are dynamic. */
      vertex: false,
      /** Indicates if particle positions are dynamic. */
      position: true,
      /** Indicates if particle rotations are dynamic. */
      rotation: false,
      /** Indicates if UV coordinates are dynamic. */
      uvs: false,
      /** Indicates if particle colors are dynamic. */
      color: false,
    },
    /** Indicates if pixels should be rounded for rendering. */
    roundPixels: false,
  };

  /**
   * The unique identifier for the render pipe of this ParticleContainer.
   * @internal
   */
  public override readonly renderPipeId: string = 'particle';

  /** @internal */
  public batched = false;

  /**
   * A record of properties and their corresponding ParticleRendererProperty.
   * @internal
   */
  public _properties: Record<string, ParticleRendererProperty>;

  /**
   * Indicates if the children of this ParticleContainer have changed and need to be updated.
   * @internal
   */
  public _childrenDirty = false;

  private _firstChild: LinkedListChild | null = null;
  private _lastChild: LinkedListChild | null = null;
  private _childCount = 0;

  /**
   * The shader used for rendering particles in this ParticleContainer.
   * @advanced
   */
  public shader: Shader;

  /**
   * The texture used for rendering particles in this ParticleContainer. All particles
   * must share the same base texture for optimal performance.
   *
   * > [!NOTE]
   * > If not set, the texture of the first particle added to this container will be used.
   * @example
   * ```ts
   * const container = new ParticleContainer();
   * // Set texture for all particles
   * container.texture = Texture.from('particle.png');
   *
   * // Create particles using container's texture
   * for (let i = 0; i < 100; i++) {
   *     const particle = new Particle(container.texture);
   *     container.addParticle(particle); // Will use the particles texture if not set
   * }
   * ```
   * @default null
   * @see {@link ParticleContainerOptions#texture} For setting texture via constructor
   * @see {@link Particle} For creating particles with textures
   */
  public texture: Texture;

  /**
   * @param options - The options for creating the sprite.
   */
  constructor(options: ParticleContainerOptions = {}) {
    options = {
      ...LinkedListParticleContainer.defaultOptions,
      ...options,
      dynamicProperties: {
        ...LinkedListParticleContainer.defaultOptions.dynamicProperties,
        ...options?.dynamicProperties,
      },
    };

    // split out
    const {
      dynamicProperties,
      shader,
      roundPixels,
      texture,
      particles,
      ...rest
    } = options;

    super({
      label: 'ParticleContainer',
      ...rest,
    });

    // @ts-ignore
    this.texture = texture || null;
    // @ts-ignore
    this.shader = shader;

    this._properties = {};

    for (const key in particleData) {
      const property = particleData[key];
      const dynamic = dynamicProperties![key];

      this._properties[key] = {
        ...property,
        dynamic,
      };
    }

    this.allowChildren = true;
    this.roundPixels = roundPixels ?? false;

    particles && this.addParticle(...(particles as LinkedListChild[]));
  }

  public get firstChild(): LinkedListChild {
    return this._firstChild!;
  }

  public get lastChild(): LinkedListChild {
    return this._lastChild!;
  }

  public get childCount(): number {
    return this._childCount;
  }

  /**
   * Adds one or more particles to the container. The particles will be rendered using the container's shared texture
   * and properties. When adding multiple particles, they must all share the same base texture.
   * @example
   * ```ts
   * const container = new ParticleContainer();
   *
   * // Add a single particle
   * const particle = new Particle(Assets.get('particleTexture'));
   * container.addParticle(particle);
   *
   * // Add multiple particles at once
   * const particles = [
   *     new Particle(Assets.get('particleTexture')),
   *     new Particle(Assets.get('particleTexture')),
   *     new Particle(Assets.get('particleTexture'))
   * ];
   *
   * container.addParticle(...particles);
   * ```
   * @param children - The Particle(s) to add to the container
   * @returns The first particle that was added, for method chaining
   * @see {@link ParticleContainer#texture} For setting the shared texture
   * @see {@link ParticleContainer#update} For updating after modifications
   */
  public addParticle(...children: LinkedListChild[]): LinkedListChild {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.parent) {
        child.parent.removeParticle(child);
      }
      child.parent = this;
      if (this._lastChild) {
        this._lastChild.nextChild = child;
        child.prevChild = this._lastChild;
        this._lastChild = child;
      } else {
        this._firstChild = this._lastChild = child;
      }

      this._childCount += 1;
    }

    this.onViewUpdate();

    return children[0];
  }

  /**
   * Removes one or more particles from the container. The particles must already be children
   * of this container to be removed.
   * @example
   * ```ts
   * // Remove a single particle
   * container.removeParticle(particle1);
   *
   * // Remove multiple particles at once
   * container.removeParticle(particle2, particle3);
   * ```
   * @param children - The Particle(s) to remove from the container
   * @returns The first particle that was removed, for method chaining
   * @see {@link ParticleContainer#particleChildren} For accessing all particles
   * @see {@link ParticleContainer#removeParticles} For removing particles by index
   * @see {@link ParticleContainer#removeParticleAt} For removing a particle at a specific index
   */
  public removeParticle(...children: LinkedListChild[]): LinkedListChild {
    let didRemove = false;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.parent !== this) {
        continue;
      }
      didRemove = true;
      if (child.nextChild) {
        child.nextChild.prevChild = child.prevChild;
      }
      if (child.prevChild) {
        child.prevChild.nextChild = child.nextChild;
      }
      if (this._firstChild === child) {
        this._firstChild = child.nextChild;
      }
      if (this._lastChild === child) {
        this._lastChild = child.prevChild;
      }
      child.parent = undefined;
      child.nextChild = null;
      child.prevChild = null;
      this._childCount -= 1;
    }

    if (didRemove) this.onViewUpdate();

    return children[0];
  }

  /**
   * Updates the particle container's internal state. Call this method after manually modifying
   * the particleChildren array or when changing static properties of particles.
   * @example
   * ```ts
   * // Batch modify particles
   * container.particleChildren.push(...particles);
   * container.update(); // Required after direct array modification
   *
   * // Update static properties
   * container.particleChildren.forEach(particle => {
   *     particle.position.set(
   *         Math.random() * 800,
   *         Math.random() * 600
   *     );
   * });
   * container.update(); // Required after changing static positions
   * ```
   * @see {@link ParticleProperties} For configuring dynamic vs static properties
   * @see {@link ParticleContainer#particleChildren} For direct array access
   */
  public update() {
    this._childrenDirty = true;
  }

  protected override onViewUpdate() {
    this._childrenDirty = true;
    super.onViewUpdate();
  }

  /**
   * @internal
   */
  public getParticleAt(index: number): LinkedListChild {
    if (index < 0 || index >= this._childCount) {
      throw new RangeError(`getParticleAt: Index (${index}) out of bounds`);
    }

    if (index === 0) {
      return this._firstChild!;
    }
    if (index === this._childCount - 1) {
      return this._lastChild!;
    }

    let current = this._firstChild;
    let i = 0;
    while (current && i < index) {
      current = current.nextChild;
      i++;
    }
    return current!;
  }

  /**
   * Returns a static empty bounds object since ParticleContainer does not calculate bounds automatically
   * for performance reasons. Use the `boundsArea` property to manually set container bounds.
   * @example
   * ```ts
   * const container = new ParticleContainer({
   *     texture: Texture.from('particle.png')
   * });
   *
   * // Default bounds are empty
   * console.log(container.bounds); // Bounds(0, 0, 0, 0)
   *
   * // Set manual bounds for the particle area
   * container.boundsArea = {
   *     minX: 0,
   *     minY: 0,
   *     maxX: 800,
   *     maxY: 600
   * };
   * ```
   * @readonly
   * @returns {Bounds} An empty bounds object (0,0,0,0)
   * @see {@link Container#boundsArea} For manually setting container bounds
   * @see {@link Bounds} For bounds object structure
   */
  public get bounds() {
    return emptyBounds;
  }

  /** @private */
  protected override updateBounds(): void {
    /* empty */
  }

  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * particleContainer.destroy();
   * particleContainer.destroy(true);
   * particleContainer.destroy({ texture: true, textureSource: true, children: true });
   */
  public override destroy(options: DestroyOptions = false) {
    super.destroy(options);

    const destroyTexture =
      typeof options === 'boolean' ? options : options?.texture;

    if (destroyTexture) {
      const destroyTextureSource =
        typeof options === 'boolean' ? options : options?.textureSource;

      const texture = this.texture ?? this._firstChild?.texture;

      if (texture) {
        texture.destroy(destroyTextureSource);
      }
    }
    // @ts-expect-error it safe to set texture to null in destroy
    this.texture = null;
    // cleanup references
    this._firstChild = null;
    this._lastChild = null;
    this.shader?.destroy();
  }

  /**
   * Removes all particles from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed particles
   */
  public removeParticles(beginIndex?: number, endIndex?: number) {
    beginIndex ??= 0;
    endIndex ??= this._childCount;

    if (beginIndex < 0) {
      beginIndex = 0;
    }
    if (endIndex > this._childCount) {
      endIndex = this._childCount;
    }

    const removed: LinkedListChild[] = [];

    let current = this._firstChild;
    let index = 0;
    // skip to the beginning
    while (current && index < beginIndex) {
      current = current.nextChild;
      index++;
    }
    while (current && index < endIndex) {
      removed.push(current);
      current = current.nextChild;
      index++;
    }
    this.removeParticle(...removed);

    this.onViewUpdate();

    return removed;
  }

  /**
   * Removes a particle from the specified index position.
   * @param index - The index to get the particle from
   * @returns The particle that was removed.
   */
  public removeParticleAt<U extends LinkedListChild>(index: number): U {
    const child = this.getParticleAt(index);
    this.removeParticle(child);

    this.onViewUpdate();

    return child as U;
  }

  /**
   * Adds a particle to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the particle is already in this container, it will be moved to the specified index.
   * @param {Container} child - The particle to add.
   * @param {number} index - The absolute index where the particle will be positioned at the end of the operation.
   * @returns {Container} The particle that was added.
   */
  public addParticleAt<U extends LinkedListChild>(child: U, index: number): U {
    if (child.parent) {
      child.parent.removeParticle(child);
    }

    if (!this._firstChild) {
      this._firstChild = this._lastChild = child;
    } else if (index === 0) {
      child.nextChild = this._firstChild;
      this._firstChild.prevChild = child;
      this._firstChild = child;
    } else if (index === this._childCount - 1 && this._lastChild) {
      child.prevChild = this._lastChild;
      this._lastChild.nextChild = child;
    } else {
      let current: LinkedListChild | null = this._firstChild;
      let i = 0;
      while (current && i < index) {
        current = current.nextChild;
        i++;
      }
      child.nextChild = current;
    }

    this._childCount += 1;

    this.onViewUpdate();

    return child;
  }

  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.addParticle()` instead.
   * @param {...any} _children
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override addChild<U extends (ContainerChild | IRenderLayer)[]>(
    ..._children: U
  ): U[0] {
    throw new Error(
      'ParticleContainer.addChild() is not available. Please use ParticleContainer.addParticle()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   * Calling this method will throw an error. Please use `ParticleContainer.removeParticle()` instead.
   * @param {...any} _children
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override removeChild<U extends (ContainerChild | IRenderLayer)[]>(
    ..._children: U
  ): U[0] {
    throw new Error(
      'ParticleContainer.removeChild() is not available. Please use ParticleContainer.removeParticle()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.removeParticles()` instead.
   * @param {number} [_beginIndex]
   * @param {number} [_endIndex]
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override removeChildren(
    _beginIndex?: number,
    _endIndex?: number,
  ): ContainerChild[] {
    throw new Error(
      'ParticleContainer.removeChildren() is not available. Please use ParticleContainer.removeParticles()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.removeParticleAt()` instead.
   * @param {number} _index
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override removeChildAt<U extends ContainerChild | IRenderLayer>(
    _index: number,
  ): U {
    throw new Error(
      'ParticleContainer.removeChildAt() is not available. Please use ParticleContainer.removeParticleAt()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.getParticleAt()` instead.
   * @param {number} _index
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override getChildAt<U extends ContainerChild | IRenderLayer>(
    _index: number,
  ): U {
    throw new Error(
      'ParticleContainer.getChildAt() is not available. Please use ParticleContainer.getParticleAt()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.setParticleIndex()` instead.
   * @param {ContainerChild} _child
   * @param {number} _index
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override setChildIndex(_child: ContainerChild, _index: number): void {
    throw new Error(
      'ParticleContainer.setChildIndex() is not available. Please use ParticleContainer.setParticleIndex()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.getParticleIndex()` instead.
   * @param {ContainerChild} _child
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override getChildIndex(_child: ContainerChild): number {
    throw new Error(
      'ParticleContainer.getChildIndex() is not available. Please use ParticleContainer.getParticleIndex()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.addParticleAt()` instead.
   * @param {ContainerChild} _child
   * @param {number} _index
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override addChildAt<U extends ContainerChild | IRenderLayer>(
    _child: U,
    _index: number,
  ): U {
    throw new Error(
      'ParticleContainer.addChildAt() is not available. Please use ParticleContainer.addParticleAt()',
    );
  }
  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error. Please use `ParticleContainer.swapParticles()` instead.
   * @param {ContainerChild} _child
   * @param {ContainerChild} _child2
   * @ignore
   */
  public override swapChildren<U extends ContainerChild | IRenderLayer>(
    _child: U,
    _child2: U,
  ): void {
    throw new Error(
      'ParticleContainer.swapChildren() is not available. Please use ParticleContainer.swapParticles()',
    );
  }

  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error.
   * @param _child - The child to reparent
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override reparentChild(..._child: ContainerChild[]): any {
    throw new Error(
      'ParticleContainer.reparentChild() is not available with the particle container',
    );
  }

  /**
   * This method is not available in ParticleContainer.
   *
   * Calling this method will throw an error.
   * @param _child - The child to reparent
   * @param _index - The index to reparent the child to
   * @throws {Error} Always throws an error as this method is not available.
   * @ignore
   */
  public override reparentChildAt(_child: ContainerChild, _index: number): any {
    throw new Error(
      'ParticleContainer.reparentChildAt() is not available with the particle container',
    );
  }
}
