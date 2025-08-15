import { createStore } from 'solid-js/store';

export const [stageConfig, setStageConfig] = createStore({
  backgroundColor: '#dedede',
  backgroundImage: '',
  backgroundImageScale: 1,
  backgroundImageAlpha: 1,
  followMouse: false,
});

export const [particleOwnerPosition, setParticleOwnerPosition] = createStore({
  x: 0,
  y: 0,
});

export const [screenCenter, setScreenCenter] = createStore({
  x: 0,
  y: 0,
});
