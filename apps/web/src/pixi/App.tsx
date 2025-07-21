import { onMount, onCleanup } from 'solid-js';
import { Application, Text } from 'pixi.js';

export function PixiApp() {
  let containerRef!: HTMLDivElement;

  onMount(async () => {
    const app = new Application();
    await app.init({
      width: 800,
      height: 600,
      resizeTo: containerRef,
      backgroundColor: 0xdedede,
      hello: true,
    });

    const text = new Text({
      text: 'Hello from pixi',
      resolution: 2,
    });
    app.stage.addChild(text);

    containerRef.appendChild(app.canvas);

    onCleanup(() => {
      containerRef.removeChild(app.canvas);
      app.destroy();
    });
  });

  return <div class="w-full h-full" ref={containerRef} />;
}
