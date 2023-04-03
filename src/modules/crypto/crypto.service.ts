import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { createCipheriv, createHash, randomBytes } from 'crypto';
import { ec, eddsa } from 'elliptic';

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
import { SignWithAuthFailException } from './exceptions/signWithAuthFail.exception';

@Injectable()
export class CryptoService {
  private keyPair?: AsymmetricKeyPairDto;

  private symmetricKey?: SymmetricKeyDto;

  constructor(private commandBus: CommandBus) {}

  private symmetricEncryptionAlgorithm = 'aes-256-cbc';

  private hashAlgorithm = 'sha256';

  private encrypt(body: string, key: string): string {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      this.symmetricEncryptionAlgorithm,
      keyBuffer,
      iv,
    );

    const res = Buffer.concat([
      iv,
      cipher.update(Buffer.from(body, 'utf8')),
      cipher.final(),
    ]);

    return res.toString('base64');
  }

  private hashSync(message: string): string {
    return (
      createHash(this.hashAlgorithm)
        // updating data
        .update(message)
        // Encoding to be used
        .digest('hex')
    );
  }

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
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterUserResultDto> {
    // judge if you can actually register user
    // decrypt command
    const decryptedUserMessage = await this.commandBus.execute<
      DecryptAsymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptAsymmetricKeyCommand(registerUserDto.encryptedMessage));
    const userMessage: { user: string; passwordHash: string; uuid: string } = {
      user: '',
      passwordHash: '',
      uuid: '',
    };
    const maybeUserMessage: { user: string; password: string; uuid: string } =
      JSON.parse(decryptedUserMessage.result);
    userMessage.user = maybeUserMessage.user;

    // validate user Message here.
    if (userMessage.user !== '' && maybeUserMessage.password !== '') {
      // create password hash
      userMessage.passwordHash = this.hashSync(maybeUserMessage.password);

      const jsonUserMessage: string = JSON.stringify(userMessage);

      // encrypt message for db
      const encryptedDBMessage = await this.commandBus.execute<
        EncryptSymmetricKeyCommand,
        DecryptResultDto
      >(new EncryptSymmetricKeyCommand(jsonUserMessage));

      // encrypt message for user with uuid and returns result
      const encryptedUserMessage = this.encrypt(
        JSON.stringify({ message: 'user authorized' }),
        userMessage.uuid,
      );

      return new RegisterUserResultDto(
        encryptedDBMessage.result,
        encryptedUserMessage,
      );
    }

    throw new RegisterFailException();
  }

  async signWithAuth(
    signWithAuthDto: SignWithAuthDto,
  ): Promise<SignWithAuthResultDto> {
    const decryptedUserMessage = await this.commandBus.execute<
      DecryptAsymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptAsymmetricKeyCommand(signWithAuthDto.encryptedMessage));
    const maybeUserMessage: {
      user: string;
      password: string;
      uuid: string;
      message: string;
    } = JSON.parse(decryptedUserMessage.result);

    const decryptedDBMessage = await this.commandBus.execute<
      DecryptSymmetricKeyCommand,
      DecryptResultDto
    >(new DecryptSymmetricKeyCommand(''));
    const maybeDBMessage: {
      user: string;
      passwordHash: string;
      privateKey: string;
      signatureAlgorithm: string;
    } = JSON.parse(decryptedDBMessage.result);

    const userMessage: {
      user: string;
      passwordHash: string;
      uuid: string;
      message: string;
    } = {
      user: maybeUserMessage.user,
      passwordHash: this.hashSync(maybeUserMessage.password),
      uuid: maybeUserMessage.uuid,
      message: maybeUserMessage.message,
    };

    const dbMessage: {
      user: string;
      passwordHash: string;
      privateKey: string;
      signatureAlgorithm: string;
    } = {
      user: maybeDBMessage.user,
      passwordHash: maybeDBMessage.passwordHash,
      privateKey: maybeDBMessage.privateKey,
      signatureAlgorithm: maybeDBMessage.signatureAlgorithm,
    };

    const isAuthorized =
      userMessage.user &&
      userMessage.user === dbMessage.user &&
      userMessage.passwordHash &&
      userMessage.passwordHash === dbMessage.passwordHash;

    // sign user message with db private key and return result
    if (isAuthorized) {
      // message should be plain 32 byte hashed bytes.
      // private key is normal ecdsa private key.

      if (dbMessage.signatureAlgorithm === 'secp256k1') {
        const signer = new ec(dbMessage.signatureAlgorithm);

        // DER encoding hex string
        const signature: string = signer
          .sign(userMessage.message, dbMessage.privateKey, 'hex', {
            canonical: true,
          })
          .toDER();

        // encrypt message for user with uuid and returns result
        const encryptedMessage = this.encrypt(
          JSON.stringify({ signature, message: 'sign success' }),
          userMessage.uuid,
        );

        return new SignWithAuthResultDto(true, encryptedMessage);
      } else if (dbMessage.signatureAlgorithm === 'ed25519') {
        const signature: string = eddsa
          .sign(userMessage.message, dbMessage.privateKey, 'hex', {
            canonical: true,
          })
          .toDER();

        const encryptedMessage = this.encrypt(
          JSON.stringify({ signature, message: 'algorithm not implemented' }),
          userMessage.uuid,
        );

        return new SignWithAuthResultDto(true, encryptedMessage);
      }

      const encryptedMessage = this.encrypt(
        JSON.stringify({ message: 'unknown algorithm' }),
        userMessage.uuid,
      );

      return new SignWithAuthResultDto(true, encryptedMessage);
    }

    // exception
    throw new SignWithAuthFailException();
  }
}
