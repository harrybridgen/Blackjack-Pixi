import { GameController } from './mvc/gameController';

async function init() {
  const controller = new GameController();
  await controller.init();
}

init();
