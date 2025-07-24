import { Application, Text } from 'pixi.js';
import { Deck } from './objects/deck';
import { Button } from './objects/button';
import { CardSprite } from './objects/cardsprite';
import type { Card } from './objects/card';

async function init() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.canvas);

  const deck = new Deck();

  const playerHand: CardSprite[] = [];
  const dealerHand: CardSprite[] = [];

  let facedownCard: Card;
  let facedownSprite: CardSprite;

  dealerHand.push(new CardSprite(deck.draw()!));
  facedownCard = deck.draw()!;
  facedownSprite = new CardSprite(facedownCard, true);
  dealerHand.push(facedownSprite);

  playerHand.push(new CardSprite(deck.draw()!));
  playerHand.push(new CardSprite(deck.draw()!));

  const infoText = new Text({
    text: 'Your turn!',
    style: {
      fontFamily: 'monospace',
      fontSize: 28,
      fill: 0xffff00,
    },
  });

  infoText.anchor.set(0.5);
  app.stage.addChild(infoText);

  const hitButton = new Button('Hit', () => {
    const card = deck.draw();
    if (!card) {
      infoText.text = 'Deck is empty!';
      infoText.visible = true;
      return;
    }
    playerHand.push(new CardSprite(card));
    renderHands();

    const playerValue = calculateHandValue(playerHand);
    if (playerValue > 21) {
      infoText.text = `You bust!`;
      facedownSprite.reveal(facedownCard);
      renderHands();

      hitButton.visible = false;
      stickButton.visible = false;
      playAgainButton.visible = true;
    } else {
      infoText.text = `You drew a card`;
    }
  });

  const playAgainButton = new Button('Play Again', () => {
    resetGame();
  });

  playAgainButton.visible = false;
  app.stage.addChild(playAgainButton);

  const stickButton = new Button('Stick', () => {
    facedownSprite.reveal(facedownCard);
    renderHands();

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    let result = `You: ${playerValue} | Dealer: ${dealerValue}\n`;

    if (dealerValue > 21 || playerValue > dealerValue) {
      result += 'You win!';
    } else if (playerValue < dealerValue) {
      result += 'Dealer wins!';
    } else {
      result += 'Push!';
    }

    infoText.text = result;
    hitButton.visible = false;
    stickButton.visible = false;
    playAgainButton.visible = true;
  });

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

  app.stage.addChild(hitButton, stickButton);

  function calculateHandValue(hand: CardSprite[]): number {
    let total = 0;
    let aceCount = 0;

    for (const sprite of hand) {
      const card = sprite.getCard();
      if (card) {
        total += card.score;
        if (card.value === 'A') aceCount++;
      }
    }

    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }

    return total;
  }
  function resetGame() {
    for (const card of playerHand) app.stage.removeChild(card);
    for (const card of dealerHand) app.stage.removeChild(card);
    playerHand.length = 0;
    dealerHand.length = 0;

    deck.reset();

    dealerHand.push(new CardSprite(deck.draw()!));
    facedownCard = deck.draw()!;
    facedownSprite = new CardSprite(facedownCard, true);
    dealerHand.push(facedownSprite);

    playerHand.push(new CardSprite(deck.draw()!));
    playerHand.push(new CardSprite(deck.draw()!));

    infoText.text = 'Your turn!';
    hitButton.visible = true;
    stickButton.visible = true;
    playAgainButton.visible = false;

    renderHands();
    positionElements();
  }

  function renderHands() {
    renderHand(playerHand, app.screen.height - hitButton.height - 180);
    renderHand(dealerHand, 40);
  }

  function renderHand(hand: CardSprite[], y: number) {
    for (const card of hand) app.stage.removeChild(card);

    const spacing = 70;
    const cardW = 100;
    const totalW = (hand.length - 1) * spacing + cardW;
    const startX = app.screen.width / 2 - totalW / 2;

    hand.forEach((card, i) => {
      card.position.set(startX + i * spacing, y);
      app.stage.addChild(card);
    });
  }

  function positionElements() {
    infoText.position.set(app.screen.width / 2, app.screen.height / 2);

    const buttonY = app.screen.height - 60;
    const buttonSpacing = 10;
    const totalWidth = hitButton.width + stickButton.width + buttonSpacing;
    const startX = app.screen.width / 2 - totalWidth / 2;

    hitButton.position.set(startX, buttonY);
    stickButton.position.set(startX + hitButton.width + buttonSpacing, buttonY);
    playAgainButton.position.set(app.screen.width / 2 - playAgainButton.width / 2, buttonY);

    renderHands();
  }

  positionElements();
  window.addEventListener('resize', positionElements);

  app.ticker.add(() => {
    statsText.text =
      `FPS: ${app.ticker.FPS.toFixed(2)}\n` + `Elapsed: ${app.ticker.elapsedMS.toFixed(2)} ms`;
  });
}

init();
