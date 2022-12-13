import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpikkConstant } from './entities/spikk-constants.entity';

@Injectable()
export class SpikkConstantsService {
  private defaultConstants = [
    {
      key: 'DELIVERY_FEE',
      value: 1000,
    },
  ];
  constructor(
    @InjectRepository(SpikkConstant)
    private spikkConstantRepository: Repository<SpikkConstant>,
  ) {}

  async seedSpikkConstants() {
    for (const constant of this.defaultConstants) {
      const spikkConstant = await this.spikkConstantRepository.findOne({
        where: {
          key: constant.key,
        },
      });
      if (spikkConstant) {
        return;
      }
      const newSpikkConstant = await this.spikkConstantRepository.save({
        key: constant.key,
        value: constant.value,
      });
      console.log(newSpikkConstant);
    }
  }
}
