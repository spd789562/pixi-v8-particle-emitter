import type { EmitterConfigV3 } from '@repo/emitter';

export const bubbleSprayTextures = ['Bubbles99'];

export const bubbleSprayConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.5,
    max: 1,
  },
  frequency: 0.008,
  emitterLifetime: 0.15,
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
              value: 0.12,
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
              value: 600,
            },
            {
              time: 1,
              value: 200,
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
              value: 0.01,
            },
            {
              time: 1,
              value: 0.8,
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
        maxSpeed: 10,
        minStart: 260,
        maxStart: 280,
      },
    },
    {
      type: 'spawnPoint',
      config: {},
    },
  ],
};
