import { Application, Text } from 'pixi.js';
import { Deck } from './objects/deck';
import { Button } from './objects/button';
import { CardSprite } from './objects/cardsprite';
async function init() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x1099bb,
  });

  document.body.appendChild(app.canvas);

  const deck = new Deck();

  const cardText = new Text({
    text: 'No card drawn yet.',
    style: {
      fontFamily: 'monospace',
      fontSize: 28,
      fill: 0xffff00,
    },
  });
  cardText.anchor.set(0.5);
  app.stage.addChild(cardText);

  const drawButton = new Button('Draw Card', () => {
    const card = deck.draw();

    const existing = app.stage.getChildByLabel('drawnCard');
    if (existing) {
      app.stage.removeChild(existing);
    }

    if (card) {
      cardText.visible = false;

      const cardSprite = new CardSprite(card);
      cardSprite.label = 'drawnCard';

      const cardX = app.screen.width / 2 - cardSprite.width / 2;
      const cardY = drawButton.y - cardSprite.height - 20; // 20px margin above the button

      cardSprite.position.set(cardX, cardY);
      app.stage.addChild(cardSprite);
    } else {
      cardText.text = 'Deck is empty!';
      cardText.visible = true;
    }

    positionElements();
  });

  app.stage.addChild(drawButton);

  const statsText = new Text({
    text: '',
    style: {
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0xffffff,
    },
  });
  statsText.x = 10;
  statsText.y = 10;
  app.stage.addChild(statsText);

  function positionElements() {
    cardText.position.set(app.screen.width / 2, app.screen.height / 2 - 100);

    drawButton.position.set(
      (app.screen.width - drawButton.width) / 2,
      app.screen.height - drawButton.height - 30
    );

    const card = app.stage.getChildByLabel('drawnCard') as CardSprite | null;
    if (card) {
      card.position.set(app.screen.width / 2 - card.width / 2, drawButton.y - card.height - 20);
    }
  }

  positionElements();
  window.addEventListener('resize', positionElements);

  app.ticker.add(() => {
    statsText.text =
      `FPS: ${app.ticker.FPS.toFixed(2)}\n` + `Elapsed: ${app.ticker.elapsedMS.toFixed(2)} ms`;
  });
}

init();
