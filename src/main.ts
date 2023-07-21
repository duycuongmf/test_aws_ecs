import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { setupSwagger } from './docs/setup-swagger';
import { useContainer } from 'class-validator';
import { contentParser } from 'fastify-multer';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaService } from './shared/services/prisma.service';

async function bootstrap() {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const logger = new Logger();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({})
  );
  await app.register(contentParser);
  const configService = app.select(SharedModule).get(ApiConfigService);

  // Setup validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // Blind Connection instance to Validator

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      transform: true,
    })
  ); // Config datatype of response if request is not valid

  setupSwagger(app);

  await app.listen(process.env.PORT || configService.appConfig.port, '0.0.0.0');

  logger.log(
    `🚀API service running on port ${
      process.env.PORT || configService.appConfig.port
    }`
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  return app;
}

bootstrap();
