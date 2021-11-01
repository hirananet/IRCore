import { TestBed } from '@angular/core/testing';

import { HncService } from './hnc.service';

describe('HncService', () => {
  let service: HncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
