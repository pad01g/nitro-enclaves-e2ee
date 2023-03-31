import { BadRequestException } from '@nestjs/common';

export class RegisterFailException extends BadRequestException {
  constructor(error?: string) {
    super('error.registerFail', error);
  }
}
