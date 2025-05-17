import { Component, Input } from '@angular/core';

@Component({
  selector: 'gano-banknote',
  imports: [],
  templateUrl: './banknote.component.html',
  styleUrl: './banknote.component.scss'
})
export class BanknoteComponent {
  @Input() value: number = 1;

  getColor(): string {
    switch (this.value) {
      case 1:
        return 'white';
        break;
      case 5:
        return '#ffdad2';
        break;
      case 10:
        return '#beedfd';
        break;
      case 20:
        return '#f4fdc8';
        break;
      case 50:
        return '#d9c8ff';
        break;
      case 100:
        return '#ffda99';
        break;
      case 500:
        return '#fe9d26';
        break;
      default:
        return 'white';
        break;
    }

  }
}
