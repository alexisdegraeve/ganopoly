import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { ccCard } from '../models/ccCard';

@Component({
  selector: 'gano-chance-card',
  imports: [],
  templateUrl: './chance-card.component.html',
  styleUrl: './chance-card.component.scss'
})
export class ChanceCardComponent {
  isFlipped = false;
  chanceCard: ccCard | undefined;

  constructor(private gameService: GameService) {
  }

  takeCard() {
    this.chanceCard = this.gameService.pickChanceCard();
    console.log('this.chancecard ', this.chanceCard);
    this.isFlipped = true;
  }
}
