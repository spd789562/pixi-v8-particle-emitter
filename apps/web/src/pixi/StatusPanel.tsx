import { fps, particleCounts } from '@/store/status';

export function StatusPanel() {
  return (
    <div class="absolute top-0 left-0 bg-[rgba(0,0,0,0.5)] p-2 flex flex-col gap-2 text-white text-[12px]">
      <span>FPS: {fps().toFixed(2)}</span>
      <span>Particle Counts: {particleCounts()}</span>
    </div>
  );
}
