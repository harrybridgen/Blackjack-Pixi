import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Card } from './card';

export class CardSprite extends Container {
  private background: Graphics;
  private valueText?: Text;
  private suitText?: Text;
  protected cardWidth = 100;
  protected cardHeight = 150;

  constructor(card: Card, facedown: boolean = false) {
    super();

    this.background = new Graphics()
      .roundRect(0, 0, this.cardWidth, this.cardHeight, 10)
      .fill({ color: 0xffffff })
      .stroke({ color: 0x000000, width: 2 });

    this.addChild(this.background);

    if (facedown) {
      this.renderBack();
    } else {
      this.renderFront(card);
    }
  }

  private renderFront(card: Card) {
    const isRedSuit = card.suit === '♥' || card.suit === '♦';
    const suitColor = isRedSuit ? 0xff0000 : 0x000000;

    this.valueText = new Text({
      text: card.value,
      style: new TextStyle({
        fontSize: 20,
        fill: suitColor,
        fontFamily: 'monospace',
      }),
    });
    this.valueText.x = 8;
    this.valueText.y = 8;

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

    this.addChild(this.valueText, this.suitText);
  }

  private renderBack() {
    const pattern = new Graphics()
      .fill({ color: 0x333366 })
      .rect(10, 10, this.cardWidth - 20, this.cardHeight - 20);
    this.addChild(pattern);
  }

  public reveal(card: Card) {
    this.removeChildren();
    this.background
      .clear()
      .roundRect(0, 0, this.cardWidth, this.cardHeight, 10)
      .fill({ color: 0xffffff })
      .stroke({ color: 0x000000, width: 2 });
    this.addChild(this.background);
    this.renderFront(card);
  }
}
