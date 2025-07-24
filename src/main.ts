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

  let playerMoney = 100;
  let currentBet = 0;

  const moneyText = new Text({
    text: `Money: $${playerMoney}`,
    style: { fontFamily: 'monospace', fontSize: 20, fill: 0xffffff },
  });
  moneyText.position.set(10, 10);
  app.stage.addChild(moneyText);

  const betText = new Text({
    text: `Current Bet: $${currentBet}`,
    style: { fontFamily: 'monospace', fontSize: 20, fill: 0xffffff },
  });
  betText.position.set(10, 40);
  app.stage.addChild(betText);

  const infoText = new Text({
    text: 'Place your bet!',
    style: { fontFamily: 'monospace', fontSize: 28, fill: 0xffff00 },
  });
  infoText.anchor.set(0.5);
  app.stage.addChild(infoText);

  const placeBetButton = new Button('Bet $10', () => {
    if (playerMoney >= 10) {
      playerMoney -= 10;
      currentBet += 10;
      moneyText.text = `Money: $${playerMoney}`;
      betText.text = `Current Bet: $${currentBet}`;
      infoText.text = 'Bet placed! Start the game!';
      startGameButton.visible = true;
      positionElements();
    } else {
      infoText.text = 'Not enough money!';
      positionElements();
    }
  });

  const startGameButton = new Button('Start Game', () => {
    if (currentBet === 0) {
      infoText.text = 'Please place a bet first!';
      return;
    }

    startGameButton.visible = false;
    placeBetButton.visible = false;
    hitButton.visible = true;
    stickButton.visible = true;

    deck.reset();

    dealerHand.push(new CardSprite(deck.draw()!));
    facedownCard = deck.draw()!;
    facedownSprite = new CardSprite(facedownCard, true);
    dealerHand.push(facedownSprite);

    playerHand.push(new CardSprite(deck.draw()!));
    playerHand.push(new CardSprite(deck.draw()!));

    infoText.text = 'Your turn!';
    renderHands();
    positionElements();
  });

  const hitButton = new Button('Hit', () => {
    const card = deck.draw();
    if (!card) {
      infoText.text = 'Deck is empty!';
      return;
    }
    playerHand.push(new CardSprite(card));
    renderHands();

    const playerValue = calculateHandValue(playerHand);
    if (playerValue > 21) {
      infoText.text = `You bust! You lost $${currentBet}`;
      facedownSprite.reveal(facedownCard);
      renderHands();
      positionElements();
      currentBet = 0;
      betText.text = `Current Bet: $${currentBet}`;
      endRound();
    } else {
      infoText.text = `You drew a card`;
    }
  });

  const stickButton = new Button('Stick', () => {
    facedownSprite.reveal(facedownCard);
    renderHands();

    const playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    while (dealerValue < 17) {
      dealerHand.push(new CardSprite(deck.draw()!));
      dealerValue = calculateHandValue(dealerHand);
      renderHands();
    }

    let result = `You: ${playerValue} | Dealer: ${dealerValue}\n`;

    if (dealerValue > 21 || playerValue > dealerValue) {
      result += `You win! You earned $${currentBet * 2}`;
      playerMoney += currentBet * 2;
    } else if (playerValue < dealerValue) {
      result += `Dealer wins! You lost $${currentBet}`;
    } else {
      result += `Push! You get back $${currentBet}`;
      playerMoney += currentBet;
    }

    moneyText.text = `Money: $${playerMoney}`;
    currentBet = 0;
    betText.text = `Current Bet: $${currentBet}`;
    infoText.text = result;
    endRound();
    positionElements();
  });

  const playAgainButton = new Button('Play Again', () => {
    resetGame();
  });

  function endRound() {
    hitButton.visible = false;
    stickButton.visible = false;
    playAgainButton.visible = true;
    renderHands();
  }

  playAgainButton.visible = false;
  hitButton.visible = false;
  stickButton.visible = false;
  startGameButton.visible = false;

  app.stage.addChild(hitButton, stickButton, playAgainButton, placeBetButton, startGameButton);

  function resetGame() {
    for (const card of playerHand) app.stage.removeChild(card);
    for (const card of dealerHand) app.stage.removeChild(card);
    playerHand.length = 0;
    dealerHand.length = 0;

    currentBet = 0;
    betText.text = `Current Bet: $${currentBet}`;

    infoText.text = 'Place your bet!';
    placeBetButton.visible = true;
    startGameButton.visible = false;
    playAgainButton.visible = false;

    renderHands();
    positionElements();
  }

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
    const spacing = 10;

    const buttons = [
      placeBetButton,
      startGameButton,
      hitButton,
      stickButton,
      playAgainButton,
    ].filter((btn) => btn.visible);

    let totalWidth =
      buttons.reduce((sum, btn) => sum + btn.width, 0) + spacing * (buttons.length - 1);
    let currentX = app.screen.width / 2 - totalWidth / 2;

    buttons.forEach((btn) => {
      btn.position.set(currentX, buttonY);
      currentX += btn.width + spacing;
    });

    renderHands();
  }

  positionElements();
  window.addEventListener('resize', positionElements);
}

init();
