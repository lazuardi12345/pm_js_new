import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { MKT_CreateLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateLoanApplication.usecase';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { CreateLoanApplicationExternalDto } from '../../Applications/DTOS/MKT_CreateLoanApplicationExternal.dto';

@Controller('mkt/ext/loan-apps')
export class MKT_CreateLoanApplicationController {
  constructor(
    private readonly createLoanApplication: MKT_CreateLoanApplicationUseCase,
  ) {}

  @Post('create/:draft_id')
  async submitLoanApp(
    @CurrentUser('id') marketingId: number,
    @Param('draft_id') draftId: string,
    @Body() body: any, // Terima apa saja dulu
  ) {
    try {
      const dto = body.payload;
      const validatedDto = await new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }).transform(dto, {
        type: 'body',
        metatype: CreateLoanApplicationExternalDto,
      });

      return await this.createLoanApplication.execute(
        validatedDto,
        marketingId,
        draftId,
      );
    } catch (error) {
      console.error('Error occurred:', error);
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
