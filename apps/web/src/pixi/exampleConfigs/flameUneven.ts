import type { EmitterConfigV3 } from '@repo/emitter';

export const flameUnevenTextures = [
  'fireSpark_particle.png',
  'fireSpark_Fire.png',
];

export const flameUnevenConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.1,
    max: 0.75,
  },
  frequency: 0.001,
  spawnChance: 0.05,
  emitterLifetime: 0,
  maxParticles: 1000,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
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
      type: 'moveSpeedStatic',
      config: {
        min: 500,
        max: 500,
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
