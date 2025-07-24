import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Card } from './card';

export class CardSprite extends Container {
  private background: Graphics;
  private valueText: Text;
  private suitText: Text;
  protected cardWidth = 100;
  protected cardHeight = 150;

  constructor(card: Card) {
    super();

    this.background = new Graphics();
    this.background
      .fill({ color: 0xffffff })
      .stroke({ color: 0x000000, width: 2 })
      .roundRect(0, 0, this.cardWidth, this.cardHeight, 10)
      .fill();

    this.valueText = new Text({
      text: card.value,
      style: new TextStyle({
        fontSize: 20,
        fill: 0x000000,
        fontFamily: 'monospace',
      }),
    });
    this.valueText.x = 8;
    this.valueText.y = 8;

    const isRedSuit = card.suit === '♥' || card.suit === '♦';
    const suitColor = isRedSuit ? 0xff0000 : 0x000000;

    this.suitText = new Text({
      text: card.suit,
      style: new TextStyle({
        fontSize: 40,
        fill: suitColor,
        fontFamily: 'monospace',
      }),
    });

    this.suitText.anchor.set(0.5);
    this.suitText.x = this.cardWidth / 2;
    this.suitText.y = this.cardHeight / 2;

    this.addChild(this.background, this.valueText, this.suitText);
  }
}
