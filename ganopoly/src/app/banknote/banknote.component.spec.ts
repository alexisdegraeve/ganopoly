import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanknoteComponent } from './banknote.component';

describe('BanknoteComponent', () => {
  let component: BanknoteComponent;
  let fixture: ComponentFixture<BanknoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanknoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanknoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
