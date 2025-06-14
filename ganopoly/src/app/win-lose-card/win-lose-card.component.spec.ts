import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinLoseCardComponent } from './win-lose-card.component';

describe('WinLoseCardComponent', () => {
  let component: WinLoseCardComponent;
  let fixture: ComponentFixture<WinLoseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinLoseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinLoseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
