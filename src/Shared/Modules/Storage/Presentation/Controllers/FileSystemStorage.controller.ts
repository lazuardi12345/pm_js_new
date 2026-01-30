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

  //? ============== GET FILES APPROVAL RECOMMENDATION ==============

  @Public()
  @Get('bi-check/:customerId/:customerName/:filename')
  async getFileFromApprovalRecommendation(
    @Param('customerId') customerNIN: string,
    @Param('customerName') customerName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
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
  //? ============== GET FILES APPROVAL RECOMMENDATION ==============

  @Public()
  @Get('survey-photos/:customerId/:preFolderName/:filename')
  async getSurveyPhoto(
    @Param('customerId') customerNIN: string,
    @Param('preFolderName') preFolderName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log(customerNIN, preFolderName, filename);
    try {
      console.log(customerNIN, preFolderName, filename);
      const { buffer, mimetype, originalName } =
        await this.fileStorageService.getSurveyPhoto(
          customerNIN,
          preFolderName,
          filename,
        );

      res.set({
        'Content-Type': mimetype,
        'Content-Disposition': `inline; filename="${originalName}"`,
        'Content-Length': buffer.length,
      });

      return res.send(buffer);
    } catch (err) {
      console.log(err);
    }
  }

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
}
