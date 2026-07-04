import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Booknote API')
    .setDescription('Backend API for tracking read books and user libraries.')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('accessToken', { type: 'apiKey' }, 'accessToken')
    .addCookieAuth('refreshToken', { type: 'apiKey' }, 'refreshToken')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(8000);
}

void bootstrap();
