import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CryptoModule } from './modules/crypto/crypto.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CryptoModule,
    SharedModule,
    HealthCheckerModule,
  ],
  providers: [],
})
export class AppModule {}
