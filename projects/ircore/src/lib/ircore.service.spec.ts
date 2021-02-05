import { TestBed } from '@angular/core/testing';

import { IRCoreService } from './ircore.service';

describe('IRCoreService', () => {
  let service: IRCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IRCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
