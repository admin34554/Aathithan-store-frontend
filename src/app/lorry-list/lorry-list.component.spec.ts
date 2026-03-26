import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryListComponent } from './lorry-list.component';

describe('LorryListComponent', () => {
  let component: LorryListComponent;
  let fixture: ComponentFixture<LorryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LorryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
