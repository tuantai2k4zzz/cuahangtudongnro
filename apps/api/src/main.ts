import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(),
    );

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Cookie parser
    app.use(cookieParser());

    // CORS configuration
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    app.enableCors({
      origin: [clientUrl, 'http://localhost:3000', 'https://cuahangtudongnro.vercel.app', /\.vercel\.app$/],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-signature'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global response interceptor & exception filter
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    // Swagger API Documentation
    const config = new DocumentBuilder()
      .setTitle('TUDONGNROTT.com API Documentation')
      .setDescription('Tài liệu API nền tảng bán và quản lý bản quyền tool game NRO Online')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('access_token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'TUDONGNROTT API Docs',
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp.getHttpAdapter().getInstance();
}

// Nếu chạy trên Vercel Serverless
if (process.env.VERCEL) {
  // Bỏ qua listen port khi ở trên Vercel
  // Vercel Serverless Function sẽ tự động import handler bên dưới
} else {
  // Chạy listen port như bình thường ở môi trường dev/local/VPS
  bootstrap().then((expressInstance) => {
    const port = process.env.PORT || 4000;
    const logger = new Logger('Bootstrap');
    
    expressInstance.listen(port, () => {
      logger.log(`====================================================`);
      logger.log(`🚀 Server đang chạy tại: http://localhost:${port}/api/v1`);
      logger.log(`📖 Swagger API Docs tại: http://localhost:${port}/api/docs`);
      logger.log(`====================================================`);
    });
  });
}

// Export handler cho Vercel Node.js Builder
export default async function handler(req: any, res: any) {
  try {
    const expressApp = await bootstrap();
    expressApp(req, res);
  } catch (error: any) {
    console.error('NestJS Bootstrap Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message || String(error) });
  }
}
