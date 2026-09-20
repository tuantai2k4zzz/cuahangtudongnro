"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter());
        app.setGlobalPrefix('api/v1');
        app.use((0, cookie_parser_1.default)());
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        app.enableCors({
            origin: [clientUrl, 'http://localhost:3000', 'https://cuahangtudongnro.vercel.app', /\.vercel\.app$/],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-signature'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        const config = new swagger_1.DocumentBuilder()
            .setTitle('TUDONGNROTT.com API Documentation')
            .setDescription('Tài liệu API nền tảng bán và quản lý bản quyền tool game NRO Online')
            .setVersion('1.0')
            .addBearerAuth()
            .addCookieAuth('access_token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            customSiteTitle: 'TUDONGNROTT API Docs',
        });
        await app.init();
        cachedApp = app;
    }
    return cachedApp.getHttpAdapter().getInstance();
}
if (process.env.VERCEL) {
}
else {
    bootstrap().then((expressInstance) => {
        const port = process.env.PORT || 4000;
        const logger = new common_1.Logger('Bootstrap');
        expressInstance.listen(port, () => {
            logger.log(`====================================================`);
            logger.log(`🚀 Server đang chạy tại: http://localhost:${port}/api/v1`);
            logger.log(`📖 Swagger API Docs tại: http://localhost:${port}/api/docs`);
            logger.log(`====================================================`);
        });
    });
}
async function handler(req, res) {
    try {
        const expressApp = await bootstrap();
        return new Promise((resolve, reject) => {
            res.on('finish', resolve);
            res.on('close', resolve);
            res.on('error', reject);
            expressApp(req, res);
        });
    }
    catch (error) {
        console.error('NestJS Bootstrap Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message || String(error) });
    }
}
//# sourceMappingURL=main.js.map