import { Module } from '@nestjs/common';
import { SpikkConstantsModule } from 'src/spikk-constants/spikk-constants.module';
import { SeedService } from './seed.service';

@Module({
  imports: [SpikkConstantsModule],
  providers: [SeedService],
})
export class SeedModule {}
