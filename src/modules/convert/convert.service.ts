import { readFileSync } from 'fs';
import * as CLIProgress from 'cli-progress';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { GeneratorHelper } from '../../shared/helpers/generator.helper';
import { Prisma, sTariff, User, VesselsIUUStatus } from '@prisma/client';
import * as FastCSV from 'fast-csv';
import * as fs from 'fs';
import { isEmpty } from 'lodash';

export interface TariffCodeFormat {
  full?: string;
  nondelimited?: string;
  chapter?: string;
  heading?: string;
  chapter_heading?: string;
  subheading?: string;
  tariff_rate?: string;
  statistical_suffix?: string;
}

@Injectable()
export class ConvertService {
  private logger = new Logger(ConvertService.name);

  constructor(
    private prisma: PrismaService,
    private generatorHelper: GeneratorHelper
  ) {}

  async convertCountries(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const countries: any = this.readFromJsonFile('countries.json');
        this.logger.debug(
          `Parse data from Json file, total Countries: ${countries.length}`
        );
        await this.prisma.sCountry.deleteMany();
        for (const country of countries) {
          const data: Prisma.sCountryCreateInput = {
            id: this.generatorHelper.generateSnowflakeId(),
            mId: country._id.$oid,
            name: country.name,
            alpha2: country.alpha2,
            alpha3: country.alpha3,
            mid:
              country.mid != null
                ? JSON.parse(country.mid).map((item) => item.toString())
                : [],
          };
          await this.prisma.sCountry.create({
            data,
          });
          count++;
        }
        this.logger.debug(`Total Countries created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertSpecies(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const speciesList: any = this.readFromJsonFile('species.json');
        this.logger.debug(
          `Parse data from Json file, total Species: ${speciesList.length}`
        );
        await this.prisma.sSpecies.deleteMany();
        for (const species of speciesList) {
          const data: Prisma.sSpeciesCreateInput = {
            id: this.generatorHelper.generateSnowflakeId(),
            mId: species._id.$oid,
            name: species.name,
            alpha3: species.alpha3,
            scientificName: species.scientific_name,
            taxonomyCode: species.taxonomy_code,
          };
          await this.prisma.sSpecies.create({ data: data });
          count++;
        }
        this.logger.debug(`Total Species created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertVessels(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('vessels.json');
        this.logger.debug(
          `Parse data from Json file, total Vessels: ${records.length}`
        );
        const progressBarVessel = new CLIProgress.SingleBar(
          {},
          CLIProgress.Presets.shades_classic
        );
        progressBarVessel.start(records.length, 0);

        await this.prisma.sVessel.deleteMany();
        await this.prisma.sVesselRegistration.deleteMany();

        for (const record of records) {
          const country = await this.prisma.sCountry.findFirst({
            where: {
              OR: [
                {
                  mId: record.country.$oid || undefined,
                },
                {
                  name:
                    record.country && !record.country.$oid
                      ? record.country.replace('(the)', '')
                      : undefined,
                },
                {
                  alpha2: record.alpha2
                    ? record.alpha2
                    : record.country.length === 2
                    ? record.country
                    : record.flag
                    ? record.flag
                    : undefined,
                },
                {
                  alpha3:
                    record.alpha3 && record.alpha3.length > 3
                      ? record.alpha3.split(';')[0]
                      : record.alpha3
                      ? record.alpha3
                      : undefined,
                },
              ],
            },
          });
          const vessel = await this.prisma.sVessel.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              name: record.name,
              IMO: record.IMO,
              IRCS: record.IRCS,
              MMSI: record.MMSI,
              nationalRegistry: record.national,
              country:
                record.country && record.country.$oid != null
                  ? { connect: { id: country.id } }
                  : undefined,
            },
          });

          await this.prisma.sVesselRegistration.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              vesselId: vessel.id,
              type: record.other_reg,
              value: record.other_reg_issuer,
            },
          });
          count++;
          progressBarVessel.update(count);
        }
        progressBarVessel.stop();
        this.logger.debug(`Total Vessels created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertVesselIUU(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('vesselsiuu.json');
        this.logger.debug(
          `Parse data from Json file, total Vessel-IUU: ${records.length}`
        );
        await this.prisma.sVesselIUU.deleteMany();
        for (const record of records) {
          const country = await this.prisma.sCountry.findFirst({
            where: {
              OR: [
                {
                  name: record.country ? record.country : undefined,
                },
                {
                  alpha2: record.alpha2 ? record.alpha2 : undefined,
                },
                {
                  alpha3:
                    record.alpha3 && record.alpha3.length > 3
                      ? record.alpha3.split(';')[0]
                      : record.alpha3
                      ? record.alpha3
                      : undefined,
                },
              ],
            },
          });
          await this.prisma.sVesselIUU.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              name: record.name,
              IMO: record.IMO,
              IRCS: record.IRCS,
              MMSI: record.MMSI,
              status: VesselsIUUStatus.CURRENT,
              nationalRegistry: record.national,
              country:
                country && country.id != null
                  ? { connect: { id: country.id } }
                  : undefined,
            },
          });
          count++;
        }
        this.logger.debug(`Total Vessel-IUU created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertTariffCode(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('tariffs.json');
        this.logger.debug(
          `Parse data from Json file, total Tariff-Code: ${records.length}`
        );
        await this.prisma.sTariff.deleteMany();
        for (const record of records) {
          const code: TariffCodeFormat = this.convertTariffCodeFormat(
            record.code
          );
          await this.prisma.sTariff.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              footnotes: record.footnotes,
              quotaQuantity: record.quotaQuantity,
              description: record.description,
              other: record.other,
              htsno: record.htsno,
              units: record.units,
              indent: record.indent,
              general: record.general,
              superior: record.superior || null,
              special: record.special || null,
              chapter: code.chapter || null,
              heading: code.heading || null,
              chapterHeading: `${code.chapter + code.heading}` || null,
              subheading: code.subheading || null,
              tariffRate: code.tariff_rate || null,
              statisticalSuffix: code.statistical_suffix || null,
              fullDelimited: code.full,
              fullNonDelimited: code.nondelimited || null,
              fullDescription: record.fullDescription
                ? JSON.parse(record.fullDescription).map((item) =>
                    item.toString()
                  )
                : [],
            },
          });
          count++;
        }
        this.logger.debug(`Total Tariff-Code created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertGearType(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('gears.json');
        this.logger.debug(
          `Parse data from Json file, total Gear-Type: ${records.length}`
        );
        await this.prisma.sGearType.deleteMany();
        for (const record of records) {
          await this.prisma.sGearType.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
              type: record.type,
            },
          });
          count++;
        }
        this.logger.debug(`Total Gear-Type created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertProductForm(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('productforms.json');
        this.logger.debug(
          `Parse data from Json file, total Product-Form: ${records.length}`
        );
        await this.prisma.sProductForm.deleteMany();
        for (const record of records) {
          await this.prisma.sProductForm.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
            },
          });
          count++;
        }
        this.logger.debug(`Total Product-Form created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertEEZs(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('eezs.json');
        this.logger.debug(
          `Parse data from Json file, total EEZs: ${records.length}`
        );
        await this.prisma.sFisheryEEZ.deleteMany();
        await this.prisma.sEEZ.deleteMany();
        for (const record of records) {
          await this.prisma.sEEZ.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
            },
          });
          count++;
        }
        this.logger.debug(`Total EEZs created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertRFMOs(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('rfmos.json');
        this.logger.debug(
          `Parse data from Json file, total RFMOs: ${records.length}`
        );
        await this.prisma.sFisheryRMFO.deleteMany();
        await this.prisma.sRFMO.deleteMany();
        for (const record of records) {
          await this.prisma.sRFMO.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
            },
          });
          count++;
        }
        this.logger.debug(`Total RFMOs created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertFAOs(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('faos.json');
        this.logger.debug(
          `Parse data from Json file, total FAOs: ${records.length}`
        );
        await this.prisma.sFisheryFAO.deleteMany();
        await this.prisma.sFAO.deleteMany();
        for (const record of records) {
          await this.prisma.sFAO.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
              type: record.type,
            },
          });
          count++;
        }
        this.logger.debug(`Total FAOs created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertCatairs(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('catairs.json');
        this.logger.debug(
          `Parse data from Json file, total Catairs: ${records.length}`
        );
        await this.prisma.sCatair.deleteMany();
        for (const record of records) {
          await this.prisma.sCatair.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              mId: record._id.$oid,
              code: record.code,
              name: record.name,
              description: record.description,
            },
          });
          count++;
        }
        this.logger.debug(`Total Catairs created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    });
  }

  async convertSyncRLS(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const _tmpMongoEEZIds = {};
        const _tmpMongoFAOIds = {};
        const _tmpMongoRFMOIds = {};
        const _tmpMongoCatarIds = {};
        const _tmpMongoCountryIds = {};
        const EEZFAO = [];
        const EEZRMFO = [];
        const EEZCatair = [];
        const EEZCountry = [];
        const FAORFMO = [];
        const RMFOCatair = [];
        await this.prisma.sEEZFAO.deleteMany();
        await this.prisma.sEEZRMFO.deleteMany();
        await this.prisma.sEEZCatair.deleteMany();
        await this.prisma.sEEZCountry.deleteMany();
        await this.prisma.sFAORFMO.deleteMany();
        await this.prisma.sFAOCatair.deleteMany();
        await this.prisma.sRMFOCatair.deleteMany();
        await this.prisma.sRFMOCountry.deleteMany();

        const eezRecords: any = this.readFromJsonFile('eezs.json');
        for (const eez of eezRecords) {
          const EEZ = await this.prisma.sEEZ.findFirst({
            where: {
              mId: eez._id.$oid,
            },
          });
          if (EEZ != null && EEZ.id) {
            _tmpMongoEEZIds[EEZ.mId] = EEZ;
            if (eez.fao != null) {
              eez.fao =
                typeof eez.fao !== 'object'
                  ? eez.fao.slice(1, -1).split(', ')
                  : [];
              for (const fao of eez.fao) {
                if (!_tmpMongoFAOIds[fao]) {
                  const FAO = await this.prisma.sFAO.findFirst({
                    where: {
                      mId: fao,
                    },
                  });
                  if (FAO != null && FAO.mId) _tmpMongoFAOIds[FAO.mId] = FAO;
                }
                if (_tmpMongoFAOIds[fao]) {
                  EEZFAO.push({
                    eezId: EEZ.id,
                    faoId: _tmpMongoFAOIds[fao].id,
                  });
                  count++;
                }
              }
            }

            if (eez.rfmo != null) {
              eez.rfmo =
                typeof eez.rfmo !== 'object'
                  ? eez.rfmo.slice(1, -1).split(', ')
                  : [];
              for (const rfmo of eez.rfmo) {
                if (!_tmpMongoRFMOIds[rfmo]) {
                  const RFMO = await this.prisma.sRFMO.findFirst({
                    where: {
                      mId: rfmo,
                    },
                  });
                  if (RFMO != null && RFMO.mId)
                    _tmpMongoRFMOIds[RFMO.mId] = RFMO;
                }
                if (_tmpMongoRFMOIds[rfmo]) {
                  EEZRMFO.push({
                    eezId: EEZ.id,
                    rfmoId: _tmpMongoRFMOIds[rfmo].id,
                  });
                  count++;
                }
              }
            }

            if (eez.catair != null) {
              eez.catair =
                typeof eez.catair !== 'object'
                  ? eez.catair.slice(1, -1).split(', ')
                  : [];
              for (const catair of eez.catair) {
                if (!_tmpMongoCatarIds[catair]) {
                  const Catair = await this.prisma.sCatair.findFirst({
                    where: {
                      mId: catair,
                    },
                  });
                  if (Catair != null && Catair.mId)
                    _tmpMongoCatarIds[Catair.mId] = Catair;
                }
                if (_tmpMongoCatarIds[catair]) {
                  EEZCatair.push({
                    eezId: EEZ.id,
                    catairId: _tmpMongoCatarIds[catair].id,
                  });
                  count++;
                }
              }
            }
            if (eez.country != null) {
              if (!_tmpMongoCountryIds[eez.country.$oid]) {
                const country = await this.prisma.sCountry.findFirst({
                  where: {
                    mId: eez.country.$oid,
                  },
                });
                if (country != null && country.mId)
                  _tmpMongoCountryIds[country.mId] = country;
              }
              if (_tmpMongoCountryIds[eez.country.$oid]) {
                EEZCountry.push({
                  eezId: EEZ.id,
                  countryId: _tmpMongoCountryIds[eez.country.$oid].id,
                });
                count++;
              }
            }
          }
        }

        const rfmoRecords: any = this.readFromJsonFile('rfmos.json');
        for (const rfmo of rfmoRecords) {
          const RFMO = await this.prisma.sRFMO.findFirst({
            where: {
              mId: rfmo._id.$oid,
            },
          });
          if (RFMO != null && RFMO.id) {
            _tmpMongoRFMOIds[RFMO.mId] = RFMO;
            if (rfmo.eez != null) {
              rfmo.eez = this.formatUnknownFormat(rfmo.eez);
              for (const eez of rfmo.eez) {
                if (!_tmpMongoEEZIds[eez._id]) {
                  const EEZ = await this.prisma.sEEZ.findFirst({
                    where: {
                      code: eez.code,
                    },
                  });
                  EEZRMFO.push({
                    eezId: EEZ.id,
                    rfmoId: RFMO.id,
                  });
                  count++;
                }
              }
            }

            if (rfmo.fao != null) {
              rfmo.fao = this.formatUnknownFormat(rfmo.fao);
              for (const fao of rfmo.fao) {
                if (!_tmpMongoFAOIds[fao._id]) {
                  const FAO = await this.prisma.sFAO.findFirst({
                    where: {
                      code: fao.code,
                    },
                  });
                  if (FAO != null && FAO.id) {
                    FAORFMO.push({
                      faoId: FAO.id,
                      rfmoId: RFMO.id,
                    });
                    count++;
                  }
                }
              }
            }

            if (rfmo.catair != null) {
              rfmo.catair = this.formatUnknownFormat(rfmo.catair);
              for (const catair of rfmo.catair) {
                if (!_tmpMongoCatarIds[catair._id]) {
                  const Catair = await this.prisma.sCatair.findFirst({
                    where: {
                      code: catair.code,
                    },
                  });
                  if (Catair != null && Catair.id) {
                    RMFOCatair.push({
                      catairId: Catair.id,
                      rmfoId: RFMO.id,
                    });
                    count++;
                  }
                }
              }
            }
          }
        }

        if (EEZCatair.length > 0) {
          await this.prisma.sEEZCatair.createMany({
            data: EEZCatair,
            skipDuplicates: true,
          });
        }
        if (EEZFAO.length > 0) {
          await this.prisma.sEEZFAO.createMany({
            data: EEZFAO,
            skipDuplicates: true,
          });
        }

        if (EEZRMFO.length > 0) {
          await this.prisma.sEEZRMFO.createMany({
            data: EEZRMFO,
            skipDuplicates: true,
          });
        }
        if (EEZCountry.length > 0) {
          await this.prisma.sEEZCountry.createMany({
            data: EEZCountry,
            skipDuplicates: true,
          });
        }

        if (FAORFMO.length > 0) {
          await this.prisma.sFAORFMO.createMany({
            data: FAORFMO,
            skipDuplicates: true,
          });
        }

        if (RMFOCatair.length > 0) {
          await this.prisma.sRMFOCatair.createMany({
            data: RMFOCatair,
            skipDuplicates: true,
          });
        }

        this.logger.debug(
          `Total RLS EEZ <-> RFMO, EEZ <-> FAO, EEZ <-> Catair, RFMO <-> EEZ, RFMO <-> FAO, RFMO <-> Catair, created: ${count}`
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async convertFishery(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records: any = this.readFromJsonFile('fishery.json');
        this.logger.debug(
          `Parse data from Json file, total Fishery: ${records.length}`
        );
        await this.prisma.sFisheryEEZ.deleteMany();
        await this.prisma.sFisheryFAO.deleteMany();
        await this.prisma.sFisheryRMFO.deleteMany();
        await this.prisma.sFisheryGearType.deleteMany();
        await this.prisma.sFishery.deleteMany();
        const progressBarFishery = new CLIProgress.SingleBar(
          {},
          CLIProgress.Presets.shades_classic
        );
        progressBarFishery.start(records.length, 0);

        for (const record of records) {
          const country = await this.prisma.sCountry.findFirst({
            where: {
              alpha2: record.country_code,
            },
          });

          const species = await this.prisma.sSpecies.findFirst({
            where: {
              alpha3: record.species,
            },
          });

          const fishery = await this.prisma.sFishery.create({
            data: {
              id: this.generatorHelper.generateSnowflakeId(),
              fisheryId: record.fishery_id || null,
              loffId: record.loff_id || null,
              country:
                country && country.id != null
                  ? { connect: { id: country.id } }
                  : undefined,
              species:
                species && species.id != null
                  ? { connect: { id: species.id } }
                  : undefined,
            },
          });

          // HoangHN - Create Relationship EEZ <-> Fishery
          if (record.eez && record.eez.length > 0) {
            const EEZs = await this.prisma.sEEZ.findMany({
              where: { code: { in: record.eez } },
            });
            await this.prisma.sFisheryEEZ.createMany({
              data: EEZs.map((eez) => ({
                eezId: eez.id,
                fisheryId: fishery.id,
              })),
              skipDuplicates: true,
            });
          }

          // HoangHN - Create Relationship FAO <-> Fishery
          if (record.fao && record.fao.length > 0) {
            const FAOs = await this.prisma.sFAO.findMany({
              where: { code: { in: record.fao } },
            });
            await this.prisma.sFisheryFAO.createMany({
              data: FAOs.map((fao) => ({
                faoId: fao.id,
                fisheryId: fishery.id,
              })),
              skipDuplicates: true,
            });
          }

          // HoangHN - Create Relationship RFMO <-> Fishery
          if (record.rfmo && record.rfmo.length > 0) {
            const RFMOs = await this.prisma.sRFMO.findMany({
              where: { code: { in: record.rfmo } },
            });
            await this.prisma.sFisheryRMFO.createMany({
              data: RFMOs.map((rfmo) => ({
                rfmoId: rfmo.id,
                fisheryId: fishery.id,
              })),
              skipDuplicates: true,
            });
          }

          if (record.gear && record.gear.length > 0) {
            const gearTypes = await this.prisma.sGearType.findMany({
              where: { type: { in: record.gear } },
            });
            await this.prisma.sFisheryGearType.createMany({
              data: gearTypes.map((gearType) => ({
                gearTypeId: gearType.id,
                fisheryId: fishery.id,
              })),
              skipDuplicates: true,
            });
          }

          count++;
          progressBarFishery.update(count);
        }
        progressBarFishery.stop();
        this.logger.debug(`Total Fishery created: ${count}`);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async syncAlpha3CountryToEEZ(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        const records = await this.prisma.sEEZ.findMany();
        console.log(records.length);
        for (const record of records) {
          console.log(record.code);
          const _country = await this.prisma.sCountry.findFirst({
            where: {
              alpha2: record.code,
            },
          });
          await this.prisma.sEEZ.update({
            data: {
              alpha3: _country?.alpha3 || null,
            },
            where: {
              id: record.id,
            },
          });
          count++;
        }
        this.logger.debug(`Total EEZs Updated: ${count}`);
        resolve(true);
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  }

  async syncNewTariffAndSpecies(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let countCreate = 0;
        let countUpdate = 0;
        let records: any = await this.readFromCSVFile(
          'HTSUS-Codes-23.csv',
          this.parserTariff
        );
        records = this.cleanData(records);
        records = this.flattenData(records);

        this.logger.debug(
          `Parse data from CSV file, total Record: ${records.length}`
        );

        for (const record of records) {
          if (record && record.htsno) {
            let _tariff = await this.prisma.sTariff.findFirst({
              where: {
                htsno: record.htsno,
              },
            });

            if (!_tariff) {
              const cloneData = Object.assign({}, record);
              delete cloneData['scientificName'];
              delete cloneData['scientificFamily'];

              _tariff = await this.prisma.sTariff.create({
                data: {
                  ...cloneData,
                  id: this.generatorHelper.generateSnowflakeId(),
                },
              });
              countCreate++;
            }

            if (_tariff && _tariff.id) {
              const speciesTariff = [];
              const _scientificItem = record?.scientificName?.concat(
                record?.scientificFamily?.filter(
                  (item) => record?.scientificName?.indexOf(item) < 0
                )
              );

              if (_scientificItem.length > 0) {
                for (const scientificItem of _scientificItem) {
                  const species = await this.prisma.sSpecies.findMany({
                    where: {
                      scientificName: scientificItem,
                    },
                  });

                  for (const item of species) {
                    speciesTariff.push({
                      tariffId: _tariff.id,
                      speciesId: item.id,
                    });
                    countUpdate++;
                  }
                }
              }

              if (speciesTariff.length > 0) {
                await this.prisma.sSpeciesTariff.createMany({
                  data: speciesTariff,
                  skipDuplicates: true,
                });
              }
            }
          }
        }
        this.logger.debug(
          `Total Create: ${countCreate} - Sync Relation: ${countUpdate}`
        );
        resolve(true);
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  }

  async syncFAOAndCatair(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const countCreate = 0;
        const countUpdate = 0;
        const records: any = await this.readFromCSVFile(
          'FAO-CATAIR.csv',
          this.parserFAOData
        );

        console.log(records);

        this.logger.debug(
          `Parse data from CSV file, total Record: ${records.length}`
        );

        for (const record of records) {
          console.log(record.catair);
          if (record.fao && record.catair) {
            const fao = await this.prisma.sFAO.findFirst({
              where: {
                code: record.fao.toString(),
              },
            });

            const catairs = await this.prisma.sCatair.findMany({
              where: {
                code: { in: record.catair },
              },
            });

            if (fao && fao.id) {
              for (const catair of catairs) {
                await this.prisma.sFAOCatair.createMany({
                  data: {
                    catairId: catair.id,
                    faoId: fao.id,
                  },
                  skipDuplicates: true,
                });
              }
            }
          }
        }

        this.logger.debug(
          `Total Create: ${countCreate} - Sync Relation: ${countUpdate}`
        );
        resolve(true);
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  }

  async syncRFMOAndCountry(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let countCreate = 0;
        let countUpdate = 0;
        const records: any = await this.readFromCSVFile(
          'RFMO-Country.csv',
          this.parserRFMOData
        );

        this.logger.debug(
          `Parse data from CSV file, total Record: ${records.length}`
        );

        for (const record of records) {
          if (record.rfmo && record.countries) {
            const rfmo = await this.prisma.sRFMO.findFirst({
              where: {
                code: record.rfmo,
              },
            });

            const countries = await this.prisma.sCountry.findMany({
              where: {
                alpha2: { in: record.countries },
              },
            });

            console.log(record.countries);
            if (rfmo && rfmo.id) {
              const RFMOCountry = [];
              for (const country of countries) {
                countCreate++;
                RFMOCountry.push({
                  countryId: country.id,
                  rfmoId: rfmo.id,
                });
              }

              if (RFMOCountry.length > 0) {
                console.log(RFMOCountry);
                const updated = await this.prisma.sRFMOCountry.createMany({
                  data: RFMOCountry,
                  skipDuplicates: true,
                });
                countUpdate = countUpdate + updated.count;
              }
            }
          }
        }

        this.logger.debug(
          `Total Create: ${countCreate} - Sync Relation: ${countUpdate}`
        );
        resolve(true);
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  }

  readFromJsonFile(path: string): Promise<any> {
    try {
      const jsonData = readFileSync(`${__dirname}/datasets/${path}`, 'utf8');
      return JSON.parse(jsonData);
    } catch (err) {
      throw err;
    }
  }

  readFromCSVFile(path: string, _parser?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const records: any = [];
        console.log(`${__dirname}/datasets/${path}`);
        return FastCSV.parseFile(`${__dirname}/datasets/${path}`)
          .on('error', (error) => console.error(error))
          .on('data', async (row) => {
            if (typeof _parser === 'function') row = _parser(row);
            records.push(row);
            return row;
          })
          .on('end', (rowCount) => {
            resolve(records);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  cleanData(data: any): any[] {
    const tree = [];
    const parentMap = {};
    for (const item of data) {
      const indent = parseInt(item.indent);
      const parent = parentMap[indent - 1] || tree;
      const fullDescription = [
        ...(parent.fullDescription || []),
        item.description,
      ];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push({ ...item, children: [], fullDescription });
      parentMap[indent] = parent.children[parent.children.length - 1];
    }
    return tree;
  }

  flattenData(data: any): any[] {
    const flattened = [];

    function flatten(node) {
      const { children, ...rest } = node;
      flattened.push(rest);
      if (children && children.length > 0) {
        for (const child of children) {
          flatten(child);
        }
      }
    }

    for (const node of data.children) {
      flatten(node);
    }

    return flattened;
  }

  formatUnknownFormat(unknownFormat: string): any[] {
    const objectRegex = /{([^}]*)}/g;
    const propertyRegex = /(\w+)=([^,]+)/g;
    const result = [];
    let match = objectRegex.exec(unknownFormat);
    while (match !== null) {
      const obj = {};
      let propertyMatch = propertyRegex.exec(match[1]);
      while (propertyMatch !== null) {
        obj[propertyMatch[1].trim()] = propertyMatch[2].trim();
        propertyMatch = propertyRegex.exec(match[1]);
      }
      result.push(obj);
      match = objectRegex.exec(unknownFormat);
    }

    return result;
  }

  convertTariffCodeFormat(_string: string): TariffCodeFormat {
    if (!_string) return {};
    const stripped = _string.slice(1, -1);
    const pairs = stripped.split(', ');
    return pairs.reduce((obj, pair) => {
      const [key, value] = pair.split('=');
      obj[key] = value;
      return obj;
    }, {});
  }

  removeHTMLTag(_string: string): string {
    let cleanStr = _string.replace(/<[^>]*>/g, '');
    cleanStr = cleanStr.replace(/[\r\n]/g, '');
    return cleanStr;
  }

  parserTariff(row: object): object {
    const _tariff = {} as any;
    const code = row[0].split('.');
    const parseCode = {
      full: code.join('.'),
      nondelimited: code.join(''),
      chapter: code[0].substring(0, 2),
      heading: code[0].toString().substring(2, 4),
      chapter_heading: code[0],
      subheading: code[1],
      tariff_rate: code[2],
      statistical_suffix: code[3],
    };
    const scientificName = row[3] ? row[3].split(',') : [];
    const scientificFamily = row[7] ? row[7].split(',') : [];

    _tariff.description = this.removeHTMLTag(row[10]);
    _tariff.scientificName = !isEmpty(scientificName) ? scientificName : [];
    _tariff.scientificFamily = !isEmpty(scientificFamily)
      ? scientificFamily
      : [];
    _tariff.other = row[14];
    _tariff.htsno = row[0];
    _tariff.units = row[11];
    _tariff.units = row[11];
    _tariff.indent = row[1];
    _tariff.general = row[12];
    _tariff.special = row[13];
    _tariff.chapter = parseCode.chapter;
    _tariff.heading = parseCode.heading;
    _tariff.chapterHeading = `${parseCode.chapter + parseCode.heading}` || null;
    _tariff.subheading = parseCode.subheading;
    _tariff.tariffRate = parseCode.tariff_rate;
    _tariff.statisticalSuffix = parseCode.statistical_suffix;
    _tariff.fullDelimited = parseCode.full || null;
    _tariff.fullNonDelimited = parseCode.nondelimited || null;
    return _tariff;
  }

  parserFAOData(row: object): object {
    const _tmp = {} as any;
    _tmp.fao = parseInt(row[1]);
    _tmp.catair = row[3] ? row[3].split(',').map((item) => item.trim()) : null;
    _tmp.eez = row[4] ? row[4].split(',').map((item) => item.trim()) : null;
    _tmp.isHighSeas = row[5] === 'TRUE';
    return _tmp;
  }

  parserRFMOData(row: object): object {
    const _tmp = {} as any;
    _tmp.rfmo = row[1];
    _tmp.countries = row[9]
      ? row[9].split(',').map((item) => item.trim())
      : null;
    return _tmp;
  }
}
