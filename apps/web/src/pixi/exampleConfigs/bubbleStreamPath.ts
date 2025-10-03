import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const bubbleStreamPathTextures = ['Bubbles99'];

export const bubbleStreamPathConfig: EmitterConfigV3 = {
  lifetime: {
    min: 1.8,
    max: 2,
  },
  frequency: 0.1,
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
              value: 0.16,
            },
          ],
        },
      },
    },
    {
      type: 'movePath',
      config: {
        path: 'sin(x/10)*20',
        speed: {
          list: [
            {
              time: 0,
              value: 150,
            },
            {
              time: 1,
              value: 100,
            },
          ],
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
              time: 0,
              value: 0.3,
            },
            {
              time: 1,
              value: 0.4,
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
        maxSpeed: 20,
        minStart: 270,
        maxStart: 270,
      },
    },
    {
      type: 'spawnPoint',
      config: {},
    },
  ],
};
