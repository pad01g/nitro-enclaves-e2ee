export class RegisterUserResultDto {
  public encryptedMessage: string;

  constructor(encryptedMessage: string) {
    this.encryptedMessage = encryptedMessage;
  }
}
