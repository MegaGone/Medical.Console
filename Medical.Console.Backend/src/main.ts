import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    })
  );

  const port: number = await config.get<number>("global.port");

  await app.listen(port);
  console.log(`http://localhost:${port}/api/`);
}
bootstrap();
