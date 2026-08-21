import { TestBed } from '@angular/core/testing';

import { StockMasterService } from './stock-master.service';

describe('StockMasterService', () => {
  let service: StockMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
