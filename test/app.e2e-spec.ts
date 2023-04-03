import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { GenerateKeyPairHandler } from '../src/modules/crypto/commands';
import { AsymmetricKeyPairDto } from '../src/modules/crypto/dtos';

describe('CryptoController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    GenerateKeyPairHandler.prototype.execute = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new AsymmetricKeyPairDto('', '')),
      );

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // no public key available
  it('/cryptos/getPublicKey (GET)', () =>
    request(app.getHttpServer()).get('/cryptos/getPublicKey').expect(404));

  // create key pair with mock function
  it('/cryptos/generateKeyPair (POST)', () =>
    request(app.getHttpServer())
      .post('/cryptos/generateKeyPair')
      .send({})
      .expect(201));

  afterAll(() => app.close());
});
