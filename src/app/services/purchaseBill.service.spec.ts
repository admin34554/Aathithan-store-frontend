import { TestBed } from '@angular/core/testing';

import { PurchaseBillService } from './purchaseBill.service';

describe('PurchaseBillService', () => {
  let service: PurchaseBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
