import type { EmitterConfigV3 } from '@spd789562/particle-emitter';

export const spaceshipDestructionTextures = [
  'spaceship_weaponPod',
  'spaceship_leftWing',
  'spaceship_rightEngine',
  'spaceship_hullFront',
  'spaceship_rightWing',
  'spaceship_hullRear',
  'spaceship_leftEngine',
];

export const spaceshipDestructionConfig: EmitterConfigV3 = {
  lifetime: {
    min: 2,
    max: 2,
  },
  particlesPerWave: 8,
  frequency: 0.05,
  emitterLifetime: 0.06,
  maxParticles: 1000,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              time: 0,
              value: 100,
            },
            {
              time: 1,
              value: 50,
            },
          ],
        },
      },
    },
    {
      type: 'scaleStatic',
      config: {
        min: 1,
        max: 1,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            {
              time: 0,
              value: 'ffffff',
            },
            {
              time: 1,
              value: '666666',
            },
          ],
        },
      },
    },
    {
      type: 'rotation',
      config: {
        accel: 0,
        minSpeed: 30,
        maxSpeed: 360,
        minStart: 0,
        maxStart: 360,
      },
    },
    {
      type: 'textureOrdered',
      config: {
        textures: [
          'spaceship_weaponPod',
          'spaceship_leftWing',
          'spaceship_rightEngine',
          'spaceship_hullFront',
          'spaceship_weaponPod',
          'spaceship_rightWing',
          'spaceship_hullRear',
          'spaceship_leftEngine',
        ],
      },
    },
    {
      type: 'spawnBurst',
      config: {
        start: 0,
        spacing: 0,
        distance: 0,
      },
    },
  ],
};
