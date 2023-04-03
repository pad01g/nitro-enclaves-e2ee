export class RegisterUserResultDto {
  public encryptedDBMessage: string;

  public encryptedUserMessage: string;

  constructor(encryptedDBMessage: string, encryptedUserMessage: string) {
    this.encryptedDBMessage = encryptedDBMessage;
    this.encryptedUserMessage = encryptedUserMessage;
  }
}
