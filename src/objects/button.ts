import { Container, Graphics, Text, TextStyle, Rectangle } from 'pixi.js';

export class Button extends Container {
  private background: Graphics;
  private textLabel: Text;
  protected btnWidth = 150;
  protected btnHeight = 50;

  constructor(text: string, onClick: () => void) {
    super();

    this.background = new Graphics();
    this.textLabel = new Text({
      text,
      style: new TextStyle({
        fontSize: 18,
        fill: 0xffffff,
        fontFamily: 'monospace',
      }),
    });

    this.textLabel.anchor.set(0.5);
    this.textLabel.position.set(this.btnWidth / 2, this.btnHeight / 2);

    this.drawDefault();

    this.background.eventMode = 'static';
    this.background.cursor = 'pointer';
    this.background.hitArea = new Rectangle(0, 0, this.btnWidth, this.btnHeight);

    this.background.on('pointertap', onClick);
    this.background.on('pointerover', () => this.drawHover());
    this.background.on('pointerout', () => this.drawDefault());

    this.addChild(this.background, this.textLabel);
  }

  private drawDefault() {
    this.background.clear();
    this.background.fill(0x333333);
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill();
  }

  private drawHover() {
    this.background.clear();
    this.background.fill(0x555555);
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill();
  }
}
