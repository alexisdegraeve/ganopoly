import { Component } from '@angular/core';

@Component({
  selector: 'gano-chance-card',
  imports: [],
  templateUrl: './chance-card.component.html',
  styleUrl: './chance-card.component.scss'
})
export class ChanceCardComponent {
  isFlipped = false;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }
}
