import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const flamePolygonalAdvTextures = [
  'fireSpark_particle.png',
  'fireSpark_Fire.png',
];

export const flamePolygonalAdvConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.1,
    max: 0.75,
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
        min: 50,
        max: 50,
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              time: 0,
              value: 0.05,
            },
            {
              time: 1,
              value: 0.15,
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
        type: 'polygonalChain',
        data: [
          [
            {
              x: -300,
              y: 100,
            },
            {
              x: -300,
              y: -100,
            },
          ],
          [
            {
              x: -300,
              y: -100,
            },
            {
              x: -250,
              y: -100,
            },
          ],
          [
            {
              x: -300,
              y: 0,
            },
            {
              x: -250,
              y: 0,
            },
          ],
          [
            {
              x: -200,
              y: 100,
            },
            {
              x: -200,
              y: -100,
            },
          ],
          [
            {
              x: -100,
              y: 100,
            },
            {
              x: -100,
              y: -100,
            },
            {
              x: -50,
              y: -50,
            },
            {
              x: -100,
              y: 0,
            },
            {
              x: -50,
              y: 100,
            },
          ],
          [
            {
              x: 0,
              y: 100,
            },
            {
              x: 0,
              y: -100,
            },
          ],
          [
            {
              x: 0,
              y: -100,
            },
            {
              x: 50,
              y: -100,
            },
          ],
          [
            {
              x: 0,
              y: 0,
            },
            {
              x: 50,
              y: 0,
            },
          ],
          [
            {
              x: 0,
              y: 100,
            },
            {
              x: 50,
              y: 100,
            },
          ],
        ],
      },
    },
  ],
};
