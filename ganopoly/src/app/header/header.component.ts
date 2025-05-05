import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'gano-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() rotateEvent = new EventEmitter<boolean>();
  @Output() cardsEvent = new EventEmitter<boolean>();
  @Output() bankNoteEvent = new EventEmitter<boolean>();
  @Output() boardEvent = new EventEmitter<boolean>();

  rotate() {
    this.rotateEvent.emit(true);
  }

  cards() {
    this.cardsEvent.emit(true);
  }

  bankNote() {
    this.bankNoteEvent.emit(true);
  }

  board() {
    this.boardEvent.emit(true);
  }

}
