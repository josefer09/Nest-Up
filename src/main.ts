import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Boostrap');
  const port = process.env.APP_PORT ?? 3000;
  app.setGlobalPrefix('api/v1');

  
  await app.listen(port);
  logger.log(`App v1 is running on port: ${port}`);
}
bootstrap();
