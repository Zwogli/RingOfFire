import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collection, doc, docData, setDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { addDoc, updateDoc } from 'firebase/firestore';
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
  public gameId: string;
  game: Game; // variable : Typ Game

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const itemCollection = collection(this.firestore, 'games');
    this.item$ = collectionData(itemCollection);
    this.item$.subscribe((game) => {
      console.log('All games', game);
    });
  }

  async ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params)=>{
      this.gameId = params['id'];
      const itemDoc = doc(this.firestore, 'games', this.gameId);
      
      docData(itemDoc).subscribe((game: any) => {
        //update Game
        this.game.players = game.game.players;
        this.game.currentPlayer = game.game.currentPlayer;
        this.game.stack = game.game.stack;
        console.log(`update game: `,game, `gameID: ${this.gameId}`,itemDoc);
      });
    })
  }

  newGame() {
    this.game = new Game();
    // this.create();
  }

  /**
   * CRUD: Create = addDoc, Read, Update = setDoc, Delete
   * addDoc save {'key':'value}
   */
  // create(params){
  //   const coll = collection(this.firestore, 'games', params); // select firebase collection = *dt. sammlung*
  //   addDoc(coll, {game: this.game.toJson()}).then((gameInfo:any ) =>{
  //     console.log(gameInfo);
  //   });
  // }

  /**
   * Modulo "%" = rest operator
   */
  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop(); // pop() =  read and delete the last array position
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name)
      }
    });
  }

  updateGame() {
    const itemDoc = doc(this.firestore, 'games', this.gameId);
    updateDoc(itemDoc, this.game.toJson());
  }

}


