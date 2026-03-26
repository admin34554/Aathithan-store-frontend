import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBookListComponent } from './day-book.component';

describe('DayBookComponent', () => {
  let component: DayBookListComponent;
  let fixture: ComponentFixture<DayBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayBookListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
