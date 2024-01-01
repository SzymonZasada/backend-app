import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './common/guards/access_token.guard';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/backend'), DatabaseModule, AuthModule],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule { }
