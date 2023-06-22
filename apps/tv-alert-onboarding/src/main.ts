import { NestFactory } from '@nestjs/core';
import { TvAlertOnboardingModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TvAlertOnboardingModule);

  const options = new DocumentBuilder().build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
