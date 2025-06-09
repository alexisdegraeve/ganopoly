import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CellComponent } from "../cell/cell.component";
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { combineLatestWith, map, startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CardType, Case } from '../models/card';
import { ChanceCardComponent } from "../chance-card/chance-card.component";
import { CommunityCardComponent } from "../community-card/community-card.component";
import { Player } from '../models/player';

interface BoardData {
  top: Case[];
  left: Case[];
  right: Case[];
  bottom: Case[];
}

@Component({
  selector: 'gano-board',
  imports: [CellComponent, CommonModule, ChanceCardComponent, CommunityCardComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnDestroy {
  @Input() rotate = 0;
  @Output() isLoadingChange = new EventEmitter<boolean>;
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  topCards$: Observable<Case[]>;
  leftCards$: Observable<Case[]>;
  rightCards$: Observable<Case[]>;
  bottomCards$: Observable<Case[]>;
  isLoading$: Observable<boolean>;
  boardData$: Observable<BoardData>;
  private sub = new Subscription();
  players$: Observable<{ human: Player, computer1: Player, computer2: Player, computer3: Player }> ;

  constructor(private gameService: GameService) {
    this.players$ = this.gameService.Players;
    this.topCards$ = this.getCardsInRange(20, 30, 'vertical');
    this.leftCards$ = this.getCardsInRange(11, 19, 'horizontal');
    this.rightCards$ = this.getCardsInRange(31, 39, 'horizontal');
    this.bottomCards$ = this.getCardsInRange(0, 10, 'vertical');
    this.boardData$ = this.topCards$.pipe(
      combineLatestWith(
        this.leftCards$,
        this.rightCards$,
        this.bottomCards$
      ),
      map(([top, left, right, bottom]) => ({
        top,
        left,
        right,
        bottom
      }))
    );

    this.isLoading$ = this.boardData$.pipe(
      map(({ top, left, right, bottom }) =>
        !top.length || !left.length || !right.length || !bottom.length
      ),
      startWith(true)
    );

    this.isLoading$.subscribe(data => {
      this.isLoadingChange.emit(data);
    });
     //this.isLoading$ = of(true);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
            img: card.img,
            orientation,
            isCorner: [0, 10, 20, 30].includes(card.case)
          }))
      )
    );
  }



}
