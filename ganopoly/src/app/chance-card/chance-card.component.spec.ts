import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceCardComponent } from './chance-card.component';

describe('ChanceCardComponent', () => {
  let component: ChanceCardComponent;
  let fixture: ComponentFixture<ChanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChanceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
