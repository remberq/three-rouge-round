import { Application } from 'pixi.js';

export async function createPixiApp(host: HTMLElement) {
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: 0x0b1020,
    antialias: true,
  });

  host.appendChild(app.canvas);
  return app;
}
