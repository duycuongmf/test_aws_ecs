import { Module } from '@nestjs/common';
import { Command, CommandFactory, CommandRunner } from 'nest-commander';
import { PrismaService } from '../../../shared/services/prisma.service';
import { GeneratorHelper } from '../../../shared/helpers/generator.helper';
import { ConvertService } from '../convert.service';

@Command({ name: 'convert', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
  constructor(private convertService: ConvertService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.convertService.convertCountries();
      await this.convertService.convertSpecies();
      await this.convertService.convertVessels();
      await this.convertService.convertVesselIUU();
      await this.convertService.convertTariffCode();
      await this.convertService.convertGearType();
      await this.convertService.convertProductForm();
      await this.convertService.convertEEZs();
      await this.convertService.convertRFMOs();
      await this.convertService.convertFAOs();
      await this.convertService.convertCatairs();
      await this.convertService.convertSyncRLS();
      await this.convertService.convertFishery();
      await this.convertService.syncAlpha3CountryToEEZ();
      await this.convertService.syncNewTariffAndSpecies();
      await this.convertService.syncFAOAndCatair();
      await this.convertService.syncRFMOAndCountry();
    } catch (e) {
      console.log(e);
    }
  }
}

@Module({
  providers: [PrismaService, GeneratorHelper, BasicCommand, ConvertService],
})
export class AppModule {}

async function bootstrap() {
  try {
    await CommandFactory.run(AppModule, ['warn', 'error', 'debug']);
  } catch (e) {
    console.log(e);
  }
}

bootstrap();
