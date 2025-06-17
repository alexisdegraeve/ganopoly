import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DoublediceComponent } from "../doubledice/doubledice.component";
import { GameService } from '../services/game.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Case, CardType, Card } from '../models/card';
import { CellComponent } from '../cell/cell.component';
import { Player } from '../models/player';
import { CardsComponent } from '../cards/cards.component';
import { CommunityCardComponent } from "../community-card/community-card.component";
import { ChanceCardComponent } from '../chance-card/chance-card.component';
import { ccCard } from '../models/ccCard';

@Component({
  selector: 'gano-gamecontrol',
  imports: [CommonModule, DoublediceComponent, CellComponent, CardsComponent, CommunityCardComponent, ChanceCardComponent],
  templateUrl: './gamecontrol.component.html',
  styleUrl: './gamecontrol.component.scss'
})
export class GamecontrolComponent {
  isStartGame = true;
  isRollDice = false;
  showButtonRollDice = true;
  isHumanAction = false;
  cellNumber = 1;
  cellCase$: Observable<Case | undefined> | undefined = new Observable<Case | undefined>;
  card$: Observable<Card | undefined>  | undefined = new Observable<Card | undefined>;
  playerToPlay$: BehaviorSubject<Player>;
  @ViewChild(DoublediceComponent) diceComponent!: DoublediceComponent;
  isHumanTurn$: BehaviorSubject<boolean> = new  BehaviorSubject<boolean>(true);
  CardType = CardType;
  communityCard: ccCard | undefined = undefined;
  chanceCard: ccCard | undefined = undefined;
  showCommunityButton = false;
  showChanceButton = false

  // startGame() {
  //   this.isStartGame = true;
  //   this.isRollDice = true;
  //   this.isHumanAction = false;
  // }

  async finishRollDice() {
    if(this.isHumanTurn$.value) {
      if(!this.playerToPlay$.value.jail) {
        // CASE
        this.showButtonRollDice = true;
        this.isHumanAction = true;
        this.gameService.updateCurrentCasePlayer(this.gameService.PlayerHuman);
        this.cellCase$ = this.getCellCase(this.gameService.PlayerHuman.value?.currentCase);
        this.card$ = this.getMyCard(this.gameService.PlayerHuman.value?.currentCase);
        console.log('finish roll dice');
      } else {
        // Human in prison and he throw the dices
        this.jailThrowDice();
      }

    }
  }

  constructor(private gameService: GameService) {
    this.playerToPlay$ = this.gameService.PlayerToPlay;
    this.isHumanTurn$ = this.gameService.isHumanTurn;


      this.gameService.RequestDiceRoll$.subscribe(async (shouldRoll) => {
    if (shouldRoll) {
      // L'ordinateur a demandé à lancer les dés
      await this.waitDiceRoll();
      this.gameService.resetDiceRequest();
        this.gameService.diceRollCompleted$.next();
    }
  });


  }


waitDiceRoll(): Promise<void> {
  return new Promise((resolve) => {
    const sub = this.diceComponent.finishRollDiceEvent.subscribe(() => {
      sub.unsubscribe(); // propre
      resolve(); // le dé a fini
    });
    this.diceComponent.rollDice(); // déclenche le setInterval
  });
}


  buy() {
    const cellNb = this.gameService.PlayerHuman.value.currentCase;
    this.gameService.addProperty(cellNb, this.gameService.PlayerHuman);
    this.cellCase$ = undefined;
    this.gameService.nextPlayerToPlay();
  }

  skip() {
    this.cellCase$ = undefined;
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
          img: card.img,
          cardtype: card.type,
          orientation: 'vertical',
          isCorner: [0, 10, 20, 30].includes(card.case)
        } as Case;
      })
    );
  }

  private getMyCard(cellNb: number): Observable<Card | undefined > {
    return this.gameService.getCards().pipe(
      map(cards => cards.find(c => c.case === cellNb))
    );
  }

  protected Ok() {
    this.skip();
  }

  /* Jail Case */
  jailPay() {
    console.log('JAIL: pay to go out ');
    this.gameService.payGetOutJail(this.gameService.PlayerHuman);
    this.gameService.nextPlayerToPlay();
  }

  jailCardFree() {
    console.log('JAIL: use card free');
  }

  jailThrowDice() {
    console.log('JAIL: throw dice');
    this.gameService.rollDiceGetOutJail(this.gameService.PlayerHuman);
    this.gameService.nextPlayerToPlay();
  }

  communityCardAction(communityCardAction: ccCard) {
    this.showCommunityButton = true;
    console.log('communityCardAction  ', communityCardAction);
    this.communityCard = communityCardAction;
  }

  chanceCardAction(chanceCardAction: ccCard) {
    this.showChanceButton = true;
    console.log('chanceCardAction  ', chanceCardAction);
    this.chanceCard = chanceCardAction;
  }

  communityCardPlay() {
     console.log('Caisse card ', this.communityCard);
     this.showCommunityButton = false;
     this.gameService.PlayCommunityCard(this.communityCard, this.gameService.PlayerHuman);
  }

  chanceCardPlay() {
     console.log('Chance card', this.chanceCard);
     this.showChanceButton = false;
    this.gameService.PlayChanceCard(this.chanceCard, this.gameService.PlayerHuman);
  }

  startCase() {
    this.gameService.checkStart(this.gameService.PlayerHuman);
    this.gameService.nextPlayerToPlay();
  }



}
