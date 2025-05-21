import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DoublediceComponent } from "../doubledice/doubledice.component";
import { GameService } from '../services/game.service';
import { map, Observable } from 'rxjs';
import { Card } from '../models/card';
import { CardsComponent } from '../cards/cards.component';

@Component({
  selector: 'gano-gamecontrol',
  imports: [CommonModule, DoublediceComponent, CardsComponent],
  templateUrl: './gamecontrol.component.html',
  styleUrl: './gamecontrol.component.scss'
})
export class GamecontrolComponent {
  isStartGame = false;
  isRollDice = false;
  showButtonRollDice = true;
  isHumanAction = false;
  currentCard$: Observable<Card[] | undefined>;


  startGame() {
    this.isStartGame = true;
    this.isRollDice = true;
    this.isHumanAction = false;
  }

  finishRollDice(diceNumber: number) {
    this.showButtonRollDice = false;
    this.isHumanAction = true;
    this.gameService.updateCurrentCasePlayer(this.gameService.PlayerHuman, diceNumber);
    // this.mycards$ = this.getCurrentCard();
    console.log('finish roll dice')
  }

  constructor(private gameService: GameService) {
    this.currentCard$ = this.getCurrentCard();
    this.gameService.PlayerHuman.subscribe(playerHyman => {
        this.currentCard$ = this.getCurrentCard();
    })
  }

  getCurrentCard(): Observable<Card[] | undefined> {
    return this.gameService.getCards()
      .pipe(
        map(cards =>
          cards
            .filter(card => this.gameService.PlayerHuman.value?.currentCase === card.case)
        )
      );
  }
  buy() {

  }

  skip() {

  }
}
