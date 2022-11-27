import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSpikk(): string {
    return 'Spikk v1 API';
  }
}
