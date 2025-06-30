import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { BoardComponent } from "../board/board.component";
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card, CardType } from '../models/card';
import { HumanPlayerComponent } from "../human-player/human-player.component";
import { InfoPlayerComponent } from "../info-player/info-player.component";
import { Player } from '../models/player';
import { Pawn } from '../models/pawn';
import { GamecontrolComponent } from "../gamecontrol/gamecontrol.component";
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { WinLoseCardComponent } from "../win-lose-card/win-lose-card.component";


@Component({
  selector: 'gano-game',
  imports: [BoardComponent, FooterComponent, CommonModule, HumanPlayerComponent, InfoPlayerComponent, GamecontrolComponent, HeaderComponent, WinLoseCardComponent],
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
  playerHuman$: BehaviorSubject<Player>;
  playerComputer1$: BehaviorSubject<Player>;
  playerComputer2$: BehaviorSubject<Player>;
  playerComputer3$: BehaviorSubject<Player>;
  isHumanTurn$: BehaviorSubject<boolean>;

  constructor(private gameService: GameService) {
    this.mycards$ = this.getPlayCards();
    this.playerHuman$ = this.gameService.PlayerHuman;
    this.playerComputer1$ = this.gameService.PlayerComputer1;
    this.playerComputer2$ = this.gameService.PlayerComputer2;
    this.playerComputer3$ = this.gameService.PlayerComputer3;
    this.isHumanTurn$ = this.gameService.isHumanTurn;
  }

  checkIsLoading(event: Event) {
    this.isLoading = false;
  }

  startGame(playerChange: {name:string, pawn: Pawn}) {
    this.isStartGame = true;
    this.gameService.startGame(playerChange).subscribe(() => {
      this.gameService.throwDice();
      //this.gameService.distributeBillets();
    })
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

  newGame() {
    this.rotation = 0;
    this.bankNoteShow = false;
    this.cardsShow = false;
    this.boardShow = true;
    this.playerName = '';
    this.isLoading = true;
    this.isStartGame = false;
  }
}
