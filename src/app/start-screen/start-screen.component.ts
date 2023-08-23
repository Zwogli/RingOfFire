import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; //! need constructor!
import { Firestore, addDoc, collection } from 'firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private router: Router, private firestore: Firestore){}
  game!: Game;
  collectionInstance = collection(this.firestore, 'games');

  newGame(){
    this.game = new Game(); // create new Object
    addDoc(this.collectionInstance, this.game.toJson()).then((docRef) => {
      // Needs to be called docRef and points to the just created document
      console.log(docRef.id);
      console.log('Game created');
      this.router.navigateByUrl('/game/' + docRef.id); // Url = /game/id
    }).catch((err) => {
      console.log(err);
    }); 
  }
}
