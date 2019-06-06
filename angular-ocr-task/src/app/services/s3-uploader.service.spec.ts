import { TestBed } from '@angular/core/testing';

import { S3UploaderService } from './s3-uploader.service';

describe('S3UploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: S3UploaderService = TestBed.get(S3UploaderService);
    expect(service).toBeTruthy();
  });
});
