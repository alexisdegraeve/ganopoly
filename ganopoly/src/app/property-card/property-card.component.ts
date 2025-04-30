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
  @Input() name = 'Mario';
  @Input() loyer = 50;
  @Input() backcolor = 'yellow';

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
