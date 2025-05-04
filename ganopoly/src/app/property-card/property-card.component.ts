import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardType } from '../models/card';

@Component({
  selector: 'gano-property-card',
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss'
})
export class PropertyCardComponent {
  isFlipped = false;
  @Input() name = 'Rue Saint Léonard';
  @Input() street = 'Rue Saint Léonard';
  @Input() city = 'Liège';
  @Input() loyer = 50;
  @Input() groupecomplet = 100;
  @Input() maisons: number[] = [];
  @Input() stations: number[] = [];
  @Input() hotel = 2000;
  @Input() prixParMaison = 200;
  @Input() prixParHotel = 200;
  @Input() hypotheque = 200;
  @Input() payezHypotheque = 220;
  @Input() backcolor = 'yellow';
  @Input() txtcolor = '#000';
  @Input() times1: number = 0;
  @Input() times2: number = 0;
  @Input() type: CardType = CardType.immobilier;

  CardType = CardType;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
}
