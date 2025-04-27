import { Component } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'gano-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  constructor(private gameService: GameService) {

  }
  startGame() {
    this.gameService.throwDice();
  }

}
