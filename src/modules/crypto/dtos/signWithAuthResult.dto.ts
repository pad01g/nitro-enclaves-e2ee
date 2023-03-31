export class SignWithAuthResultDto {
  public isAuthorized: boolean;

  public encryptedMessage: string;

  constructor(isAuthorized: boolean, encryptedMessage: string) {
    this.isAuthorized = isAuthorized;
    this.encryptedMessage = encryptedMessage;
  }
}
