import { TestBed } from '@angular/core/testing';

import { SiftMsService } from './sift-ms.service';

describe('SiftMsService', () => {
  let service: SiftMsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiftMsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
