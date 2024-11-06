import { TestBed } from '@angular/core/testing';

import { AnalyseSensorielleService } from './analyse-sensorielle.service';

describe('AnalyseSensorielleService', () => {
  let service: AnalyseSensorielleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyseSensorielleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
