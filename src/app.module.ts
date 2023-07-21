import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { UserNotExistsValidator } from './validators/user-not-exists.validator';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './modules/mail/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestFilter } from './filters/bad-request.filter';
import { PrismaService } from './shared/services/prisma.service';
import { GeneratorHelper } from './shared/helpers/generator.helper';
import { StaticModule } from './modules/static/static.module';
import { ImportModule } from './modules/import/import.module';
import { DocumentModule } from './modules/document/document.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ApiConfigService } from './shared/services/api-config.service';
import { AuthAbilityFactory } from './modules/auth/casl/auth.ability.factory';
import { OrganizationModule } from './modules/organization/organization.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        dsn: configService.sentryConfig.DSN,
        debug: false,
        environment: configService.nodeEnv,
        release: null,
        logLevels: ['debug'],
      }),
      inject: [ApiConfigService],
    }),
    BullModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        redis: configService.redisConfig,
      }),
      inject: [ApiConfigService],
    }),
    ScheduleModule.forRoot(),
    SharedModule,
    UserModule,
    AuthModule,
    MailModule,
    StaticModule,
    ImportModule,
    DocumentModule,
    HarvestModule,
    OrganizationModule,
    StripeModule,
  ],
  providers: [
    UserNotExistsValidator,
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
    PrismaService,
    GeneratorHelper,
    AuthAbilityFactory,
  ],
  exports: [AuthAbilityFactory],
})
export class AppModule {}
