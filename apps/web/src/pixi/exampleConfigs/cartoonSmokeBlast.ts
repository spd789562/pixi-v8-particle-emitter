import type { EmitterConfigV3 } from '@repo/emitter';

export const cartoonSmokeBlastTextures = ['CartoonSmoke'];

export const cartoonSmokeBlastConfig: EmitterConfigV3 = {
  lifetime: {
    min: 0.5,
    max: 0.7,
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
              value: 0,
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
              value: 0.1,
            },
            {
              time: 1,
              value: 1.5,
            },
          ],
        },
        minMult: 1,
      },
    },
    {
      type: 'rotation',
      config: {
        accel: 0,
        minSpeed: 0,
        maxSpeed: 20,
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
