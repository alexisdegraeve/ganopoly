import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoublediceComponent } from './doubledice.component';

describe('DoublediceComponent', () => {
  let component: DoublediceComponent;
  let fixture: ComponentFixture<DoublediceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoublediceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoublediceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
