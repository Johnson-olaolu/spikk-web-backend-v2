import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { SpikkConstantsService } from 'src/spikk-constants/spikk-constants.service';

@Injectable()
export class SeedService {
  constructor(private spikkConstantService: SpikkConstantsService) {}
  @Command({
    command: 'seed:constants',
    describe: 'seed site contants',
  })
  async seedConstants() {
    await this.spikkConstantService.seedSpikkConstants();
  }
}

// export class BasicCommand extends CommandRunner {
//   async run(
//     passedParam: string[],
//     options?: BasicCommandOptions,
//   ): Promise<void> {
//     if (options?.number) {
//       this.runWithNumber(passedParam, options.number);
//     } else if (options?.string) {
//       this.runWithString(passedParam, options.string);
//     } else {
//       this.runWithNone(passedParam);
//     }
//   }

//   @Option({
//     flags: '-s, --string [string]',
//     description: 'A string return',
//   })
//   parseString(val: string): string {
//     return val;
//   }

//   @Option({
//     flags: '-b, --boolean [boolean]',
//     description: 'A boolean parser',
//   })
//   parseBoolean(val: string): boolean {
//     return JSON.parse(val);
//   }

//   runWithString(param: string[], option: string): void {
//     console.log({ param, string: option });
//   }

//   runWithNumber(param: string[], option: number): void {
//     console.log({ param, number: option });
//   }

//   runWithNone(param: string[]): void {
//     console.log({ param });
//   }
// }
