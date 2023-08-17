import { Component } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game; // variable : Typ Game

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop(); // pop() =  read and delete the last array position
      this.pickCardAnimation = true;

      console.log(this.game);

      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        console.log('New Card: ' + this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }
}
