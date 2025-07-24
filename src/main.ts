import { GameController } from './mvc/GameController';

async function init() {
  const controller = new GameController();
  await controller.init();
}

init();
