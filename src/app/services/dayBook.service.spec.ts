import { TestBed } from '@angular/core/testing';

import { DayBookService } from './dayBook.service';

describe('DayBookService', () => {
  let service: DayBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
