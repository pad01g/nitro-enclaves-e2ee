import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { hashSync } from 'bcrypt';

import { DecryptAsymmetricKeyCommand } from './commands/decryptAsymmetricKey.command';
import { DecryptSymmetricKeyCommand } from './commands/decryptSymmetricKey.command';
import { EncryptSymmetricKeyCommand } from './commands/encryptSymmetricKey.command';
import { GenerateKeyCommand } from './commands/generateKey.command';
import { GenerateKeyPairCommand } from './commands/generateKeyPair.command';
import type {
  AsymmetricKeyPairDto,
  DecryptResultDto,
  RegisterUserDto,
  SignWithAuthDto,
  SymmetricKeyDto,
} from './dtos';
import {
  PublicKeyDto,
  RegisterUserResultDto,
  SignWithAuthResultDto,
} from './dtos';
import { CryptoNotFoundException } from './exceptions/crypto-not-found.exception';
import { RegisterFailException } from './exceptions/registerFail.exception';

@Injectable()
export class CryptoService {
  private keyPair?: AsymmetricKeyPairDto;

  private symmetricKey?: SymmetricKeyDto;

  constructor(private commandBus: CommandBus) {}

  async generateKeyPair(): Promise<PublicKeyDto> {
    // proxy to KMS key generation
    // run command
    // register to local keyPair variable

    const asymmetricKeyPair = await this.commandBus.execute<
      GenerateKeyPairCommand,
      AsymmetricKeyPairDto
    >(new GenerateKeyPairCommand());

    this.keyPair = asymmetricKeyPair;

    return new PublicKeyDto(this.keyPair.publicKey);
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

    const symmetricKey = await this.commandBus.execute<
      GenerateKeyCommand,
      SymmetricKeyDto
    >(new GenerateKeyCommand());

    this.symmetricKey = symmetricKey;
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
    // judge if you can actually register user
    // decrypt command
    const decryptedUserMessage = await this.commandBus.execute<
      DecryptAsymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptAsymmetricKeyCommand());
    const userMessage: { user: string; passwordHash: string } = {
      user: '',
      passwordHash: '',
    };
    const maybeUserMessage: { user: string; password: string } = JSON.parse(
      decryptedUserMessage.result,
    );
    userMessage.user = maybeUserMessage.user;

    // validate user Message here.
    if (userMessage.user !== '' && maybeUserMessage.password !== '') {
      // create password hash
      userMessage.passwordHash = hashSync(maybeUserMessage.password, '');

      const jsonUserMessage: string = JSON.stringify(userMessage);

      // encrypt message
      const encryptedDBMessage = await this.commandBus.execute<
        EncryptSymmetricKeyCommand,
        DecryptResultDto
      >(new EncryptSymmetricKeyCommand(jsonUserMessage));

      return new RegisterUserResultDto(encryptedDBMessage.result);
    }

    throw new RegisterFailException();
  }

  async signWithAuth(
    _signWithAuthDto: SignWithAuthDto,
  ): Promise<SignWithAuthResultDto> {
    const decryptedUserMessage = await this.commandBus.execute<
      DecryptAsymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptAsymmetricKeyCommand());
    const maybeUserMessage: { user: string; password: string } = JSON.parse(
      decryptedUserMessage.result,
    );

    const decryptedDBMessage = await this.commandBus.execute<
      DecryptSymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptSymmetricKeyCommand());
    const maybeDBMessage: { user: string; passwordHash: string } = JSON.parse(
      decryptedDBMessage.result,
    );

    const userMessage: { user: string; passwordHash: string } = {
      user: maybeUserMessage.user,
      passwordHash: hashSync(maybeUserMessage.password, ''),
    };

    const dbMessage: { user: string; passwordHash: string } = {
      user: maybeDBMessage.user,
      passwordHash: maybeDBMessage.passwordHash,
    };

    const isAuthorized =
      userMessage.user === dbMessage.user &&
      userMessage.passwordHash === dbMessage.passwordHash;

    // judge if you can actually sign
    return new SignWithAuthResultDto(isAuthorized);
  }
}
