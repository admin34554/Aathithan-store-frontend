import { TestBed } from '@angular/core/testing';

import { CashBillService } from './cashBill.service';

describe('CashBillService', () => {
  let service: CashBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
