import { TestBed } from '@angular/core/testing';

import { MessagerServiceService } from './messager-service.service';

describe('MessagerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessagerServiceService = TestBed.get(MessagerServiceService);
    expect(service).toBeTruthy();
  });
});
