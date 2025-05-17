import { Component, Input } from '@angular/core';
import { Player } from '../models/player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gano-info-player',
  imports: [CommonModule],
  templateUrl: './info-player.component.html',
  styleUrl: './info-player.component.scss'
})
export class InfoPlayerComponent {
  @Input() player: Player | null = null;
}
