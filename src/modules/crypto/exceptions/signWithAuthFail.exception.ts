import { BadRequestException } from '@nestjs/common';

export class SignWithAuthFailException extends BadRequestException {
  constructor(error?: string) {
    super('error.signWithAuthFail', error);
  }
}
