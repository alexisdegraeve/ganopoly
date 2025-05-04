import { Component, Input } from '@angular/core';

@Component({
  selector: 'gano-banknote',
  imports: [],
  templateUrl: './banknote.component.html',
  styleUrl: './banknote.component.scss'
})
export class BanknoteComponent {
  @Input() color: string = 'white';
  @Input() value: number = 1;
}
