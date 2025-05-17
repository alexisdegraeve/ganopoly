import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanPlayerComponent } from './human-player.component';

describe('HumanPlayerComponent', () => {
  let component: HumanPlayerComponent;
  let fixture: ComponentFixture<HumanPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
