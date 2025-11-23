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
  BadRequestException,
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
import { mapTypeToRequestType } from '../../Infrastructure/Service/helper/Func_MapRequestType.help';

@Controller('storage')
export class FileStorageController {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageRepository,
  ) {}

  //? ============== UPLOAD FILES (NON-RO) ==============
  @Public()
  @Post('upload/:type/:customerId/:customerName')
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
  async uploadFiles(
    @Param('type') type: string,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('customerName') customerName: string,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const requestType = mapTypeToRequestType(type);

    const result = await this.fileStorageService.saveFiles(
      customerId,
      customerName,
      files,
      requestType,
    );

    return {
      message: 'Files uploaded successfully',
      data: result,
    };
  }
  //? =======================================================

  //? ============== UPLOAD FILES REPEAT ORDER ==============
  @Public()
  @Post('upload/:type/:customerId/:customerName/repeat-order')
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
  async uploadFilesRepeatOrder(
    @Param('type') type: string,
    @Param('customerId') customerNIN: number,
    @Param('customerName') customerName: string,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    const requestType = mapTypeToRequestType(type);

    const result = await this.fileStorageService.saveRepeatOrderFiles(
      customerNIN,
      customerName,
      files,
      requestType,
    );

    return {
      message: 'Repeat order files uploaded successfully',
      data: result,
    };
  }
  //? =======================================================

  //? ============== GET FILE (NON-RO) =====================
  @Public()
  @Get(':type/:encryptedPrefix/:filename')
  async getFile(
    @Param('type') type: string,
    @Param('encryptedPrefix') encryptedPrefix: string, // vw761-iS7jk8
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const requestType = mapTypeToRequestType(type);

    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFile(
        encryptedPrefix,
        filename,
        requestType,
      );

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
  //? =======================================================

  //? ============== GET FILE REPEAT ORDER ==============
  @Public()
  @Get(':type/:encryptedPrefix/:roFolder/:filename')
  async getFileRepeatOrder(
    @Param('type') type: string,
    @Param('encryptedPrefix') encryptedPrefix: string, // vw761-iS7jk8
    @Param('roFolder') roFolder: string, // ro-GH871S
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const requestType = mapTypeToRequestType(type);

    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFile(
        encryptedPrefix,
        filename,
        requestType,
        roFolder,
      );

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
  //? =======================================================

  @Public()
  @Get('bi-check/:customerId/:customerName/:filename')
  async getFileFromApprovalRecommendation(
    @Param('customerId') customerNIN: string,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log('pepek: ', customerNIN, customerName, filename);
    const { buffer, mimetype, originalName } =
      await this.fileStorageService.getFilesForApprovalRecommendations(
        customerNIN,
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

  //   @Public()
  //   @Get(':customerId/:customerName/repeat-order-:index/:filename')
  //   async getFileFromRepeatOrders(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('customerName') customerName: string,
  //     @Param('index', ParseIntPipe) index: number,
  //     @Param('filename') filename: string,
  //     @Res() res: Response,
  //   ) {
  //     const { buffer, mimetype, originalName } =
  //       await this.fileStorageService.getFilesForRepeatOrders(
  //         customerNIN,
  //         customerName,
  //         filename,
  //         index,
  //       );

  //     res.set({
  //       'Content-Type': mimetype,
  //       'Content-Disposition': `inline; filename="${originalName}"`,
  //       'Content-Length': buffer.length,
  //     });

  //     res.send(buffer);
  //   }

  //   @Public()
  //   @Get(':customerId/:customerName')
  //   async listFiles(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('customerName') customerName: string,
  //   ) {
  //     const files = await this.fileStorageService.listFiles(
  //       customerNIN,
  //       customerName,
  //       REQUEST_TYPE.INTERNAL,
  //     );
  //     return { files };
  //   }

  //   // ! =====================================================================
  //   @Public()
  //   @Put('change-directory/:customerId/:oldCustomerName/:newCustomerName')
  //   async updateFileDirectory(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('oldCustomerName') oldCustomerName: string,
  //     @Param('newCustomerName') newCustomerName: string,
  //     // @Param('filename') filename: string,
  //   ) {
  //     const result = await this.fileStorageService.updateFileDirectory(
  //       customerNIN,
  //       oldCustomerName,
  //       newCustomerName,
  //     );
  //     return { message: 'Folder renamed successfully', data: result };
  //   }

  //   @Put(':customerId/:customerName/:filename')
  //   @UseInterceptors(
  //     FileFieldsInterceptor([
  //       { name: 'foto_ktp', maxCount: 1 },
  //       { name: 'foto_kk', maxCount: 1 },
  //       { name: 'foto_id_card_penjamin', maxCount: 1 },
  //       { name: 'foto_ktp_penjamin', maxCount: 1 },
  //       { name: 'foto_id_card', maxCount: 1 },
  //       { name: 'bukti_absensi_file', maxCount: 1 },
  //       { name: 'foto_rekening', maxCount: 1 },
  //     ]),
  //   )
  //   async updateFile(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('customerName') customerName: string,
  //     @Param('filename') filename: string,
  //     @UploadedFiles() files: Express.Multer.File[],
  //   ) {
  //     const result = await this.fileStorageService.updateFile(
  //       customerNIN,
  //       customerName,
  //       filename,
  //       files[0],
  //       REQUEST_TYPE.EXTERNAL,
  //     );
  //     return { message: 'File updated successfully', data: result };
  //   }

  //   @Public()
  //   @Delete('delete-file/:customerId/:customerName/:filename')
  //   async deleteFile(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('customerName') customerName: string,
  //     @Param('filename') filename: string,
  //   ) {
  //     await this.fileStorageService.deleteFile(
  //       customerNIN,
  //       customerName,
  //       filename,
  //     );
  //     return { message: 'File deleted successfully' };
  //   }

  //   @Delete(':customerId/:customerName')
  //   async deleteAllFiles(
  //     @Param('customerId', ParseIntPipe) customerId: number,
  //     @Param('customerName') customerName: string,
  //   ) {
  //     await this.fileStorageService.deleteCustomerFiles(
  //       customerNIN,
  //       customerName,
  //     );
  //     return { message: 'All files deleted successfully' };
  //   }
}
