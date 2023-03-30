import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CryptoService } from './crypto.service';
import {
  GenerateKeyPairDto,
  GenerateSymmetricKeyDto,
  // GetPublicKeyDto,
  PublicKeyDto,
  RegisterUserDto,
  RegisterUserResultDto,
  SignWithAuthDto,
  SignWithAuthResultDto,
} from './dtos';

@Controller('cryptos')
@ApiTags('cryptos')
export class CryptoController {
  constructor(private cryptoService: CryptoService) {}

  @Post('/generateKeyPair')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PublicKeyDto })
  async generateKeyPair(@Body() _generateKeyPairDto: GenerateKeyPairDto) {
    const publicKey: PublicKeyDto = await this.cryptoService.generateKeyPair();

    return publicKey;
  }

  @Get('/getPublicKey')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PublicKeyDto })
  async getPublicKey() {
    const publicKey: PublicKeyDto = await this.cryptoService.getPublicKey();

    return publicKey;
  }

  @Post('/generateSymmetricKey')
  @HttpCode(HttpStatus.CREATED)
  async generateSymmetricKey(
    @Body() _generateSymmetricKeyDto: GenerateSymmetricKeyDto,
  ) {
    await this.cryptoService.generateSymmetricKey();
  }

  @Get('/checkSymmetricKey')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PublicKeyDto })
  async checkSymmetricKey() {
    const isKeyAvailable: boolean =
      await this.cryptoService.checkSymmetricKey();

    return isKeyAvailable;
  }

  @Post('/registerUser')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RegisterUserResultDto })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.cryptoService.registerUser(registerUserDto);
  }

  @Post('/signWithAuth')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignWithAuthResultDto })
  async signWithAuth(@Body() signWithAuthDto: SignWithAuthDto) {
    return this.cryptoService.signWithAuth(signWithAuthDto);
  }
}
