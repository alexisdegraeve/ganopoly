import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gano-win-lose-card',
  imports: [CommonModule],
  templateUrl: './win-lose-card.component.html',
  styleUrl: './win-lose-card.component.scss'
})
export class WinLoseCardComponent  {
  @Input() isLose = false;
  @Input() isWin = true;
}
