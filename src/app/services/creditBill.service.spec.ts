import { TestBed } from '@angular/core/testing';

import { CreditBillService } from './creditBill.service';

describe('CashBillService', () => {
  let service: CreditBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
