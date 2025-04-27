import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ccCard } from '../models/ccCard';
import { forkJoin, Observable } from 'rxjs';
import { Billet } from '../models/billet';
import { Player } from '../models/player';

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
  private playerHuman : Player = this.createNewPlayer();
  private playerComputer1: Player = this.createNewPlayer();
  private playerComputer2: Player = this.createNewPlayer();
  private playerComputer3: Player = this.createNewPlayer();

  constructor(private httpClient: HttpClient) {}

  createNewPlayer(): Player {
    return {
      houses: [],
      billets: [
        { euro: 1, quantity: 0, color: 'white' },
        { euro: 5, quantity: 0, color: 'pink' },
        { euro: 10, quantity: 0, color: 'cyan' },
        { euro: 20, quantity: 0, color: 'green' },
        { euro: 50, quantity: 0, color: 'purple' },
        { euro: 100, quantity: 0, color: 'salmon' },
        { euro: 500, quantity: 0, color: 'orange' },
      ]
    };
  }

  startGame(): Observable<void> {
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
          console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
          console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
          console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
          console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
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
    console.log(this.playerHuman);
    let lastCard = this.chanceCards.pop();
    if (lastCard) {
      this.chanceCards = [lastCard, ...this.chanceCards];
    }
    return lastCard;
  }

  takeMoneyFromBank(dstEuro: number, dstQuantity: number, dstPlayer: Player) {
    this.banque
    .filter((billet) => billet.euro === dstEuro)
    .forEach((billet) => {
      if (billet.quantity > 0) {
        billet.quantity -= dstQuantity;
        dstPlayer.billets
          .filter((billet) => billet.euro === dstEuro)
          .forEach((billet) => {
            billet.quantity += dstQuantity;
          });
      }
    });
  }

  giveBilletsPlayer(player: Player) {
    this.takeMoneyFromBank(1, 5, player);
    this.takeMoneyFromBank(5, 1, player);
    this.takeMoneyFromBank(10, 2, player);
    this.takeMoneyFromBank(20, 1, player);
    this.takeMoneyFromBank(50, 1, player);
    this.takeMoneyFromBank(100, 4, player);
    this.takeMoneyFromBank(500, 2, player);
  }

  distributeBillets() {
    this.giveBilletsPlayer(this.playerHuman);
    this.giveBilletsPlayer(this.playerComputer1);
    this.giveBilletsPlayer(this.playerComputer2);
    this.giveBilletsPlayer(this.playerComputer3);
    console.log('disribute Billets');
    console.log('banque : '  , JSON.parse(JSON.stringify(this.banque)));
    console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
    console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
    console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
    console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
    console.log('total ');
    console.log('Human :', this.calcTotal(this.playerHuman));
    console.log('playerComputer 1 :', this.calcTotal(this.playerComputer1));
    console.log('playerComputer 2 :', this.calcTotal(this.playerComputer2));
    console.log('playerComputer 3 :', this.calcTotal(this.playerComputer3));
  }

  calcTotal(player: Player): number {
    let total = 0;
    player.billets.forEach(billet => {
      total += (billet.euro * billet.quantity);
    })
    return total;
  }
}


