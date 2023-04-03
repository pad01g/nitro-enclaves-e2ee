export class RegisterUserDto {
  public encryptedMessage: string;

  public user: string;

  constructor(encryptedMessage: string, user: string) {
    this.encryptedMessage = encryptedMessage;
    this.user = user;
  }
}
