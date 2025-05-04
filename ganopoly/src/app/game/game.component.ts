import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { BoardComponent } from "../board/board.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { CardsComponent } from '../cards/cards.component';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card, CardType } from '../models/card';

@Component({
  selector: 'gano-game',
  imports: [CardsComponent, BoardComponent, HeaderComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  rotation = 0;
  showCards = false;
  mycards$ :Observable<Card[]>;

  constructor(private gameService: GameService) {
    this.mycards$ = this.getPlayCards();
  }

  startGame() {
    this.gameService.startGame().subscribe(() => {
      console.log(' loading finish');
      this.gameService.throwDice();
      this.gameService.distributeBillets();
    })
  }

  pickChance() {
      this.gameService.pickChanceCard();
  }

  rotateBoard() {
    this.rotation = this.rotation <= 360 ? this.rotation + 90 : 0;
  }

  getPlayCards(): Observable<Card[]> {
    return this.gameService.getCards()
    .pipe(
      map(cards =>
        cards
          .filter(card => card && card.type === CardType.immobilier || card.type === CardType.elec || card.type === CardType.gare)
      )
    );
  }


}
