import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { PropertyCardComponent } from "../property-card/property-card.component";

@Component({
  selector: 'gano-game',
  imports: [PropertyCardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  constructor(private gameService: GameService) {

  }
  startGame() {
    this.gameService.startGame().subscribe(() => {
      console.log(' loading finish');
      this.gameService.throwDice();
      this.gameService.distributeBillets();
    })

  }

  pickChance() {
      this.gameService.pickChanceCard();
  }


}
