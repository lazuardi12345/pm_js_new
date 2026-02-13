import { NestFactory, Reflector } from '@nestjs/core';

import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MulterExceptionFilter } from './Shared/Modules/Authentication/Infrastructure/Helpers/MulterError.help';

async function bootstrap() {
  process.env.TZ = 'Asia/Jakarta';
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.setGlobalPrefix('', {
    exclude: ['storage/(.*)'],
  });
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  // app.useGlobalFilters(new MulterExceptionFilter());
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://cash-gampang-ui.vercel.app',
        'http://app.local:3000',
        'http://app.local:3002',
        'http://app.local:3001',
        'http://app.local:3004',
        'http://192.182.6.100:3000',
        'http://192.182.6.100:3001',
        'http://192.182.6.100:3002',
        'http://192.182.6.100:3003',
        'http://192.182.6.100:3004',
        'http://admin-portal.local',
        'http://hm-portal.local',
        'http://localhost:3000',
        'http://loan-apps.local',
        'http://loan-apps.local:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Pengajuan Marketing API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(
    `Server Successfully Started at http://localhost:${process.env.PORT}`,
  );
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
});
