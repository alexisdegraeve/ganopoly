import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiceComponent } from "../dice/dice.component";
import { DoublediceComponent } from "../doubledice/doubledice.component";

@Component({
  selector: 'gano-gamecontrol',
  imports: [CommonModule, DiceComponent, DoublediceComponent],
  templateUrl: './gamecontrol.component.html',
  styleUrl: './gamecontrol.component.scss'
})
export class GamecontrolComponent {
  isStartGame = false;
  isRollDice = false;
  showButtonRollDice = true;
  isHumanAction = false;


  startGame() {
    this.isStartGame = true;
    this.isRollDice = true;
    this.isHumanAction = false;
  }

  finishRollDice() {
    this.showButtonRollDice = false;
    this.isHumanAction = true;
    console.log('finish roll dice')
  }

}
