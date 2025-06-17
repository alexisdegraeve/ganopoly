import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ccCard } from '../models/ccCard';
import { GameService } from '../services/game.service';

@Component({
  selector: 'gano-community-card',
  imports: [],
  templateUrl: './community-card.component.html',
  styleUrl: './community-card.component.scss'
})
export class CommunityCardComponent {
  isFlipped = false;
  @Input() readOnly = false;
  @Input() communityCard: ccCard | undefined;
  @Output() communityCardEvent = new EventEmitter<ccCard>();

  constructor(private gameService: GameService) {
  }

  takeCard() {
    this.communityCard = this.gameService.pickCommunityCard();
    console.log('take card -- ', this.communityCard)
    this.isFlipped = true;
    this.communityCardEvent.emit(this.communityCard);
  }
}
