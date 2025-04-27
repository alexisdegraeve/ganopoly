import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ccCard } from '../models/ccCard';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class GameService {
  private dice1: number = 0;
  private dice2: number = 0;
  private chanceCards: ccCard[] = [];
  private communauteCards: ccCard[] = [];

  constructor(private httpClient: HttpClient) {
  }

  startGame(): Observable<void> {
    return new Observable<void>((observer) => {
      forkJoin({
        chanceCards: this.httpClient.get<ccCard[]>('/cards/chance.json'),
        communauteCards: this.httpClient.get<ccCard[]>('/cards/communaute.json')
      }).subscribe({
        next: ({ chanceCards, communauteCards }) => {
          this.chanceCards = this.shuffleArray(chanceCards);
          this.communauteCards = this.shuffleArray(communauteCards);
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors du démarrage du jeu', err);
          observer.error(err);
        }
      });
    });
  }

  throwDice() {
    const sides = 6;
    this.dice1 = Math.floor(Math.random()* sides)+1;
    this.dice2 = Math.floor(Math.random()* sides)+1;
    console.log(this.dice1, this.dice2, this.chanceCards, this.communauteCards);
  }

  // initChanceCards() {
  //   this.httpClient.get<ccCard[]>("/cards/chance.json").subscribe((cards: ccCard[])  => {
  //     this.chanceCards = this.shuffleArray([...cards]);
  //   });
  // }

  // initCommunauteCards() {
  //   this.httpClient.get<ccCard[]>("/cards/communaute.json").subscribe((cards: ccCard[])  => {
  //     this.communauteCards = this.shuffleArray([...cards]);

  //   });
  // }

  shuffleArray(array: ccCard[]): ccCard[] {
    for (let index = 0; index < array.length / 2; index++) {
      let swapIndex = Math.floor(Math.random() * array.length);
      let temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }

}
