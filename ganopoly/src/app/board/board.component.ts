import { Component } from '@angular/core';

import { CellComponent } from "../cell/cell.component";
import { CommonModule } from '@angular/common';
import { Cell } from '../models/cell';
import { GameService } from '../services/game.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CardType } from '../models/card';

@Component({
  selector: 'gano-board',
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  topCards$: Observable<{
    name: string;
    ville: string;
    color: string;
    price: number;
    orientation: 'horizontal' | 'vertical';
    cardtype: CardType;
    isCorner: boolean;
  }[]>;


  leftCards$: Observable<{
    name: string;
    ville: string;
    color: string;
    price: number;
    orientation: 'horizontal' | 'vertical';
    cardtype: CardType;
    isCorner: boolean;
  }[]>;

  rightCards$: Observable<{
    name: string;
    ville: string;
    color: string;
    price: number;
    orientation: 'horizontal' | 'vertical';
    cardtype: CardType;
    isCorner: boolean;
  }[]>;


  bottomCards$: Observable<{
    name: string;
    ville: string;
    color: string;
    price: number;
    orientation: 'horizontal' | 'vertical';
    cardtype: CardType;
    isCorner: boolean;
  }[]>;

  constructor(private gameService: GameService) {
    // this.cards$ = this.gameService.getCards();
    this.topCards$ = this.gameService.getCards().pipe(
      map(cards =>
        cards
          .filter(card => card.case >= 20 && card.case <= 30)
          .map(card => ({
            name: card.street || card.name,
            ville: card.ville,
            color: card.color,
            price: card.prix,
            cardtype: card.type,
            orientation: 'vertical', // ou basé sur `case`
            isCorner: card.case === 20 || card.case === 30
          }))
      )
    );

    this.leftCards$ = this.gameService.getCards().pipe(
      map(cards =>
        cards
          .filter(card => card.case >= 11 && card.case <= 19)
          .map(card => ({
            name: card.street || card.name,
            ville: card.ville,
            color: card.color,
            price: card.prix,
            cardtype: card.type,
            orientation: 'horizontal', // ou basé sur `case`
            isCorner: card.case === 20 || card.case === 30
          }))
      )
    );

    this.rightCards$ = this.gameService.getCards().pipe(
      map(cards =>
        cards
          .filter(card => card.case >= 31 && card.case <= 39)
          .map(card => ({
            name: card.street || card.name,
            ville: card.ville,
            color: card.color,
            price: card.prix,
            cardtype: card.type,
            orientation: 'horizontal', // ou basé sur `case`
            isCorner: card.case === 20 || card.case === 30
          }))
      )
    );

    this.bottomCards$ = this.gameService.getCards().pipe(
      map(cards =>
        cards
          .filter(card => card.case >= 0 && card.case <= 10)
          .map(card => ({
            name: card.street || card.name,
            ville: card.ville,
            color: card.color,
            price: card.prix,
            cardtype: card.type,
            orientation: 'vertical', // ou basé sur `case`
            isCorner: card.case === 0 || card.case === 10
          }))
      )
    );
  }
}
