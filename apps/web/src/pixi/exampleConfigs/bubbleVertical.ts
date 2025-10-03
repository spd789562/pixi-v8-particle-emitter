import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const bubbleVerticalTextures = ['Bubbles99'];

export const bubbleVerticalConfig: EmitterConfigV3 = {
  lifetime: {
    min: 3.5,
    max: 4,
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
      type: 'textureSingle',
      config: {
        texture: 'Bubbles99',
      },
    },
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
              value: 0.22,
            },
          ],
        },
      },
    },
    {
      type: 'moveSpeedStatic',
      config: {
        min: 200,
        max: 200,
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
