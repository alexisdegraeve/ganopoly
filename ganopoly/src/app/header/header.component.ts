import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gano-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isStartGame = false;
  @Input() boardVisible = true;
  @Output() rotateEvent = new EventEmitter<boolean>();
   @Output() newGameEvent = new EventEmitter<boolean>();

  rotate() {
    this.rotateEvent.emit(true);
  }

  newGame() {
    this.newGameEvent.emit(true);
  }

}
