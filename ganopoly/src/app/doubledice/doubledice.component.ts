import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiceComponent } from "../dice/dice.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gano-doubledice',
  imports: [DiceComponent, CommonModule],
  templateUrl: './doubledice.component.html',
  styleUrl: './doubledice.component.scss'
})
export class DoublediceComponent {
  @Output() finishRollDiceEvent = new EventEmitter<number>();
  @Input() showButton = true;
  score1 = 1;
  score2 = 1;
  

  rollDice() {
    let count = 0;
    const interval = setInterval(() => {
      let randomNumber = Math.floor(Math.random() * 6)+1; // nombre entre 0 et 99
      this.score1 = randomNumber;
      randomNumber = Math.floor(Math.random() * 6)+1; // nombre entre 0 et 99
      this.score2 = randomNumber;
      count++;
      if (count >= 3) {
        clearInterval(interval); // arrêter après 10 exécutions (5s)
        this.finishRollDiceEvent.emit(this.score1 + this.score2);
      }
    }, 150);
  }
}
