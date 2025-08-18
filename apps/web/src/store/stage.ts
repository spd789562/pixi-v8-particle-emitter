import { createStore } from 'solid-js/store';

export enum SageLocalStorageKey {
  BackgroundColor = 'backgroundColor',
  FollowMouse = 'followMouse',
}

export const [stageConfig, setStageConfig] = createStore({
  backgroundColor:
    localStorage.getItem(SageLocalStorageKey.BackgroundColor) ?? '#dedede',
  backgroundImage: '',
  backgroundImageScale: 1,
  backgroundImageAlpha: 1,
  followMouse: localStorage.getItem(SageLocalStorageKey.FollowMouse) === 'true',
});

export const [particleOwnerPosition, setParticleOwnerPosition] = createStore({
  x: 0,
  y: 0,
});

export const [screenCenter, setScreenCenter] = createStore({
  x: 0,
  y: 0,
});

export function setStageBackgroundColor(color: string) {
  setStageConfig('backgroundColor', color);
  localStorage.setItem(SageLocalStorageKey.BackgroundColor, color);
}
export function setStageFollowMouse(followMouse: boolean) {
  setStageConfig('followMouse', followMouse);
  localStorage.setItem(SageLocalStorageKey.FollowMouse, followMouse.toString());
}
