import { TestBed } from '@angular/core/testing';

import { GlobUserService } from './glob-user.service';

describe('GlobUserService', () => {
  let service: GlobUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
