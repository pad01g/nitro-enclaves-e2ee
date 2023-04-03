import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { execFile } from 'child_process';
import { promisify } from 'util';

import { SignResultDto } from '../dtos';

export class SignMessageCommand implements ICommand {
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

@CommandHandler(SignMessageCommand)
export class SignMessageHandler implements ICommandHandler<SignMessageCommand> {
  async execute(_command: SignMessageCommand): Promise<SignResultDto> {
    // run "/app/kmstool_enclave_cli" shell from
    // `aws-nitro-enclaves-workshop/resources/code/my-first-enclave/cryptographic-attestation/server.py`
    const region = '';
    const KMS_PROXY_PORT = '';
    const access = '';
    const secret = '';
    const token = '';
    const ciphertext = '';
    // decryption
    const { stdout } = await promisify(execFile)('/app/kmstool_enclave_cli', [
      '--region',
      region,
      '--proxy-port',
      KMS_PROXY_PORT,
      '--aws-access-key-id',
      access,
      '--aws-secret-access-key',
      secret,
      '--aws-session-token',
      token,
      '--ciphertext',
      ciphertext,
    ]);
    // decode base64
    const data: string = stdout;

    return new SignResultDto(data);
  }
}
