import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { SpeciesController } from './controller/species.controller';
import { SpeciesService } from './service/species.service';
import { SpeciesRepository } from './repository/species/species.repository';
import { CountryController } from './controller/country.controller';
import { CountryService } from './service/country.service';
import { CountryPrismaRepository } from './repository/country/country.prisma.repository';
import { VesselController } from './controller/vessel.controller';
import { VesselRepository } from './repository/vessel/vessel.repository';
import { VesselService } from './service/vessel.service';
import { FAOPrismaRepository } from './repository/fao/fao.prisma.repository';
import { FAOController } from './controller/fao.controller';
import { FAOService } from './service/fao.service';
import { RFMOController } from './controller/rfmo.controller';
import { RFMOService } from './service/rfmo.service';
import { RFMOPrismaRepository } from './repository/rfmo/rfmo.prisma.repository';
import { CatairPrismaRepository } from './repository/catair/catair.prisma.repository';
import { CatairController } from './controller/catair.controller';
import { CatairService } from './service/catair.service';
import { EEZService } from './service/eez.service';
import { EEZController } from './controller/eez.controller';
import { EEZPrismaRepository } from './repository/eez/eez.prisma.repository';
import { FisheryPrismaRepository } from './repository/fishery/fishery.prisma.repository';
import { FisheryController } from './controller/fishery.controller';
import { FisheryService } from './service/fishery.service';
import { VesselRegistrationPrismaRepository } from './repository/vessel/vessel-registration.prisma.repository';
import { VesselRegistrationService } from './service/vessel-registration.service';
import { VesselRegistrationController } from './controller/vessel-registration.controller';
import { VesselIUUPrismaRepository } from './repository/vessel/vessel-iuu.prisma.repository';
import { VesselIUUController } from './controller/vessel-iuu.controller';
import { VesselIUUService } from './service/vessel-iuu.service';
import { TariffPrismaRepository } from './repository/tariff/tariff.prisma.repository';
import { TariffService } from './service/tariff.service';
import { TariffCodeController } from './controller/tariff-code.controller';
import { GearTypePrismaRepository } from './repository/gear-type/gear-type.prisma.repository';
import { GearTypeService } from './service/gear-type.service';
import { GearTypeController } from './controller/gear-type.controller';
import { ProductFormService } from './service/product-form.service';
import { ProductFormController } from './controller/product-form.controller';
import { ProductFormPrismaRepository } from './repository/product-form/product-form.prisma.repository';

@Module({
  controllers: [
    SpeciesController,
    CountryController,
    VesselController,
    FAOController,
    RFMOController,
    CatairController,
    EEZController,
    FisheryController,
    VesselRegistrationController,
    VesselIUUController,
    TariffCodeController,
    GearTypeController,
    ProductFormController,
  ],
  providers: [
    PrismaService,
    GeneratorHelper,
    SpeciesService,
    CountryService,
    VesselService,
    FAOService,
    RFMOService,
    CatairService,
    EEZService,
    FisheryService,
    VesselRegistrationService,
    VesselIUUService,
    TariffService,
    GearTypeService,
    ProductFormService,
    { provide: 'CountryRepository', useClass: CountryPrismaRepository }, // You can change this class for fit with database.Example: CountryKnexRepository
    { provide: 'FAORepository', useClass: FAOPrismaRepository },
    { provide: 'RFMORepository', useClass: RFMOPrismaRepository },
    { provide: 'CatairRepository', useClass: CatairPrismaRepository },
    { provide: 'EEZRepository', useClass: EEZPrismaRepository },
    { provide: 'FisheryRepository', useClass: FisheryPrismaRepository },
    {
      provide: 'VesselRegistrationRepository',
      useClass: VesselRegistrationPrismaRepository,
    },
    { provide: 'VesselIUURepository', useClass: VesselIUUPrismaRepository },
    { provide: 'TariffRepository', useClass: TariffPrismaRepository },
    { provide: 'GearTypeRepository', useClass: GearTypePrismaRepository },
    { provide: 'ProductFormRepository', useClass: ProductFormPrismaRepository },
    SpeciesRepository,
    VesselRepository,
  ],
  exports: [SpeciesService],
})
export class StaticModule {}
