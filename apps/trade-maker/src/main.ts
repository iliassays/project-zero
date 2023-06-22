import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TradeMakerModule } from './trade-maker.module';

async function bootstrap() {
  const app = await NestFactory.create(TradeMakerModule);

  const options = new DocumentBuilder().build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
