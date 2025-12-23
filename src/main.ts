import { NestFactory, Reflector } from '@nestjs/core';

import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// somewhere in your initialization file

async function bootstrap() {
  process.env.TZ = 'Asia/Jakarta';
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'], // atur level log
  });
  app.setGlobalPrefix('', {
    exclude: ['storage/(.*)'],
  });
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        // 'http://localhost:5173',
        // 'http://localhost:3000',
        // 'http://localhost:5000',
        // 'http://127.0.0.1:5500',
        'http://192.182.6.100:3000',
        'http://192.182.6.100:5173',
        'http://app.local:3000',
        'http://app.local:5000',
        'https://cash-gampang-ui.vercel.app',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // app.use((req, res, next) => {
  //   console.log('aku mah--------------------->');
  //   console.log('Request Origin:', req.headers.origin);
  //   console.log('Request Cookie:', req.headers);
  //   console.log('Response Headers:', res.getHeaders());
  //   next();
  // });

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
