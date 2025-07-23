import { createSignal } from 'solid-js';

const [fps, setFps] = createSignal(0);
const [particleCounts, setParticleCounts] = createSignal(0);

export { fps, setFps, particleCounts, setParticleCounts };
