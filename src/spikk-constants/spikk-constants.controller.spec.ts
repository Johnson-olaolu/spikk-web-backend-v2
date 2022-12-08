import { Test, TestingModule } from '@nestjs/testing';
import { SpikkConstantsController } from './spikk-constants.controller';
import { SpikkConstantsService } from './spikk-constants.service';

describe('SpikkConstantsController', () => {
  let controller: SpikkConstantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpikkConstantsController],
      providers: [SpikkConstantsService],
    }).compile();

    controller = module.get<SpikkConstantsController>(SpikkConstantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
