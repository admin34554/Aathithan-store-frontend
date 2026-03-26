import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryComponent } from './lorry.component';

describe('LorryComponent', () => {
  let component: LorryComponent;
  let fixture: ComponentFixture<LorryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LorryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
