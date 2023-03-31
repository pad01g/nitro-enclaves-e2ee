export class SignWithAuthResultDto {
  public isAuthorized: boolean;

  constructor(isAuthorized: boolean) {
    this.isAuthorized = isAuthorized;
  }
}
