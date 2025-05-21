import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DoublediceComponent } from "../doubledice/doubledice.component";
import { GameService } from '../services/game.service';
import { map, Observable } from 'rxjs';
import { Case } from '../models/card';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'gano-gamecontrol',
  imports: [CommonModule, DoublediceComponent, CellComponent],
  templateUrl: './gamecontrol.component.html',
  styleUrl: './gamecontrol.component.scss'
})
export class GamecontrolComponent {
  isStartGame = false;
  isRollDice = false;
  showButtonRollDice = true;
  isHumanAction = false;
  // currentCard$: Observable<Card[] | undefined>;
  cellNumber = 1;
  cellCase$: Observable<Case | undefined> = new Observable<Case |undefined>;


  startGame() {
    this.isStartGame = true;
    this.isRollDice = true;
    this.isHumanAction = false;
  }

  finishRollDice(diceNumber: number) {
    this.showButtonRollDice = false;
    this.isHumanAction = true;
    this.gameService.updateCurrentCasePlayer(this.gameService.PlayerHuman, diceNumber);
    this.cellCase$ = this.getCellCase(this.gameService.PlayerHuman.value?.currentCase);
    // this.mycards$ = this.getCurrentCard();
    console.log('finish roll dice')
  }

  constructor(private gameService: GameService) {
    //this.currentCard$ = this.getCurrentCard();

    // this.gameService.PlayerHuman.subscribe(playerHyman => {
    //     this.currentCard$ = this.getCurrentCard();
    // })
  }

  // getCurrentCard(): Observable<Card[] | undefined> {
  //   return this.gameService.getCards()
  //     .pipe(
  //       map(cards =>
  //         cards
  //           .filter(card => this.gameService.PlayerHuman.value?.currentCase === card.case)
  //       )
  //     );
  // }
  buy() {
    const cellNb = this.gameService.PlayerHuman.value.currentCase;

    console.log(cellNb);
    //const cellNbArray  = [];
    //cellNbArray.push(cellNb);
    this.gameService.addProperty(cellNb, this.gameService.PlayerHuman);
  }

  skip() {

  }

    private getCellCase(cellNb: number): Observable<Case | undefined> {
      return this.gameService.getCards().pipe(
        map(cards => {
          const card = cards.find(c => c.case === cellNb);
          console.log('find card ', card);
          if (!card) return undefined;
          return {
              name: card.street || card.name,
              ville: card.ville,
              color: card.color,
              price: card.prix,
              info: card.info,
              cardtype: card.type,
              orientation: 'vertical',
              isCorner: [0, 10, 20, 30].includes(card.case)
            } as Case;
        })
      );
    }
}
