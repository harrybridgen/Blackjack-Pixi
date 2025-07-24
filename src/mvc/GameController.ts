import { GameModel } from './gameModel';
import { GameView } from './gameView';
import type { ViewHandlers } from './gameView';

export class GameController {
  private model = new GameModel();
  private view!: GameView;

  async init() {
    const handlers: ViewHandlers = {
      onPlaceBet: () => this.placeBet(),
      onStartGame: () => this.startGame(),
      onHit: () => this.hit(),
      onStick: () => this.stick(),
      onPlayAgain: () => this.playAgain(),
      onResetGame: () => this.resetFullGame(),
    };
    this.view = new GameView(handlers);
    await this.view.init();
    this.updateTexts();
  }

  private updateTexts() {
    this.view.updateMoney(this.model.playerMoney);
    this.view.updateBet(this.model.currentBet);
  }

  private resetFullGame() {
    this.model.playerMoney = 100;
    this.updateTexts();
    this.mewRound();
  }

  private placeBet() {
    if (this.model.playerMoney >= 10) {
      this.model.playerMoney -= 10;
      this.model.currentBet += 10;
      this.updateTexts();
      this.view.updateInfo('Bet placed! Start the game!');
      this.view.startGameButton.visible = true;
      this.view.positionElements();
    } else {
      this.view.updateInfo('Not enough money!');
      this.view.positionElements();
    }
  }

  private startGame() {
    if (this.model.currentBet === 0) {
      this.view.updateInfo('Please place a bet first!');
      return;
    }

    this.view.startGameButton.visible = false;
    this.view.placeBetButton.visible = false;
    this.view.hitButton.visible = true;
    this.view.stickButton.visible = true;

    this.model.deck.reset();
    this.model.resetHands();

    this.model.dealerHand.push(this.model.deck.draw()!);
    this.model.dealerFacedown = this.model.deck.draw()!;

    this.model.playerHand.push(this.model.deck.draw()!);
    this.model.playerHand.push(this.model.deck.draw()!);

    this.view.updateInfo('Your turn!');
    this.view.renderHands(this.model.playerHand, this.model.dealerHand, this.model.dealerFacedown);
    this.view.positionElements();
  }

  private hit() {
    const card = this.model.deck.draw();
    if (!card) {
      this.view.updateInfo('Deck is empty!');
      return;
    }

    this.model.playerHand.push(card);
    this.view.renderHands(this.model.playerHand, this.model.dealerHand, this.model.dealerFacedown);

    const playerValue = this.model.calculateHandValue(this.model.playerHand);
    if (playerValue > 21) {
      this.view.updateInfo(`You bust! You lost $${this.model.currentBet}`);
      this.revealDealerCard();
      this.model.currentBet = 0;
      this.view.updateBet(this.model.currentBet);
      this.endRound();
    } else {
      this.view.updateInfo('You drew a card');
    }
    this.view.positionElements();
  }

  private stick() {
    this.revealDealerCard();

    const playerValue = this.model.calculateHandValue(this.model.playerHand);
    let dealerValue = this.model.calculateHandValue(this.model.dealerHand);

    while (dealerValue < 17) {
      const card = this.model.deck.draw();
      if (!card) break;
      this.model.dealerHand.push(card);
      dealerValue = this.model.calculateHandValue(this.model.dealerHand);
      this.view.renderHands(this.model.playerHand, this.model.dealerHand);
    }

    let result = `You: ${playerValue} | Dealer: ${dealerValue}\n`;
    if (dealerValue > 21 || playerValue > dealerValue) {
      result += `You win! You earned $${this.model.currentBet * 2}`;
      this.model.playerMoney += this.model.currentBet * 2;
    } else if (playerValue < dealerValue) {
      result += `Dealer wins! You lost $${this.model.currentBet}`;
    } else {
      result += `Push! You get back $${this.model.currentBet}`;
      this.model.playerMoney += this.model.currentBet;
    }

    this.updateTexts();
    this.model.currentBet = 0;
    this.view.updateBet(this.model.currentBet);
    this.view.updateInfo(result);
    this.endRound();
    this.view.positionElements();
  }

  private playAgain() {
    this.mewRound();
  }

  private revealDealerCard() {
    if (this.model.dealerFacedown) {
      this.model.dealerHand.push(this.model.dealerFacedown);
      this.model.dealerFacedown = undefined;
      this.view.renderHands(this.model.playerHand, this.model.dealerHand);
    }
  }

  private endRound() {
    this.view.hitButton.visible = false;
    this.view.stickButton.visible = false;
    if (this.model.playerMoney <= 0) {
      this.view.resetGameButton.visible = true;
      this.view.playAgainButton.visible = false;
    } else {
      this.view.playAgainButton.visible = true;
      this.view.resetGameButton.visible = false;
    }
    this.view.renderHands(this.model.playerHand, this.model.dealerHand);
  }

  private mewRound() {
    this.model.resetHands();
    this.model.deck.reset();
    this.model.currentBet = 0;
    this.view.updateBet(this.model.currentBet);
    this.view.updateInfo('Place your bet!');

    this.view.placeBetButton.visible = true;
    this.view.startGameButton.visible = false;
    this.view.playAgainButton.visible = false;
    this.view.resetGameButton.visible = false;

    this.view.renderHands(this.model.playerHand, this.model.dealerHand);
    this.view.positionElements();
  }
}
