import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardType } from '../models/card';

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
  
  CardType = CardType;

}
