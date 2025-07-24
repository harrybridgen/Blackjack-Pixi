export type Hand = 'player' | 'dealer';
import { Deck } from '../objects/CardDeck';
import type { Card } from '../objects/Card';

export class GameModel {
  public deck = new Deck();
  public playerMoney = 100;
  public currentBet = 0;
  public playerHand: Card[] = [];
  public dealerHand: Card[] = [];
  public dealerFacedown?: Card;

  resetHands() {
    this.playerHand = [];
    this.dealerHand = [];
    this.dealerFacedown = undefined;
  }

  calculateHandValue(hand: Card[]): number {
    let total = 0;
    let aceCount = 0;
    for (const card of hand) {
      total += card.score;
      if (card.value === 'A') aceCount++;
    }
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  }
}
