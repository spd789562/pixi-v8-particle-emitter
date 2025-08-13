import { createStore } from 'solid-js/store';

export const [syncConfig, setSyncConfig] = createStore({
  lifetime: false,
  speed: false,
  rotation: false,
});
