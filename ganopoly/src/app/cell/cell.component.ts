import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardType } from '../models/card';
import { Player } from '../models/player';
import { GameService } from '../services/game.service';

@Component({
  selector: 'gano-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  @Input() name!: string;
  @Input() ville!: string;
  @Input() price!: number;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() isCorner: boolean = false;
  @Input() color: string | undefined = 'red';
  @Input() cardtype: CardType = CardType.immobilier;
  @Input() info!: string;
  @Input() players!: { human: Player, computer1: Player, computer2: Player, computer3: Player } ;
  @Input() nummCell: number = 0;
  @Input() cardImg!: string;

  CardType = CardType;

  constructor(private gameService: GameService) {

  }


  get totalHouse(): number {
    let total = this.gameService.getTotalHouse(this.nummCell);
    return total;
  }

}
