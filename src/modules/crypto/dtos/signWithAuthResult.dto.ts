import { ApiProperty } from '@nestjs/swagger';

export class SignWithAuthResultDto {
  @ApiProperty({ type: 'boolean' })
  public isAuthorized: boolean;

  @ApiProperty({ type: 'string', format: 'hex' })
  public encryptedMessage: string;

  constructor(isAuthorized: boolean, encryptedMessage: string) {
    this.isAuthorized = isAuthorized;
    this.encryptedMessage = encryptedMessage;
  }
}
