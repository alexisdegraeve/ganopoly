import { Component, Input } from '@angular/core';
import { Player } from '../models/player';
import { CommonModule } from '@angular/common';
import { BanknoteComponent } from '../banknote/banknote.component';
import { CardsComponent } from '../cards/cards.component';
import { map, Observable } from 'rxjs';
import { Card, CardType } from '../models/card';
import { GameService } from '../services/game.service';

@Component({
  selector: 'gano-info-player',
  imports: [CommonModule, BanknoteComponent, CardsComponent],
  templateUrl: './info-player.component.html',
  styleUrl: './info-player.component.scss'
})
export class InfoPlayerComponent {
  @Input() player: Player | null = null;
  mycards$ :Observable<Card[]>;

    constructor(private gameService: GameService) {
      this.mycards$ = this.getPropertiesCards();
    }

      getPropertiesCards(): Observable<Card[]> {
        return this.gameService.getCards()
        .pipe(
          map(cards =>
            cards
              .filter(card =>  this.player?.properties.includes(card.case))
          )
        );
      }
}
