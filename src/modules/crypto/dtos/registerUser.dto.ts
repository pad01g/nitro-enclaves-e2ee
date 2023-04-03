import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ type: 'string', format: 'hex' })
  public encryptedMessage: string;

  @ApiProperty({ type: 'string', format: 'email' })
  public user: string;

  constructor(encryptedMessage: string, user: string) {
    this.encryptedMessage = encryptedMessage;
    this.user = user;
  }
}
