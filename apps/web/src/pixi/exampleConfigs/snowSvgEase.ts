import type { EmitterConfigV3 } from '@repo/emitter';

export const snowTextures = ['Snow100'];

export const snowConfig: EmitterConfigV3 = {
  lifetime: {
    min: 4,
    max: 4,
  },
  ease: 'M0,0,C0,0.408,0.242,0.657,0.295,0.709,0.346,0.76,0.584,1,1,1',
  frequency: 0.004,
  emitterLifetime: 0,
  maxParticles: 1000,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: 'textureSingle',
      config: {
        texture: 'Snow100',
      },
    },
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              time: 0,
              value: 0.73,
            },
            {
              time: 1,
              value: 0.46,
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
              value: 0.15,
            },
            {
              time: 1,
              value: 0.2,
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
        maxSpeed: 200,
        minStart: 50,
        maxStart: 70,
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'rect',
        data: {
          x: -500,
          y: -300,
          w: 900,
          h: 20,
        },
      },
    },
  ],
};
