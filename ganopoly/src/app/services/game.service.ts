import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ccCard } from '../models/ccCard';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Billet } from '../models/billet';
import { Player } from '../models/player';
import { Card, Case } from '../models/card';
import { Pawn } from '../models/pawn';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  private dice1: number = 0;
  private dice2: number = 0;
  private chanceCards: ccCard[] = [];
  private communauteCards: ccCard[] = [];
  private banque: Billet[] = [
    { euro: 1, quantity: 30, color: 'white' },
    { euro: 5, quantity: 30, color: 'pink' },
    { euro: 10, quantity: 30, color: 'cyan' },
    { euro: 20, quantity: 30, color: 'green' },
    { euro: 50, quantity: 30, color: 'purple' },
    { euro: 100, quantity: 30, color: 'salmon' },
    { euro: 500, quantity: 30, color: 'orange' },
  ];

  private playerHuman$ = this.createNewPlayer(Pawn.cat);
  private playerComputer1$ = this.createNewPlayer(Pawn.dog);
  private playerComputer2$ = this.createNewPlayer(Pawn.hat);
  private playerComputer3$ = this.createNewPlayer(Pawn.curler);


  constructor(private httpClient: HttpClient) {}

  getRandomFirstname(): string {
    const firstnames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hana', 'Isaac', 'Julia'];
    const index = Math.floor(Math.random() * firstnames.length);
    return firstnames[index];
  }

  createNewPlayer(pawnShape: Pawn): BehaviorSubject<Player> {
  return new BehaviorSubject<Player>({
    name: this.getRandomFirstname(),
    pawnShape,
    dices: 0,
    properties: [1],
    billets: [
      { euro: 1, quantity: 0, color: 'white' },
      { euro: 5, quantity: 0, color: 'pink' },
      { euro: 10, quantity: 0, color: 'cyan' },
      { euro: 20, quantity: 0, color: 'green' },
      { euro: 50, quantity: 0, color: 'purple' },
      { euro: 100, quantity: 0, color: 'salmon' },
      { euro: 500, quantity: 0, color: 'orange' },
    ]
  });
  }

  startGame(name: string): Observable<void> {
    console.log('start game ');
    console.log(name)
    const currentPlayer = this.playerHuman$.value;
    const updatedPlayer = {...currentPlayer, name: name};
    this.playerHuman$.next(updatedPlayer);
    return new Observable<void>((observer) => {
      forkJoin({
        chanceCards: this.httpClient.get<ccCard[]>('/cards/chance.json'),
        communauteCards: this.httpClient.get<ccCard[]>(
          '/cards/communaute.json'
        ),
      }).subscribe({
        next: ({ chanceCards, communauteCards }) => {
          this.chanceCards = this.shuffleArray(chanceCards);
          this.communauteCards = this.shuffleArray(communauteCards);
          console.log('Billets');
          console.log('banque : '  , JSON.parse(JSON.stringify(this.banque)));
          //console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
          //console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
          //console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
          //console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
          this.testAddProperties();
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors du démarrage du jeu', err);
          observer.error(err);
        },
      });
    });
  }

  throwDice() {
    const sides = 6;
    this.dice1 = Math.floor(Math.random() * sides) + 1;
    this.dice2 = Math.floor(Math.random() * sides) + 1;
    console.log(this.dice1, this.dice2, this.chanceCards, this.communauteCards);
  }

  shuffleArray(array: ccCard[]): ccCard[] {
    for (let index = 0; index < array.length / 2; index++) {
      let swapIndex = Math.floor(Math.random() * array.length);
      let temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }
  pickChanceCard(): ccCard | undefined {
    console.log(this.banque);
    //console.log(this.playerHuman);
    let lastCard = this.chanceCards.pop();
    if (lastCard) {
      this.chanceCards = [lastCard, ...this.chanceCards];
    }
    return lastCard;
  }

  takeMoneyFromBank(dstEuro: number, dstQuantity: number, dstPlayer: BehaviorSubject<Player>) {
    const currentPlayer = dstPlayer.value;
    const updatedPlayer = {...currentPlayer};

    this.banque
    .filter((billet) => billet.euro === dstEuro)
    .forEach((billet) => {
      if (billet.quantity > 0) {
        billet.quantity -= dstQuantity;
        updatedPlayer.billets
          .filter((billet) => billet.euro === dstEuro)
          .forEach((billet) => {
            billet.quantity += dstQuantity;
          });
      }
    });

    dstPlayer.next(updatedPlayer);
  }

  giveBilletsPlayer(player: BehaviorSubject<Player>) {
    this.takeMoneyFromBank(1, 5, player);
    this.takeMoneyFromBank(5, 1, player);
    this.takeMoneyFromBank(10, 2, player);
    this.takeMoneyFromBank(20, 1, player);
    this.takeMoneyFromBank(50, 1, player);
    this.takeMoneyFromBank(100, 4, player);
    this.takeMoneyFromBank(500, 2, player);
  }

  distributeBillets() {
    this.giveBilletsPlayer(this.playerHuman$);
    this.giveBilletsPlayer(this.playerComputer1$);
    this.giveBilletsPlayer(this.playerComputer2$);
    this.giveBilletsPlayer(this.playerComputer3$);
    console.log('disribute Billets');
    console.log('banque : '  , JSON.parse(JSON.stringify(this.banque)));
    // console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
    // console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
    // console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
    // console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
    console.log('total ');
    // console.log('Human :', this.calcTotal(this.playerHuman));
    // console.log('playerComputer 1 :', this.calcTotal(this.playerComputer1));
    // console.log('playerComputer 2 :', this.calcTotal(this.playerComputer2));
    // console.log('playerComputer 3 :', this.calcTotal(this.playerComputer3));
  }

  calcTotal(player: Player): number {
    let total = 0;
    player.billets.forEach(billet => {
      total += (billet.euro * billet.quantity);
    })
    return total;
  }
  getCards():Observable<Card[]> {
    console.log('get cards');
    return this.httpClient.get<Card[]>('/cards/ganopolycards.json');
  }

  getPlayerHuman(): Observable<Player> {
    return this.playerHuman$;
  }

  getPlayerComputer1(): Observable<Player> {
    return this.playerComputer1$;
  }

  getPlayerComputer2(): Observable<Player> {
    return this.playerComputer2$;
  }

  getPlayerComputer3(): Observable<Player> {
    return this.playerComputer3$;
  }

  addProperty(ganocase: number[], player: BehaviorSubject<Player>) {
    const currentPlayer = player.value;
    const currentProperties = currentPlayer.properties;
    const updatedPlayer = {...currentPlayer, properties: [...currentProperties, ...ganocase]};
    player.next(updatedPlayer);
  }


  testAddProperties() {
    this.addProperty([3,6], this.playerHuman$);
    this.addProperty([4,6,5], this.playerComputer1$);
    this.addProperty([9,10,11], this.playerComputer2$);
    this.addProperty([13,15,16], this.playerComputer3$);
  }

}


