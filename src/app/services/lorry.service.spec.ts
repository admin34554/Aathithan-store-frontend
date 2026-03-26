import { TestBed } from '@angular/core/testing';

import { LorryService } from './lorry.service';

describe('LorryService', () => {
  let service: LorryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LorryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
