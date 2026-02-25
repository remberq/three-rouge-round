import './style.css';

import { createBoardState } from './game/board';
import { createPixiApp, renderBoardPlaceholder } from './render/pixiRenderer';

async function main() {
  const host = document.querySelector<HTMLDivElement>('#app');
  if (!host) throw new Error('Missing #app root element');

  const app = await createPixiApp(host);
  const board = createBoardState({ cols: 8, rows: 8 });
  renderBoardPlaceholder(app, board);
}

main().catch((err) => {
  console.error(err);
});
