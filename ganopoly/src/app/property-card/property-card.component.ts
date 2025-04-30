import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'gano-property-card',
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss'
})
export class PropertyCardComponent {
  isFlipped = false;
  @Input() street = 'Rue Saint Léonard';
  @Input() city = 'Liège';
  @Input() loyer = 50;
  @Input() groupecomplet = 100;
  @Input() maison1 = 200;
  @Input() maison2 = 600;
  @Input() maison3 = 1400;
  @Input() maison4 = 1700;
  @Input() hotel = 2000;
  @Input() backcolor = 'yellow';

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
