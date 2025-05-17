import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gano-human-player',
  imports: [CommonModule, FormsModule],
  templateUrl: './human-player.component.html',
  styleUrl: './human-player.component.scss'
})
export class HumanPlayerComponent {
  @Input() name: string = '';
  @Output() nameChange = new EventEmitter<string>();

  go() {
    this.nameChange.emit(this.name);
  }

}
