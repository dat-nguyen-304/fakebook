import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '@handlers/http-exception.filter';
import { ResponseInterceptor } from '@handlers/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: 'http://localhost',
    credentials: true
  });
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
