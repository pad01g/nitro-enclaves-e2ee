export class AsymmetricKeyPairDto {
  public privateKey: string;

  public publicKey: string;

  constructor(privateKey: string, publicKey: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}
