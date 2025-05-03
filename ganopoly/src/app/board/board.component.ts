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
  cards$: Observable<{
    name: string;
    ville: string;
    color: string;
    price: number;
    orientation: 'horizontal' | 'vertical';
    cardtype: CardType;
    isCorner: boolean;
  }[]>;

  topRow: Cell[] = [
    { name: '', price: 0, orientation: 'vertical', isCorner: true },
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', color: 'blue',  isCorner: false },
    { name: 'RUE DE NAMUR', price: 80, orientation: 'vertical', isCorner: false },
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', isCorner: false },
    { name: 'RUE DE NAMUR', price: 80, orientation: 'vertical', isCorner: false },
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', isCorner: false },
    { name: 'RUE DE NAMUR', price: 80, orientation: 'vertical', isCorner: false },
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', isCorner: false },
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', isCorner: false },
    { name: 'RUE DE NAMUR', price: 80, orientation: 'vertical', isCorner: false },
    { name: '', price: 0, orientation: 'vertical', isCorner: true }, // coin
  ];


  constructor(private gameService: GameService) {
    // this.cards$ = this.gameService.getCards();
    this.cards$ = this.gameService.getCards().pipe(
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
  }
}
