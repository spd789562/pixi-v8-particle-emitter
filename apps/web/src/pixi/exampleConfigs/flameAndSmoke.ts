import type { EmitterConfigV3 } from '@repo/emitter';

export const flameAndSmokeTextures = [
  'fireSpark_particle.png',
  'fireSpark_Fire.png',
];

export const flameAndSmokeConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.5,
    max: 0.7,
  },
  frequency: 0.001,
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
              value: 0.62,
              time: 0,
            },
            {
              value: 0,
              time: 0.6,
            },
            {
              value: 0,
              time: 0.7,
            },
            {
              value: 0.8,
              time: 0.71,
            },
            {
              value: 0,
              time: 1,
            },
          ],
          isStepped: false,
        },
      },
    },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              value: 500,
              time: 0,
            },
            {
              value: 450,
              time: 0.7,
            },
            {
              value: 450,
              time: 1,
            },
          ],
          isStepped: true,
        },
        minMult: 1,
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              value: 0.25,
              time: 0,
            },
            {
              value: 0.75,
              time: 1,
            },
          ],
          isStepped: false,
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
              value: 'fff191',
              time: 0,
            },
            {
              value: 'ff622c',
              time: 0.6,
            },
            {
              value: '333333',
              time: 0.7,
            },
            {
              value: '777777',
              time: 1,
            },
          ],
          isStepped: false,
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
