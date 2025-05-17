import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { BoardComponent } from "../board/board.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { CardsComponent } from '../cards/cards.component';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card, CardType } from '../models/card';
import { BanknoteComponent } from "../banknote/banknote.component";
import { HumanPlayerComponent } from "../human-player/human-player.component";
import { InfoPlayerComponent } from "../info-player/info-player.component";
import { Player } from '../models/player';


@Component({
  selector: 'gano-game',
  imports: [CardsComponent, BoardComponent, HeaderComponent, CommonModule, BanknoteComponent, HumanPlayerComponent, InfoPlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  rotation = 0;
  mycards$ :Observable<Card[]>;
  bankNoteShow = false;
  cardsShow = false;
  boardShow = true;
  playerName: string = '';
  isStartGame = false;
  isLoading = true;
  playerHuman$: Observable<Player>;

  constructor(private gameService: GameService) {
    this.mycards$ = this.getPlayCards();
    this.playerHuman$ = this.gameService.getPlayerHuman();
  }

  checkIsLoading(event: Event) {
    this.isLoading = false;
    console.log('checkIsloading');
    console.log(event);
  }

  startGame(name: string) {
    console.log(name);
    this.isStartGame = true;
    this.gameService.startGame(name).subscribe(() => {
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
          .filter(card => card && card.type === CardType.immobilier || card.type === CardType.elec || card.type === CardType.gare || card.type === CardType.eaux )
      )
    );
  }

  boardShowActive() {
    this.boardShow = true;
    this.cardsShow = false;
    this.bankNoteShow = false;
  }

  cardShowActive() {
    this.boardShow = false;
    this.cardsShow = true;
    this.bankNoteShow = false;
  }

  bankNoteShowActive() {
    this.boardShow = false;
    this.cardsShow = false;
    this.bankNoteShow = true;
  }
}
