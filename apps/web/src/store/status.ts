import { createSignal } from 'solid-js';
import { leadingAndTrailing, throttle } from '@solid-primitives/scheduled';

const [fps, _setFps] = createSignal(0);
const [particleCounts, setParticleCounts] = createSignal(0);

const setFps = leadingAndTrailing(throttle, _setFps, 500);

export { fps, setFps, particleCounts, setParticleCounts };
