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
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop(); // pop() =  read and delete the last array position
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1800);
    }
  }
}
