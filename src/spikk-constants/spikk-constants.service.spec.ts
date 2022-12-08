import { Test, TestingModule } from '@nestjs/testing';
import { SpikkConstantsService } from './spikk-constants.service';

describe('SpikkConstantsService', () => {
  let service: SpikkConstantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpikkConstantsService],
    }).compile();

    service = module.get<SpikkConstantsService>(SpikkConstantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
