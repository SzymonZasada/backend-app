import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: { "message": 'Too many requests', "statusCode": 403, }
  }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.setGlobalPrefix('rest');
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}

bootstrap();
