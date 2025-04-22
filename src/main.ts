import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter'; 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { Token } from '@auth/entities/token.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Boostrap');
  const port = process.env.APP_PORT ?? 3000;
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors( new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Nest_UP_RESTFUL_API')
    .setDescription('Nest UP Endpoints')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    extraModels: [Token]
  });
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters( new GlobalExceptionFilter);

  
  await app.listen(port);
  logger.log(`App v1 is running on port: ${port}`);
}
bootstrap();
