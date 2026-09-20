import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(),
    );

    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    app.enableCors({
      origin: [clientUrl, 'http://localhost:3000', 'https://cuahangtudongnro.vercel.app', /\.vercel\.app$/],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-signature'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();
    cachedApp = app;
  }
  return cachedApp.getHttpAdapter().getInstance();
}

export default async function (req: any, res: any) {
  try {
    const expressApp = await bootstrap();
    expressApp(req, res);
  } catch (error: any) {
    console.error('NestJS Bootstrap Error:', error);
    res.status(500).json({
      error: 'Vercel API Index Bootstrap Failed',
      message: error.message,
      stack: error.stack
    });
  }
}
