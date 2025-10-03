import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const animatedBubbleTextures = [
  'popAnim_Bubbles99.png',
  'popAnim_Pop1.png',
  'popAnim_Pop2.png',
  'popAnim_Pop3.png',
];

export const animatedBubbleConfig: EmitterConfigV3 = {
  lifetime: {
    min: 2,
    max: 3,
  },
  frequency: 0.016,
  emitterLifetime: 0,
  maxParticles: 500,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: 'moveSpeedStatic',
      config: {
        min: 150,
        max: 150,
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
              value: 0.5,
            },
          ],
        },
        minMult: 0.5,
      },
    },
    {
      type: 'rotation',
      config: {
        accel: 0,
        minSpeed: 0,
        maxSpeed: 50,
        minStart: 260,
        maxStart: 280,
      },
    },
    {
      type: 'animatedSingle',
      config: {
        anim: {
          framerate: -1,
          textures: [
            {
              texture: 'popAnim_Bubbles99.png',
              count: 40,
            },
            {
              texture: 'popAnim_Pop1.png',
              count: 1,
            },
            {
              texture: 'popAnim_Pop2.png',
              count: 1,
            },
            {
              texture: 'popAnim_Pop3.png',
              count: 1,
            },
          ],
        },
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'rect',
        data: {
          x: -450,
          y: 200,
          w: 900,
          h: 0,
        },
      },
    },
  ],
};
