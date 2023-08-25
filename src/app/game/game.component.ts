import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, updateDoc} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  item$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  gameId: string;
  game: Game; // variable : Typ Game

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const itemCollection = collection(this.firestore, 'games');
    this.item$ = collectionData(itemCollection);
    this.item$.subscribe((game) => {
      console.log('gameInfo', game);
    });
  }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params)=>{
      this.gameId = params['id'];
      const itemDoc = doc(this.firestore, 'games', this.gameId);
      
      docData(itemDoc).subscribe((game: any) => {
        //update Game
        this.game.players = game.game.players;
        this.game.currentPlayer = game.game.currentPlayer;
        this.game.stack = game.game.stack;
        this.game.pickCardAnimation = game.game.pickCardAnimation;
        this.game.currentCard = game.game.currentCard;
        this.game.playedCard = game.game.playedCard;
      });
    })
  }

  newGame() {
    this.game = new Game();
  }

  /**
   * Modulo "%" = rest operator
   */
  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop(); // pop() =  read and delete the last array position
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();

      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(async name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const itemDoc = doc(this.firestore, 'games', this.gameId);
    await updateDoc(itemDoc, { game: this.game.toJson() });
    console.log('update game', this.game);

  //   const documentReference = doc(this.firestore, `games/${this.gameId}`);
  //   return docData(documentReference, { game: this.game.toJson()});
  // }
  }
}
