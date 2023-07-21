import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { GeneratorHelper } from './helpers/generator.helper';
import { ValidatorService } from './services/validator.service';
import { AWSS3Service } from './services/aws-s3.service';

const providers = [
  ApiConfigService,
  ValidatorService,
  GeneratorHelper,
  AWSS3Service,
  // {
  //   provide: 'NATS_SERVICE',
  //   useFactory: (configService: ApiConfigService) => {
  //     const natsConfig = configService.natsConfig;
  //     return ClientProxyFactory.create({
  //       transport: Transport.NATS,
  //       options: {
  //         name: 'NATS_SERVICE',
  //         url: `nats://${natsConfig.host}:${natsConfig.port}`,
  //       },
  //     });
  //   },
  //   inject: [ApiConfigService],
  // },
];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
