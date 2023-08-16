import { Component } from '@angular/core';
import { Router } from '@angular/router'; //! need constructor!

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private router: Router){}

  newGame(){
    //Start Game
    this.router.navigateByUrl('/game');
  }
}
