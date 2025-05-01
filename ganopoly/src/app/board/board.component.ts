import { Component } from '@angular/core';

import { CellComponent } from "../cell/cell.component";
import { CommonModule } from '@angular/common';
import { Cell } from '../models/cell';

@Component({
  selector: 'gano-board',
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  topRow: Cell[] = [
    { name: 'RUE GRANDE<br/>DINANT', price: 60, orientation: 'vertical', isCorner: false },
    { name: 'RUE DE NAMUR', price: 80, orientation: 'vertical', isCorner: false },
    { name: '', price: 0, orientation: 'vertical', isCorner: true }, // coin
  ];

}
