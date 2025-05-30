import { Component, Input } from '@angular/core';
import { PropertyCardComponent } from "../property-card/property-card.component";
import { GameService } from '../services/game.service';
import { Card, CardType } from '../models/card';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'gano-cards',
  imports: [PropertyCardComponent, CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
   @Input() cards:Card[] | null= [];
   @Input() card:Card | null = null;
}
