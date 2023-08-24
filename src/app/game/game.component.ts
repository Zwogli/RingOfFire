import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, arrayUnion, collection, collectionData, doc, docData, updateDoc} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  item$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  pickCardAnimation = false;
  currentCard: string = '';
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
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop(); // pop() =  read and delete the last array position
      this.pickCardAnimation = true;
      this.saveGame();

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();

      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    const itemDoc = doc(this.firestore, 'games', this.gameId);
    updateDoc(itemDoc, this.game.toJson());
  }

}


