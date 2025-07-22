import { createSignal } from 'solid-js';

const [fps, setFps] = createSignal(0);

export { fps, setFps };
