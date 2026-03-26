import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBillComponent } from './cash-bill.component';

describe('CashBillComponent', () => {
  let component: CashBillComponent;
  let fixture: ComponentFixture<CashBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
