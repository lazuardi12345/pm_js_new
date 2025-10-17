import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Inject,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageRepository,
} from '../../Domain/Repositories/IFileStorage.repository';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Controller('storage')
export class FileStorageController {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageRepository,
  ) {}

  @Public()
  @Post(':customerId/:customerName')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.fileStorageService.saveFiles(
      customerId,
      customerName,
      { files },
      false,
    );
    return { message: 'Files uploaded successfully', data: result };
  }

  @Public()
  @Get(':customerId/:customerName')
  async listFiles(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
  ) {
    const files = await this.fileStorageService.listFiles(
      customerId,
      customerName,
      false,
    );
    return { files };
  }

  @Public()
  @Get(':customerId/:customerName/:filename')
  async getFile(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFile(customerId, customerName, filename);

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Put(':customerId/:customerName/:filename')
  @UseInterceptors(FilesInterceptor('file'))
  async updateFile(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.fileStorageService.updateFile(
      customerId,
      customerName,
      filename,
      files[0],
      false,
    );
    return { message: 'File updated successfully', data: result };
  }

  @Public()
  @Put('change-directory/:customerId/:oldCustomerName/:newCustomerName')
  async updateFileDirectory(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('oldCustomerName') oldCustomerName: string,
    @Param('newCustomerName') newCustomerName: string,
    // @Param('filename') filename: string,
  ) {
    const result = await this.fileStorageService.updateFileDirectory(
      customerId,
      oldCustomerName,
      newCustomerName,
    );
    return { message: 'Folder renamed successfully', data: result };
  }

  @Public()
  @Delete('delete-file/:customerId/:customerName/:filename')
  async deleteFile(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
  ) {
    await this.fileStorageService.deleteFile(
      customerId,
      customerName,
      filename,
    );
    return { message: 'File deleted successfully' };
  }

  @Delete(':customerId/:customerName')
  async deleteAllFiles(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
  ) {
    await this.fileStorageService.deleteCustomerFiles(customerId, customerName);
    return { message: 'All files deleted successfully' };
  }
}
