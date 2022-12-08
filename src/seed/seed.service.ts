import { Command, CommandRunner, Option } from 'nest-commander';
import { SpikkConstantsService } from 'src/spikk-constants/spikk-constants.service';

interface BasicCommandOptions {
  type: 'constants' | 'roles' | 'permision' | 'user';
}
@Command({ name: 'seed', description: 'seed data into database' })
export class SeedService extends CommandRunner {
  constructor(private spikkConstantService: SpikkConstantsService) {
    super();
  }
  async run(passedParam: string[], options?: BasicCommandOptions) {
    if (options.type === 'constants') {
      this.seedConstants();
    }
  }

  @Option({
    flags: '-t, --type [type]',
    description: 'Select seed type',
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
