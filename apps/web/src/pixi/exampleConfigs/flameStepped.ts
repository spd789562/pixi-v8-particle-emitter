import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const flameSteppedTextures = [
  'fireSpark_particle.png',
  'fireSpark_Fire.png',
];

export const flameSteppedConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.1,
    max: 0.75,
  },
  frequency: 0.001,
  emitterLifetime: 0,
  maxParticles: 1000,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: false,
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              time: 0,
              value: 0.62,
            },
            {
              time: 1,
              value: 0,
            },
          ],
        },
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              time: 0,
              value: 0.25,
            },
            {
              time: 1,
              value: 0.75,
            },
          ],
        },
        minMult: 1,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          //this list is turned into a 5 step gradient inside ParticleExample.js with
          //PIXI.particles.createSteppedGradient() after the emitter is created
          list: [
            {
              time: 0,
              value: 'fff191',
            },
            {
              time: 1,
              value: 'ff622c',
            },
          ],
        },
      },
    },
    {
      type: 'moveSpeedStatic',
      config: {
        min: 500,
        max: 500,
      },
    },
    {
      type: 'rotation',
      config: {
        accel: 0,
        minSpeed: 50,
        maxSpeed: 50,
        minStart: 265,
        maxStart: 275,
      },
    },
    {
      type: 'textureRandom',
      config: {
        textures: ['fireSpark_particle.png', 'fireSpark_Fire.png'],
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 10,
          innerRadius: 0,
          affectRotation: false,
        },
      },
    },
  ],
};
