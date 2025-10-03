# PixiJS Particle Editor
<p align="center">
  <a href="https://npmjs.com/package/@spd789562/particle-emitter">
    <img src="https://img.shields.io/npm/v/@spd789562/particle-emitter.svg" alt="npm package">
  </a>
  <a href="https://jsr.io/@spd789562/particle-emitter">
    <img src="https://jsr.io/badges/@spd789562/particle-emitter" alt="jsr package" />
  </a>
</p>

This project is a complete copy from [@pixi/particle-emitter](https://github.com/pixijs-userland/particle-emitter), but using pixi.js v8 `ParticleContainer` and `Particle` as base instead of Container. EmitterConfig are still the same structure.

I'm also re-created the [particle editor](https://spd789562.github.io/pixi-v8-particle-emitter/) for some formate that old editor not support.

## Breaking changes from `@pixi/particle-emitter v5`
* `Pixi.js Version` - It only support Pixi v8, specifically `pixi.js@8.5.0` and above.
* Make sure you are using ParticleContainer.
* Due to Pixi v8 ParticleContainer limitations, all passed texture should be same TextureSource if there is more then one textures need to use, please ensure load them via spritesheet or atlas.

## Sample Usage

Please see the examples for various pre-made particle configurations.

```js

import { Emitter } from '@spd789562/particle-emitter';
import { ParticleContainer, Texture } from 'pixi.js';

// Create a ParticleContainer with appropriate dynamic properties
const particleContainer = new ParticleContainer({
  dynamicProperties: {
    uvs: true,      // Enable if using multiple textures from same source
    vertex: true,   // Enable for non-trimmed spritesheets(like all texture are not same sized)
    position: true,
    rotation: true,
    scale: true,
    color: true,
  },
});

const emitter = new Emitter(
    // The PIXI.ParticleContainer to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    particleContainer,
    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        lifetime: {
            min: 0.5,
            max: 0.5
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        behaviors: [
            {
                type: 'alpha',
                config: {
                    alpha: {
                        list: [
                            {
                                value: 0.8,
                                time: 0
                            },
                            {
                                value: 0.1,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'scale',
                config: {
                    scale: {
                        list: [
                            {
                                value: 1,
                                time: 0
                            },
                            {
                                value: 0.3,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'color',
                config: {
                    color: {
                        list: [
                            {
                                value: "fb1010",
                                time: 0
                            },
                            {
                                value: "f5b830",
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 200,
                                time: 0
                            },
                            {
                                value: 100,
                                time: 1
                            }
                        ],
                        isStepped: false
                    },
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: 0,
                    max: 360
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'torus',
                    data: {
                        x: 0,
                        y: 0,
                        radius: 10
                    }
                }
            },
            {
                type: 'textureSingle',
                config: {
                    texture: Texture.from('image.jpg')
                }
            }
        ],
    }
);
// add to config or set it later
emitter.autoUpdate = true;
```

## Documentation
Basically all api still same as [`@pixi/particle-emitter`](https://userland.pixijs.io/particle-emitter/docs/)

## Installation

PixiJS Particle Emitter can be installed with NPM or other package managers.

```bash
npm install @spd789562/particle-emitter
```

## Examples

* [Explosion 1](https://userland.pixijs.io/particle-emitter/examples/explosion.html)
* [Explosion 2](https://userland.pixijs.io/particle-emitter/examples/explosion2.html)
* [Explosion 3](https://userland.pixijs.io/particle-emitter/examples/explosion3.html)
* [Explosion Ring](https://userland.pixijs.io/particle-emitter/examples/explosionRing.html)
* [Megaman Death](https://userland.pixijs.io/particle-emitter/examples/megamanDeath.html)
* [Rain](https://userland.pixijs.io/particle-emitter/examples/rain.html)
* [Flame](https://userland.pixijs.io/particle-emitter/examples/flame.html)
* [Flame on Polygonal Chain](https://userland.pixijs.io/particle-emitter/examples/flamePolygonal.html)
* [Flame on Advanced Polygonal Chain](https://userland.pixijs.io/particle-emitter/examples/flamePolygonalAdv.html)
* [Flame - Stepped Colors](https://userland.pixijs.io/particle-emitter/examples/flameStepped.html)
* [Flame with Smoke](https://userland.pixijs.io/particle-emitter/examples/flameAndSmoke.html)
* [Flame - Sputtering](https://userland.pixijs.io/particle-emitter/examples/flameUneven.html)
* [Gas](https://userland.pixijs.io/particle-emitter/examples/gas.html)
* [Bubbles](https://userland.pixijs.io/particle-emitter/examples/bubbles.html)
* [Bubble Spray](https://userland.pixijs.io/particle-emitter/examples/bubbleSpray.html)
* [Bubble Stream](https://userland.pixijs.io/particle-emitter/examples/bubbleStream.html)
* [Bubble Stream - path following](https://userland.pixijs.io/particle-emitter/examples/bubbleStreamPath.html)
* [Vertical Bubbles](https://userland.pixijs.io/particle-emitter/examples/bubblesVertical.html)
* [Cartoon Smoke](https://userland.pixijs.io/particle-emitter/examples/cartoonSmoke.html)
* [Cartoon Smoke Alt.](https://userland.pixijs.io/particle-emitter/examples/cartoonSmoke2.html)
* [Cartoon Smoke Blast](https://userland.pixijs.io/particle-emitter/examples/cartoonSmokeBlast.html)
* [Snow](https://userland.pixijs.io/particle-emitter/examples/snow.html)
* [Sparks](https://userland.pixijs.io/particle-emitter/examples/sparks.html)
* [Fountain](https://userland.pixijs.io/particle-emitter/examples/fountain.html)
* [Animated Coins](https://userland.pixijs.io/particle-emitter/examples/coins.html)
* [Animated Bubbles](https://userland.pixijs.io/particle-emitter/examples/animatedBubbles.html)
* [Spaceship Destruction - Ordered Art](https://userland.pixijs.io/particle-emitter/examples/spaceshipDestruction.html)
* [Particle Container Performance](https://userland.pixijs.io/particle-emitter/examples/particleContainerPerformance.html)

## License

Copyright (c) 2025 [spd789562](http://github.com/spd789562)

Released under the MIT License.