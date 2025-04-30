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
  @Input() prixParMaison = 200;
  @Input() prixParHotel = 200;
  @Input() hypotheque = 200;
  @Input() payezHypotheque = 220;
  @Input() backcolor = 'yellow';
  maisonConfigs = [
    { nombre: 1, montant: this.maison1 },
    { nombre: 2, montant: this.maison2 },
    { nombre: 3, montant: this.maison3 },
    { nombre: 4, montant: this.maison4 },
    { nombre: 5, montant: this.hotel },
  ];

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
