import { Application, Text } from 'pixi.js';
import { Button } from '../objects/button';
import { CardSprite } from '../objects/cardsprite';
import type { Card } from '../objects/card';

export type ViewHandlers = {
  onPlaceBet: () => void;
  onStartGame: () => void;
  onHit: () => void;
  onStick: () => void;
  onPlayAgain: () => void;
};

export class GameView {
  public readonly app = new Application();
  public readonly moneyText: Text;
  public readonly betText: Text;
  public readonly infoText: Text;

  public readonly placeBetButton: Button;
  public readonly startGameButton: Button;
  public readonly hitButton: Button;
  public readonly stickButton: Button;
  public readonly playAgainButton: Button;

  private playerSprites: CardSprite[] = [];
  private dealerSprites: CardSprite[] = [];

  private handlers: ViewHandlers;

  constructor(handlers: ViewHandlers) {
    this.handlers = handlers;

    this.moneyText = new Text({
      text: 'Money: $0',
      style: { fontFamily: 'monospace', fontSize: 20, fill: 0xffffff },
    });
    this.moneyText.position.set(10, 10);

    this.betText = new Text({
      text: 'Current Bet: $0',
      style: { fontFamily: 'monospace', fontSize: 20, fill: 0xffffff },
    });
    this.betText.position.set(10, 40);

    this.infoText = new Text({
      text: 'Place your bet!',
      style: { fontFamily: 'monospace', fontSize: 28, fill: 0xffff00 },
    });
    this.infoText.anchor.set(0.5);

    this.placeBetButton = new Button('Bet $10', this.handlers.onPlaceBet);
    this.startGameButton = new Button('Start Game', this.handlers.onStartGame);
    this.hitButton = new Button('Hit', this.handlers.onHit);
    this.stickButton = new Button('Stick', this.handlers.onStick);
    this.playAgainButton = new Button('Play Again', this.handlers.onPlayAgain);

    this.hitButton.visible = false;
    this.stickButton.visible = false;
    this.startGameButton.visible = false;
    this.playAgainButton.visible = false;
  }

  async init() {
    await this.app.init({ resizeTo: window, backgroundColor: 0x1099bb });
    document.body.appendChild(this.app.canvas);
    this.app.stage.addChild(
      this.moneyText,
      this.betText,
      this.infoText,
      this.placeBetButton,
      this.startGameButton,
      this.hitButton,
      this.stickButton,
      this.playAgainButton
    );
    this.positionElements();
    window.addEventListener('resize', () => this.positionElements());
  }

  updateMoney(value: number) {
    this.moneyText.text = `Money: $${value}`;
  }

  updateBet(value: number) {
    this.betText.text = `Current Bet: $${value}`;
  }

  updateInfo(text: string) {
    this.infoText.text = text;
  }

  renderHands(player: Card[], dealer: Card[], facedown?: Card) {
    this.renderHand(
      this.playerSprites,
      player,
      this.app.screen.height - this.hitButton.height - 180
    );

    const dealerCards = facedown ? [...dealer, facedown] : dealer;
    const facedownIndex = facedown ? dealerCards.length - 1 : -1;
    this.renderHand(this.dealerSprites, dealerCards, 40, facedownIndex);
  }

  private renderHand(target: CardSprite[], cards: Card[], y: number, facedownIndex = -1) {
    for (const sprite of target) this.app.stage.removeChild(sprite);
    target.length = 0;

    const spacing = 70;
    const cardW = 100;
    const totalW = (cards.length - 1) * spacing + cardW;
    const startX = this.app.screen.width / 2 - totalW / 2;

    cards.forEach((card, i) => {
      const sprite = new CardSprite(card, i === facedownIndex);
      sprite.position.set(startX + i * spacing, y);
      target.push(sprite);
      this.app.stage.addChild(sprite);
    });
  }

  positionElements() {
    this.infoText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

    const buttonY = this.app.screen.height - 60;
    const spacing = 10;
    const buttons = [
      this.placeBetButton,
      this.startGameButton,
      this.hitButton,
      this.stickButton,
      this.playAgainButton,
    ].filter((btn) => btn.visible);

    let totalWidth =
      buttons.reduce((sum, btn) => sum + btn.width, 0) + spacing * (buttons.length - 1);
    let currentX = this.app.screen.width / 2 - totalWidth / 2;

    buttons.forEach((btn) => {
      btn.position.set(currentX, buttonY);
      currentX += btn.width + spacing;
    });
  }
}
