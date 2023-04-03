import { Module } from '@nestjs/common';

import {
  DecryptAsymmetricKeyHandler,
  DecryptSymmetricKeyHandler,
  EncryptSymmetricKeyHandler,
  GenerateKeyHandler,
  GenerateKeyPairHandler,
} from './commands';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

export const handlers = [
  GenerateKeyPairHandler,
  GenerateKeyHandler,
  EncryptSymmetricKeyHandler,
  DecryptAsymmetricKeyHandler,
  DecryptSymmetricKeyHandler,
];

@Module({
  providers: [CryptoService, ...handlers],
  controllers: [CryptoController],
})
export class CryptoModule {}
