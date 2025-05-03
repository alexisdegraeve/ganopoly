import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { PropertyCardComponent } from "../property-card/property-card.component";
import { BoardComponent } from "../board/board.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gano-game',
  imports: [PropertyCardComponent, BoardComponent, HeaderComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  protected cards$: any;
  rotation = 0;
  showCards = false;

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

  rotateBoard() {
    this.rotation = this.rotation <= 360 ? this.rotation + 90 : 0;
  }

}
