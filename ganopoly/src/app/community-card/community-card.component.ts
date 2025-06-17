import { Component } from '@angular/core';
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
  communityCard: ccCard | undefined;

  constructor(private gameService: GameService) {
  }

  takeCard() {
    this.communityCard = this.gameService.pickCommunityCard();
    this.isFlipped = true;
  }
}
