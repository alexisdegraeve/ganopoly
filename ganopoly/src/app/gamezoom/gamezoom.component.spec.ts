import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamezoomComponent } from './gamezoom.component';

describe('GamezoomComponent', () => {
  let component: GamezoomComponent;
  let fixture: ComponentFixture<GamezoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamezoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamezoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
