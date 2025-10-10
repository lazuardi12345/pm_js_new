import { Module } from '@nestjs/common';
import { MinioFileStorageService } from './Infrastructure/Service/ObjectStorageServer.service';
import { FILE_STORAGE_SERVICE } from './Domain/Repositories/IFileStorage.repository';
import { FileStorageController } from './Presentation/Controllers/FileSystemStorage.controller';

@Module({
  controllers: [FileStorageController],
  providers: [
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: MinioFileStorageService,
    },
  ],
  exports: [FILE_STORAGE_SERVICE],
})
export class FileSystemStorageModules {}
