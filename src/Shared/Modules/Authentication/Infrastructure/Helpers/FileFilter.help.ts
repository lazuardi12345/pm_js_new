import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import multer from 'multer';

const dangerousExts = [
  '.php',
  '.phtml',
  '.php3',
  '.php4',
  '.php5',
  '.phar',
  '.js',
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.dll',
  '.msi',
  '.com',
  '.scr',
  '.vbs',
  '.jar',
] as const;

const dangerousMimeTypes = [
  'application/x-php',
  'application/x-httpd-php',
  'text/x-php',
  'application/javascript',
  'application/x-javascript',
  'application/x-msdownload',
  'application/x-sh',
  'application/x-executable',
] as const;

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const secureFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  try {
    const fileName = file.originalname;
    const lowerName = fileName.toLowerCase();

    if (fileName.length > 255) {
      return cb(
        new BadRequestException('Nama file terlalu panjang (max 255 karakter)'),
      );
    }

    const dangerousChars = /[<>:"|?*\x00-\x1f\\]/;
    if (dangerousChars.test(fileName)) {
      return cb(
        new BadRequestException('Nama file mengandung karakter tidak valid'),
      );
    }

    if (fileName.includes('..') || fileName.includes('/')) {
      return cb(new BadRequestException('Path traversal tidak diizinkan'));
    }

    if (fileName.indexOf('\0') !== -1) {
      return cb(new BadRequestException('Null byte tidak diizinkan'));
    }

    // 5. Validasi file HARUS punya ekstensi
    const lastDotIndex = fileName.lastIndexOf('.');
    if (
      lastDotIndex === -1 ||
      lastDotIndex === 0 ||
      lastDotIndex === fileName.length - 1
    ) {
      return cb(
        new BadRequestException('File harus memiliki ekstensi yang valid'),
      );
    }

    // 6. Get extension
    const fileExt = fileName.substring(lastDotIndex).toLowerCase();

    const afterLastDot = fileName.substring(lastDotIndex + 1);
    const hasMultipleDots = afterLastDot.includes('.');

    if (hasMultipleDots) {
      return cb(new BadRequestException('Multiple ekstensi tidak diizinkan'));
    }

    // 8. Cek ekstensi berbahaya (di seluruh filename untuk catch hidden)
    const hasDangerousExt = dangerousExts.some((ext) =>
      lowerName.includes(ext),
    );
    if (hasDangerousExt) {
      return cb(
        new BadRequestException(`Ekstensi berbahaya terdeteksi: ${fileName}`),
      );
    }

    // 9. Whitelist ekstensi
    const allowedExts = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.pdf',
      '.doc',
      '.docx',
    ];
    if (!allowedExts.includes(fileExt)) {
      return cb(
        new BadRequestException(
          `Hanya ekstensi ${allowedExts.join(', ')} yang diizinkan`,
        ),
      );
    }

    // 10. Validasi MIME type (blacklist)
    if (dangerousMimeTypes.includes(file.mimetype as any)) {
      return cb(
        new BadRequestException(`Tipe file berbahaya: ${file.mimetype}`),
      );
    }

    // 11. Whitelist MIME type
    if (!allowedMimeTypes.includes(file.mimetype as any)) {
      return cb(
        new BadRequestException(`Tipe file tidak diizinkan: ${file.mimetype}`),
      );
    }

    cb(null, true);
  } catch (error) {
    return cb(new BadRequestException('Error validasi file'));
  }
};

export const uploadLimits = {
  fileSize: 5 * 1024 * 1024,
  files: 20,
  fields: 100,
  fieldSize: 10 * 1024,
  fieldNameSize: 100,
  headerPairs: 2000,
  parts: 150,
};
