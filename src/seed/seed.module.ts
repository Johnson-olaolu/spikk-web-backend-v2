import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SpikkConstantsModule } from 'src/spikk-constants/spikk-constants.module';
import { UserModule } from 'src/user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [CommandModule, SpikkConstantsModule, UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
