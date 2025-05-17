import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gano-human-player',
  imports: [],
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
