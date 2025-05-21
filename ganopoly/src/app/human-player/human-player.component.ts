import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pawn } from '../models/pawn';

@Component({
  selector: 'gano-human-player',
  imports: [CommonModule, FormsModule],
  templateUrl: './human-player.component.html',
  styleUrl: './human-player.component.scss'
})
export class HumanPlayerComponent {
  @Input() name: string = '';
  @Output() playerChange = new EventEmitter<{name: string, pawn: Pawn}>();
  pawnSelected: Pawn = Pawn.cat;
  Pawn = Pawn;

  go() {
    this.playerChange.emit({name: this.name, pawn: this.pawnSelected});
  }

  setSelectPawn(pion: Pawn) {
    this.pawnSelected = pion;
  }

}
