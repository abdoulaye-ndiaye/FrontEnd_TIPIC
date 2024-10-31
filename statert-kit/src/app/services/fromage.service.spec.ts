import { TestBed } from '@angular/core/testing';

import { FromageService } from './fromage.service';

describe('FromageService', () => {
  let service: FromageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FromageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
