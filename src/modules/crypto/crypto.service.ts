import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

// import { GenerateKeyPairCommand } from './commands/generateKeyPair.command';
import type {
  // GenerateKeyPairDto,
  RegisterUserDto,
  SignWithAuthDto,
} from './dtos';
import {
  PublicKeyDto,
  RegisterUserResultDto,
  SignWithAuthResultDto,
} from './dtos';
import { CryptoNotFoundException } from './exceptions/crypto-not-found.exception';

@Injectable()
export class CryptoService {
  private keyPair?: { privateKey: string; publicKey: string };

  private symmetricKey?: string;

  constructor(private commandBus: CommandBus) {}

  async generateKeyPair(): Promise<PublicKeyDto> {
    // proxy to KMS key generation
    // run command
    // register to local keyPair variable
    this.keyPair = { privateKey: '', publicKey: '' };

    return new PublicKeyDto(this.keyPair.publicKey);

    // return this.commandBus.execute<GenerateKeyPairCommand, KeyPair>(
    //     new GenerateKeyPairCommand(),
    // );
  }

  async getPublicKey(): Promise<PublicKeyDto> {
    // proxy to KMS key get
    if (this.keyPair) {
      return new PublicKeyDto(this.keyPair.publicKey);
    }

    throw new CryptoNotFoundException();
  }

  async generateSymmetricKey(): Promise<void> {
    // proxy to KMS key generation
    // run command
    // register to local keyPair variable
    this.symmetricKey = '';
  }

  async checkSymmetricKey(): Promise<boolean> {
    // proxy to KMS key get
    if (this.symmetricKey) {
      return true;
    }

    throw new CryptoNotFoundException();
  }

  async registerUser(
    _registerUserDto: RegisterUserDto,
  ): Promise<RegisterUserResultDto> {
    // do whatever
    // run command
    return new RegisterUserResultDto();
  }

  async signWithAuth(
    _signWithAuthDto: SignWithAuthDto,
  ): Promise<SignWithAuthResultDto> {
    // do whatever
    // run command
    return new SignWithAuthResultDto();
  }
}
