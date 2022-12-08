import { Controller } from '@nestjs/common';
import { SpikkConstantsService } from './spikk-constants.service';

@Controller('spikk-constants')
export class SpikkConstantsController {
  constructor(private readonly spikkConstantsService: SpikkConstantsService) {}
}
