import { ApiProperty } from '@nestjs/swagger';

import type { PageOptionsDto } from './page-options.dto';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly skip: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly prev: boolean | null;

  @ApiProperty()
  readonly next: boolean | null;

  constructor(pageOptionsDto) {
    this.total = pageOptionsDto.total;
    this.skip = pageOptionsDto.skip;
    this.take = pageOptionsDto.take;
    this.prev = pageOptionsDto.prev;
    this.next = pageOptionsDto.next;
  }
}
