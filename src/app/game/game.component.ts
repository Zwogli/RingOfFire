import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { addDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent {
  firestore: Firestore = inject(Firestore);
  games$: Observable<any>;
  games: Array<string> = [];
  public currentGameId!: string;
  public currentGame!: any;

  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game; // variable : Typ Game
  itemCollection: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(this.itemCollection);
  }

  ngOnInit() {
    this.loadGame();
    this.updateGame();
    this.route.params.subscribe((params) =>{
      console.log(params);
    })
  }

  async loadGame() {
    this.currentGameId = this.route.snapshot.url[1].path;
    const docRef = doc(this.firestore, "games", this.currentGameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.currentGame = docSnap.data();
      this.game = this.currentGame;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  async updateGame() {
    this.currentGame = onSnapshot(doc(this.firestore, "games", this.currentGameId), (doc) => {
      console.log("Current data: ", doc.data());
      this.currentGame = doc.data();
      this.game = this.currentGame;
    });
  }

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
}

