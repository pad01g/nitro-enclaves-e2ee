import { Module } from '@nestjs/common';

import { GenerateKeyPairHandler } from './commands/generateKeyPair.command';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

export const handlers = [GenerateKeyPairHandler];

@Module({
  providers: [CryptoService, ...handlers],
  controllers: [CryptoController],
})
export class CryptoModule {}
