import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

// import type { GenerateKeyPairDto } from '../dtos';

export class GenerateKeyPairCommand implements ICommand {}

@CommandHandler(GenerateKeyPairCommand)
export class GenerateKeyPairHandler
  implements ICommandHandler<GenerateKeyPairCommand>
{
  async execute(_command: GenerateKeyPairCommand) {
    // run "/app/kmstool_enclave_cli" shell from
    // `aws-nitro-enclaves-workshop/resources/code/my-first-enclave/cryptographic-attestation/server.py`
    return null;
  }
}
