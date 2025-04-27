import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private dice1: number = 0;
  private dice2: number = 0;

  constructor() { }

  throwDice() {
    const sides = 6;
    this.dice1 = Math.floor(Math.random()* sides)+1;
    this.dice2 = Math.floor(Math.random()* sides)+1;
  }
}
