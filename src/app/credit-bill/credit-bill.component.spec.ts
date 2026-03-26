import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBillComponent } from './credit-bill.component';

describe('CreditBillComponent', () => {
  let component: CreditBillComponent;
  let fixture: ComponentFixture<CreditBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
