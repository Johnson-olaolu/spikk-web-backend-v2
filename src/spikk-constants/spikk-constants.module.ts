import { Module } from '@nestjs/common';
import { SpikkConstantsService } from './spikk-constants.service';
import { SpikkConstantsController } from './spikk-constants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpikkConstant } from './entities/spikk-constants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpikkConstant])],
  controllers: [SpikkConstantsController],
  providers: [SpikkConstantsService],
  exports: [SpikkConstantsService],
})
export class SpikkConstantsModule {}
