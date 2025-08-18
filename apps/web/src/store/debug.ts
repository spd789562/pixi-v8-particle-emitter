import { createStore, unwrap } from 'solid-js/store';

export enum DebugLocalStorageKey {
  DebugColor = 'debugColor',
  SpawnPointColor = 'spawnPointColor',
  DebugSpawn = 'debugSpawn',
}

export const [debugColor, setDebugColor] = createStore({
  fill: '#F5B8B8',
  stroke: '#991111',
  alpha: 0.2,
  strokeAlpha: 1,
});
export const [spawnPointColor, setSpawnPointColor] = createStore({
  stroke: '#000000',
  alpha: 0.2,
});

export const [debugSpawn, setDebugSpawn] = createStore({
  enabledPoint: false,
  enabledShape: false,
});

export function saveDebugToLocalStorage() {
  localStorage.setItem(
    DebugLocalStorageKey.DebugColor,
    JSON.stringify(unwrap(debugColor)),
  );
  localStorage.setItem(
    DebugLocalStorageKey.SpawnPointColor,
    JSON.stringify(unwrap(spawnPointColor)),
  );
  localStorage.setItem(
    DebugLocalStorageKey.DebugSpawn,
    JSON.stringify(unwrap(debugSpawn)),
  );
}

export function loadDebugFromLocalStorage() {
  const debugColor =
    localStorage.getItem(DebugLocalStorageKey.DebugColor) ?? '{}';
  const spawnPointColor =
    localStorage.getItem(DebugLocalStorageKey.SpawnPointColor) ?? '{}';
  const debugSpawn =
    localStorage.getItem(DebugLocalStorageKey.DebugSpawn) ?? '{}';
  try {
    setDebugColor(JSON.parse(debugColor));
    setSpawnPointColor(JSON.parse(spawnPointColor));
    setDebugSpawn(JSON.parse(debugSpawn));
  } catch (error) {
    console.error('Error loading debug settings from localStorage', error);
  }
}
