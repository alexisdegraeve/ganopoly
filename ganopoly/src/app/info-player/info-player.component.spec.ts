import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPlayerComponent } from './info-player.component';

describe('InfoPlayerComponent', () => {
  let component: InfoPlayerComponent;
  let fixture: ComponentFixture<InfoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
