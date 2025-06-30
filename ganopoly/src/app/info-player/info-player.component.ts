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
import { CommunityCardComponent } from "../community-card/community-card.component";
import { ChanceCardComponent } from '../chance-card/chance-card.component';

@Component({
  selector: 'gano-info-player',
  imports: [CommonModule, BanknoteComponent, CardsComponent, CommunityCardComponent, ChanceCardComponent],
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
          cards.filter(card =>
            player.properties.some(p => p.index === card.case)
          )
        )
      );
    }
  }

  get playerTotal() {
    // let total = 0;
    // this.player?.value?.billets.forEach((billet: Billet) => {
    //   total += (billet.quantity * billet.euro);
    // });
    return this.player?.value?.solde; // total;
  }

  decomposerMontant(montant: number) {

      const billetsTypes = [
    { euro: 500, quantity: Infinity, color: 'orange' },
    { euro: 100, quantity: Infinity, color: 'salmon' },
    { euro: 50, quantity: Infinity, color: 'purple' },
    { euro: 20, quantity: Infinity, color: 'green' },
    { euro: 10, quantity: Infinity, color: 'cyan' },
    { euro: 5, quantity: Infinity, color: 'pink' },
    { euro: 1, quantity: Infinity, color: 'white' },
  ];

    let reste = montant;
    const resultat = billetsTypes.map(billet => ({ ...billet, quantityUsed: 0 }));
    for (const billet of resultat) {
      if (reste <= 0) break;
      const maxUtilisable = Math.min(Math.floor(reste / billet.euro), billet.quantity);
      billet.quantityUsed = maxUtilisable;
      reste -= maxUtilisable * billet.euro;
    }
    if (reste > 0) {
      // pas possible de faire la décomposition exacte
      return null;
    }
      return resultat.filter(b => b.quantityUsed > 0);
  }
}
