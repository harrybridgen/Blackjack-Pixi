import type { Card } from './Card';

const suits = ['♠', '♥', '♦', '♣'];
const values = [
  { value: 'A', score: 11 },
  { value: '2', score: 2 },
  { value: '3', score: 3 },
  { value: '4', score: 4 },
  { value: '5', score: 5 },
  { value: '6', score: 6 },
  { value: '7', score: 7 },
  { value: '8', score: 8 },
  { value: '9', score: 9 },
  { value: '10', score: 10 },
  { value: 'J', score: 10 },
  { value: 'Q', score: 10 },
  { value: 'K', score: 10 },
];

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.cards = [];

    for (const suit of suits) {
      for (const { value, score } of values) {
        this.cards.push({ suit, value, score });
      }
    }

    this.shuffle();
  }

  private shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined {
    return this.cards.pop();
  }

  get count(): number {
    return this.cards.length;
  }
}
