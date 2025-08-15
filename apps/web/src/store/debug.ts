import { createStore } from 'solid-js/store';

export const [debugColor, setDebugColor] = createStore({
  fill: '#991111',
  stroke: '#991111',
  alpha: 0.2,
  strokeAlpha: 1,
});
export const [spawnPointColor, setSpawnPointColor] = createStore({
  stroke: '#000000',
  alpha: 0.2,
});

export const [debugSpawn, setDebugSpawn] = createStore({
  enabledPoint: true,
  enabledShape: true,
});
