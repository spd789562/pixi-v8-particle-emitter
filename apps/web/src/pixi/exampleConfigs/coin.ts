import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const coinTextures = [
  'goldAnim_gold_1.png',
  'goldAnim_gold_2.png',
  'goldAnim_gold_3.png',
  'goldAnim_gold_4.png',
  'goldAnim_gold_5.png',
  'goldAnim_gold_6.png',
];

export const coinConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.5,
    max: 0.7,
  },
  frequency: 0.05,
  emitterLifetime: 0.31,
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
              value: 1,
            },
            {
              time: 1,
              value: 0.8,
            },
          ],
        },
      },
    },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              time: 0,
              value: 200,
            },
            {
              time: 1,
              value: 100,
            },
          ],
        },
      },
    },
    {
      type: 'scaleStatic',
      config: {
        min: 0.5,
        max: 0.5,
      },
    },
    {
      type: 'animatedRandom',
      config: {
        anims: [
          {
            framerate: 20,
            loop: true,
            textures: [
              'goldAnim_gold_1.png',
              'goldAnim_gold_2.png',
              'goldAnim_gold_3.png',
              'goldAnim_gold_4.png',
              'goldAnim_gold_5.png',
              'goldAnim_gold_6.png',
            ],
          },
          {
            framerate: 20,
            loop: true,
            textures: [
              'goldAnim_gold_6.png',
              'goldAnim_gold_5.png',
              'goldAnim_gold_4.png',
              'goldAnim_gold_3.png',
              'goldAnim_gold_2.png',
              'goldAnim_gold_1.png',
            ],
          },
        ],
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 40,
          innerRadius: 39,
          affectRotation: true,
        },
      },
    },
  ],
};
