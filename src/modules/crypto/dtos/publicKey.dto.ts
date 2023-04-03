import { ApiProperty } from '@nestjs/swagger';

export class PublicKeyDto {
  @ApiProperty({ type: 'string', format: 'hex' })
  public publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
}
