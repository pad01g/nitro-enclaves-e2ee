import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { execFile } from 'child_process';
import { promisify } from 'util';

import {
  AWS_ACCESS,
  AWS_REGION,
  AWS_SECRET,
  AWS_TOKEN,
  KMS_PROXY_PORT,
} from '../crypto.consts';
import { AsymmetricKeyPairDto } from '../dtos';

export class GenerateKeyPairCommand implements ICommand {}

@CommandHandler(GenerateKeyPairCommand)
export class GenerateKeyPairHandler
  implements ICommandHandler<GenerateKeyPairCommand>
{
  async execute(
    _command: GenerateKeyPairCommand,
  ): Promise<AsymmetricKeyPairDto> {
    // run "/app/kmstool_enclave_cli" shell from
    // `aws-nitro-enclaves-workshop/resources/code/my-first-enclave/cryptographic-attestation/server.py`
    // decryption

    const { stdout } = await promisify(execFile)('/app/kmstool_enclave_cli', [
      '--region',
      AWS_REGION,
      '--proxy-port',
      KMS_PROXY_PORT,
      '--aws-access-key-id',
      AWS_ACCESS,
      '--aws-secret-access-key',
      AWS_SECRET,
      '--aws-session-token',
      AWS_TOKEN,
    ]);
    // decode base64
    const data: string = stdout;

    return new AsymmetricKeyPairDto(data, '');
  }
}
