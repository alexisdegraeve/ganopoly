import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DoublediceComponent } from "../doubledice/doubledice.component";
import { GameService } from '../services/game.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Case } from '../models/card';
import { CellComponent } from '../cell/cell.component';
import { Player } from '../models/player';

@Component({
  selector: 'gano-gamecontrol',
  imports: [CommonModule, DoublediceComponent, CellComponent],
  templateUrl: './gamecontrol.component.html',
  styleUrl: './gamecontrol.component.scss'
})
export class GamecontrolComponent {
  isStartGame = true;
  isRollDice = false;
  showButtonRollDice = true;
  isHumanAction = false;
  cellNumber = 1;
  cellCase$: Observable<Case | undefined> = new Observable<Case | undefined>;
  playerToPlay$: BehaviorSubject<Player>;
  @ViewChild(DoublediceComponent) diceComponent!: DoublediceComponent;


  // startGame() {
  //   this.isStartGame = true;
  //   this.isRollDice = true;
  //   this.isHumanAction = false;
  // }

  finishRollDice(diceNumber: number) {
    this.showButtonRollDice = false;
    this.isHumanAction = true;
    this.gameService.updateCurrentCasePlayer(this.gameService.PlayerHuman, diceNumber);
    this.cellCase$ = this.getCellCase(this.gameService.PlayerHuman.value?.currentCase);
    console.log('finish roll dice');
  }

  constructor(private gameService: GameService) {
    this.playerToPlay$ = this.gameService.PlayerToPlay;
      this.gameService.RequestDiceRoll$.subscribe((shouldRoll) => {
    if (shouldRoll) {
      // L'ordinateur a demandé à lancer les dés
      this.diceComponent.rollDice();
      this.gameService.resetDiceRequest();
    }
  });
  }


  buy() {
    const cellNb = this.gameService.PlayerHuman.value.currentCase;
    this.gameService.addProperty(cellNb, this.gameService.PlayerHuman);
    this.gameService.nextPlayerToPlay();
  }

  skip() {
    this.gameService.nextPlayerToPlay();
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
