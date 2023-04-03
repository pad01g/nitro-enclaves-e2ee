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
import { DecryptResultDto } from '../dtos';

export class DecryptSymmetricKeyCommand implements ICommand {
  public ciphertext: string;

  constructor(ciphertext: string) {
    this.ciphertext = ciphertext;
  }
}

@CommandHandler(DecryptSymmetricKeyCommand)
export class DecryptSymmetricKeyHandler
  implements ICommandHandler<DecryptSymmetricKeyCommand>
{
  async execute(
    command: DecryptSymmetricKeyCommand,
  ): Promise<DecryptResultDto> {
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
      '--ciphertext',
      command.ciphertext,
    ]);
    // decode base64
    const data: string = stdout;

    return new DecryptResultDto(data);
  }
}
