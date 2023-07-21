import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import * as process from 'process';

// import { UserSubscriber } from '../../entity-subscribers/user-subscriber';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get authConfig() {
    return {
      jwtKey: this.getString('JWT_KEY'),
      accessExpirationTime: this.getNumber('JWT_ACCESS_EXPIRATION_TIME'),
      refreshExpirationTime: this.getNumber('JWT_REFRESH_EXPIRATION_TIME'),
    };
  }

  get redisConfig() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      password: this.getString('REDIS_PASSWORD'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get lucidAPIUrl() {
    return this.getString('LUCID_API_URL');
  }

  get mailConfig() {
    return {
      host: this.getString('MAIL_HOST'),
      user: this.getString('MAIL_USER'),
      password: this.getString('MAIL_PASSWORD'),
      from: this.getString('MAIL_FROM'),
    };
  }

  get domain() {
    return this.getString('DOMAIN');
  }

  get domainStorage() {
    return this.getString('DOMAIN_STORAGE');
  }

  get uploadConfig() {
    return {
      expiredSignedUrl: 60 * 5,
      s3Config: this.s3Config,
    };
  }

  get s3Config() {
    return {
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      region: 'us-east-1',
      bucket: this.get('AWS_IAM_USER_BUCKET'),
      credentials: {
        accessKeyId: this.get('AWS_IAM_USER_KEY'),
        secretAccessKey: this.get('AWS_IAM_USER_SECRET'),
      },
    };
  }

  get sentryConfig() {
    return {
      DSN: this.getString('SENTRY_DNS'),
    };
  }
}
