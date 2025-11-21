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
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageRepository,
} from '../../Domain/Repositories/IFileStorage.repository';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { REQUEST_TYPE } from '../../Infrastructure/Service/Interface/RequestType.interface';

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
      REQUEST_TYPE.INTERNAL,
    );
    return { message: 'Files uploaded successfully', data: result };
  }

  @Public()
  @Post('repeat-order/:customerId/:customerName/:pengajuanIndex')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFilesRepeatOrder(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('pengajuanIndex', ParseIntPipe) pengajuanIndex: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.fileStorageService.saveRepeatOrderFiles(
      customerId,
      customerName,
      pengajuanIndex,
      { files },
    );

    return { message: 'Files uploaded successfully', data: result };
  }

  @Public()
  @Get('bi-check/:customerId/:customerName/:filename')
  async getFileFromApprovalRecommendation(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log('pepek: ', customerId, customerName, filename);
    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFilesForApprovalRecommendations(
        customerId,
        customerName,
        filename,
      );

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Public()
  @Get(':customerId/:customerName/repeat-order-:index/:filename')
  async getFileFromRepeatOrders(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @Param('index', ParseIntPipe) index: number,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFilesForRepeatOrders(
        customerId,
        customerName,
        filename,
        index,
      );

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
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
      REQUEST_TYPE.INTERNAL,
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
    console.log('🎯 ROUTE HIT:', { customerId, customerName, filename }); // ← TAMBAH INI

    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFile(customerId, customerName, filename);

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
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

  @Put(':customerId/:customerName/:filename')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_ktp', maxCount: 1 },
      { name: 'foto_kk', maxCount: 1 },
      { name: 'foto_id_card_penjamin', maxCount: 1 },
      { name: 'foto_ktp_penjamin', maxCount: 1 },
      { name: 'foto_id_card', maxCount: 1 },
      { name: 'bukti_absensi_file', maxCount: 1 },
      { name: 'foto_rekening', maxCount: 1 },
    ]),
  )
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
      REQUEST_TYPE.EXTERNAL,
    );
    return { message: 'File updated successfully', data: result };
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
