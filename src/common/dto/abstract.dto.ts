import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiProperty()
  id: Uuid;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  translations?: AbstractTranslationDto[];
}

export class AbstractTranslationDto extends AbstractDto {
  constructor() {
    super();
  }
}
