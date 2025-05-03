import { Component, Input } from '@angular/core';
import { CellComponent } from "../cell/cell.component";
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CardType, Case } from '../models/card';

@Component({
  selector: 'gano-board',
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  @Input() rotate = 0;
  topCards$: Observable<Case[]>;
  leftCards$: Observable<Case[]>;
  rightCards$: Observable<Case[]>;
  bottomCards$: Observable<Case[]>;

  constructor(private gameService: GameService) {
    this.topCards$ = this.getCardsInRange(20, 30, 'vertical');
    this.leftCards$ = this.getCardsInRange(11, 19, 'horizontal');
    this.rightCards$ = this.getCardsInRange(31, 39, 'horizontal');
    this.bottomCards$ = this.getCardsInRange(0, 10, 'vertical');
  }

  private getCardsInRange(
    min: number,
    max: number,
    orientation: 'horizontal' | 'vertical'
  ): Observable<Case[]> {
    return this.gameService.getCards().pipe(
      map(cards =>
        cards
          .filter(card => card && card.case >= min && card.case <= max)
          .map(card => ({
            name: card.street || card.name,
            ville: card.ville,
            color: card.color,
            price: card.prix,
            info: card.info,
            cardtype: card.type,
            orientation,
            isCorner: [0, 10, 20, 30].includes(card.case)
          }))
      )
    );
  }


}
