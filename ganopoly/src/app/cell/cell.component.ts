import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'gano-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  @Input() name!: string;
  @Input() price!: number;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() isCorner: boolean = false;
  @Input() color: string | undefined = 'red';

}
