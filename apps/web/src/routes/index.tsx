import { PixiApp } from '@/pixi/App';
import { Panel } from '@/components/panel/panel';

export default function Home() {
  return (
    <main class="flex h-full w-full">
      <div class="flex-1 overflow-hidden">
        <PixiApp />
      </div>
      <div class="w-[400px] shrink-0 shadow p-4">
        <Panel />
      </div>
    </main>
  );
}
