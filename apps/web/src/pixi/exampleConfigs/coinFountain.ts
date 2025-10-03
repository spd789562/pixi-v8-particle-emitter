import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const coinFountainTextures = [
  'goldAnim_gold_1.png',
  'goldAnim_gold_2.png',
  'goldAnim_gold_3.png',
  'goldAnim_gold_4.png',
  'goldAnim_gold_5.png',
  'goldAnim_gold_6.png',
];

export const coinFountainConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.25,
    max: 0.5,
  },
  frequency: 0.025,
  emitterLifetime: 0,
  maxParticles: 500,
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
              value: 0.31,
            },
          ],
        },
      },
    },
    {
      type: 'moveAcceleration',
      config: {
        accel: {
          x: 0,
          y: 2000,
        },
        minStart: 600,
        maxStart: 600,
        rotate: true,
      },
    },
    {
      type: 'scaleStatic',
      config: {
        min: 0.3,
        max: 0.3,
      },
    },
    {
      type: 'textureRandom',
      config: {
        textures: [
          'goldAnim_gold_1.png',
          'goldAnim_gold_2.png',
          'goldAnim_gold_3.png',
          'goldAnim_gold_4.png',
          'goldAnim_gold_5.png',
          'goldAnim_gold_6.png',
        ],
      },
    },
    {
      type: 'rotationStatic',
      config: {
        min: 260,
        max: 280,
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 0,
          innerRadius: 0,
          affectRotation: false,
        },
      },
    },
  ],
};
