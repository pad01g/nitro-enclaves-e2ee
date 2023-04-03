import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResultDto {
  @ApiProperty({ type: 'string', format: 'hex' })
  public encryptedDBMessage: string;

  @ApiProperty({ type: 'string', format: 'hex' })
  public encryptedUserMessage: string;

  constructor(encryptedDBMessage: string, encryptedUserMessage: string) {
    this.encryptedDBMessage = encryptedDBMessage;
    this.encryptedUserMessage = encryptedUserMessage;
  }
}
