#!/usr/bin/env node
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  CommandFactory,
  CommandRunnerModule,
  CommandRunnerService,
} from 'nest-commander';
import { AppModule } from './app.module';
import { SeedModule } from './seed/seed.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  try {
    await app.select(CommandRunnerModule).get(CommandRunnerService).run();
    await app.close();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}
bootstrap();
