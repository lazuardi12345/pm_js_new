import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import multer from 'multer';

// Bisa dipindah ke config/env kalau mau lebih fleksibel
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (dalam bytes)

// Daftar ekstensi berbahaya
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
] as const;

// Optional: tambah MIME type check untuk keamanan ekstra
const dangerousMimeTypes = [
  'application/x-php',
  'application/x-httpd-php',
  'text/x-php',
  'application/javascript',
  'application/x-javascript',
  'application/x-msdownload',
] as const;

export const secureFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const lowerName = file.originalname.toLowerCase();

  // 1. Cek ekstensi berbahaya
  const isDangerousExt = dangerousExts.some((ext) => lowerName.endsWith(ext));
  if (isDangerousExt) {
    return cb(
      new BadRequestException(
        `Ekstensi file tidak diizinkan: ${file.originalname}`,
      ),
    );
  }

  // 2. Optional: Cek MIME type (lebih reliable daripada ekstensi saja)
  if (dangerousMimeTypes.includes(file.mimetype as any)) {
    return cb(
      new BadRequestException(
        `Tipe file berbahaya tidak diizinkan: ${file.mimetype}`,
      ),
    );
  }

  // Kalau lolos semua → accept
  cb(null, true);
};
