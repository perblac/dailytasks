import { TestBed } from '@angular/core/testing';

import { AvailableDaysService } from './available-days.service';

describe('AvailableDaysService', () => {
  let service: AvailableDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
