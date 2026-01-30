// Exception filter untuk handle multer errors
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import multer from 'multer';

@Catch(multer.MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(error: multer.MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Error upload file';
    let statusCode = 400;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File terlalu besar (max 5MB)';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Terlalu banyak file (max 5 files)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Field file tidak sesuai';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Terlalu banyak parts dalam request';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Nama field terlalu panjang';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Nilai field terlalu besar';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Terlalu banyak fields';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
    });
  }
}
