import { TestBed } from '@angular/core/testing';

import { LogisticsService } from './logistics.service';

describe('LogisticsService', () => {
  let service: LogisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
