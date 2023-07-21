import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MaxLength,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumberString,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from '../../../decorators';

class Contact {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  method?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zipcode: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateHarvestPayload {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  speciesId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  productDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  productFormat?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  productState?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tariffId?: string;

  @ApiPropertyOptional()
  @ToBoolean()
  @IsOptional()
  isDolphinSafe?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestWeightValue?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestWeightUnit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  documentId?: string;

  @ApiPropertyOptional()
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Contact)
  farmContact!: Contact;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  eezId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  faoId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rfmoId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  catairId?: string;

  // @ApiPropertyOptional()
  // @ToBoolean()
  // @IsOptional()
  // isSmallVessel?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  IFTP?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselIMO?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselMMSI?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselIRSC?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselFlagId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestVesselNationalRegistry?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gearTypeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  simpHarvestAuthorizationBody?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  simpHarvestAuthorizationCountryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  simpHarvestAuthorizationRFMOId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  permitNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  permitIssuingAgency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iftp?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ebdc?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tripStartDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tripEndDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landingDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departureDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landingType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  landingTypeDetails?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  conditionalData?: object;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  productFormId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestScale?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestDeliveryMethod?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestDeliveryVesselName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  harvestDeliveryVesselCountryId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  harvestDeliveryEEZId?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  harvestDeliveryVesselId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalFarms?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalVessels?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalSmallVessels?: number;

  @ApiPropertyOptional()
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Contact)
  deliveryContact!: Contact;
}

// SpeciesProduct
