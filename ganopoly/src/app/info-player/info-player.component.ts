import { Billet } from './../models/billet';
import { Component, Input } from '@angular/core';
import { Player } from '../models/player';
import { CommonModule } from '@angular/common';
import { BanknoteComponent } from '../banknote/banknote.component';
import { CardsComponent } from '../cards/cards.component';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Card } from '../models/card';
import { GameService } from '../services/game.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'gano-info-player',
  imports: [CommonModule, BanknoteComponent, CardsComponent],
  templateUrl: './info-player.component.html',
  styleUrl: './info-player.component.scss'
})
export class InfoPlayerComponent {
  private _player: BehaviorSubject<Player> | null = null;
  @Input() isHuman = false;

  @Input()
  set player(value: BehaviorSubject<Player> | null) {
    this._player = value;
    this.updateMyCards(value);
  }

  get player(): BehaviorSubject<Player> | null {
    return this._player;
  }

  mycards$: Observable<Card[]> = new Observable<Card[]>();

  constructor(private gameService: GameService) {
  }


  updateMyCards(value: BehaviorSubject<Player> | null) {
    if (value) {
      this.mycards$ = combineLatest([
        value,
        this.gameService.getCards() // La liste des cartes
      ]).pipe(
        map(([player, cards]) =>
          cards.filter(card => player.properties.includes(card.case))
        )
      );
    }
  }

  get playerTotal() {
    let total = 0;
    this.player?.value?.billets.forEach((billet: Billet) => {
      total += (billet.quantity * billet.euro);
    });
    return total;
  }
}
