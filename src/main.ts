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

  const playerHand: CardSprite[] = [];
  const dealerHand: CardSprite[] = [];
  const deck = new Deck();

  dealerHand.push(new CardSprite(deck.draw()!));
  dealerHand.push(new CardSprite(deck.draw()!));
  renderHand(dealerHand, 40); // Dealer hand at top

  const infoText = new Text({
    text: 'No card drawn yet.',
    style: {
      fontFamily: 'monospace',
      fontSize: 28,
      fill: 0xffff00,
    },
  });

  infoText.anchor.set(0.5);
  app.stage.addChild(infoText);

  const drawButton = new Button('Draw Card', () => {
    const card = deck.draw();
    if (!card) {
      infoText.text = 'Deck is empty!';
      infoText.visible = true;
      return;
    }

    infoText.visible = false;

    const cardSprite = new CardSprite(card);
    playerHand.push(cardSprite);
    renderHand(playerHand, app.screen.height - drawButton.height - 180);
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

  function renderHand(hand: CardSprite[], y: number) {
    for (const card of hand) app.stage.removeChild(card);

    const cardSpacing = 70;
    const baseCardWidth = 100;
    const totalWidth = (hand.length - 1) * cardSpacing + baseCardWidth;
    const startX = app.screen.width / 2 - totalWidth / 2;

    hand.forEach((card, index) => {
      card.position.set(startX + index * cardSpacing, y);
      app.stage.addChild(card);
    });
  }

  function positionElements() {
    infoText.position.set(app.screen.width / 2, app.screen.height / 2);

    drawButton.position.set(
      (app.screen.width - drawButton.width) / 2,
      app.screen.height - drawButton.height - 20
    );

    renderHand(playerHand, app.screen.height - drawButton.height - 180);
    renderHand(dealerHand, 40);
  }

  positionElements();
  window.addEventListener('resize', positionElements);

  app.ticker.add(() => {
    statsText.text =
      `FPS: ${app.ticker.FPS.toFixed(2)}\n` + `Elapsed: ${app.ticker.elapsedMS.toFixed(2)} ms`;
  });
}

init();
