import { NotFoundException } from '@nestjs/common';

export class CryptoNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.cryptoNotFound', error);
  }
}
