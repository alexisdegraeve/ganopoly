import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() chanceCardEvent = new EventEmitter<ccCard>();

  constructor(private gameService: GameService) {
  }

  takeCard() {
    this.chanceCard = this.gameService.pickChanceCard();
    this.isFlipped = true;
    this.chanceCardEvent.emit(this.chanceCard);
  }
}
