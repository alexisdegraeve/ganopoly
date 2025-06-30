import { Billet } from './../models/billet';
import { Component, Input, OnInit } from '@angular/core';
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
export class InfoPlayerComponent implements OnInit {
  private _player: BehaviorSubject<Player> | null = null;
  // decomposedBillets: { euro: number; quantityUsed: number; color: string }[] = [];
  // decomposedBillets = this.decomposerMontant(this.player?.value?.solde ?? 0) || [];

  billetsDisponibles = [
    { euro: 500, quantity: 2, color: 'orange' },
    { euro: 100, quantity: 4, color: 'salmon' },
    { euro: 50, quantity: 1, color: 'purple' },
    { euro: 20, quantity: 1, color: 'green' },
    { euro: 10, quantity: 2, color: 'cyan' },
    { euro: 5, quantity: 1, color: 'pink' },
    { euro: 1, quantity: 5, color: 'white' },
  ];
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
  ngOnInit(): void {
    // if (this.player) {
    //   this.player.subscribe(player => {
    //     if (player) {
    //       this.decomposedBillets = this.decomposerMontant(player.solde) || [];
    //     }
    //   });
    // }

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

decomposerMontant(montant: number): { euro: number; quantityUsed: number; color: string }[] | null {
  let reste = montant;

  // Clone uniquement pour traitement visuel
  const resultat = this.billetsDisponibles.map(b => ({ ...b, quantityUsed: 0 }));

  // ⚠️ Tri du plus grand au plus petit billet (pas l’inverse)
  resultat.sort((a, b) => b.euro - a.euro);

  for (const billet of resultat) {
    if (reste <= 0) break;
    const utilisables = Math.min(Math.floor(reste / billet.euro), billet.quantity);
    billet.quantityUsed = utilisables;
    reste -= utilisables * billet.euro;
  }

  if (reste > 0) {
    return null; // Pas possible de faire l'opération
  }

  // ❌ Ne touche pas à billetsDisponibles ici !
  return resultat.filter(b => b.quantityUsed > 0);
}


}
