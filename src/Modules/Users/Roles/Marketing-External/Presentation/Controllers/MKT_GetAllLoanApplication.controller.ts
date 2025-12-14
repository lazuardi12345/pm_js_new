import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  Param,
} from '@nestjs/common';
import { MKT_GetAllLoanApplicationUseCase } from '../../Applications/Services/MKT_GetAllLoanApplication.usecase';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';

@Controller('mkt/ext/loan-apps')
export class MKT_GetAllLoanApplicationController {
  constructor(
    @Inject(MKT_GetAllLoanApplicationUseCase)
    private readonly getAllLoanAppUseCase: MKT_GetAllLoanApplicationUseCase,
  ) {}

  // @Public()
  @UseGuards(RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get(':paymentType')
  async getAllLoanApplications(
    @CurrentUser('id') marketingId: number,
    @Param('paymentType') paymentType: JenisPembiayaanEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    try {
      const result = await this.getAllLoanAppUseCase.execute(
        marketingId,
        page,
        pageSize,
        paymentType,
      );

      return {
        payload: {
          error: false,
          message: 'MKT all loan application retrieved successfully',
          reference: 'MKT_LOAN_APPLICATIONS_RETRIEVE_OK',
          data: {
            results: result.data,
            page,
            pageSize,
            total: result.total,
          },
        },
      };
    } catch (err) {
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err instanceof Error ? err.message : 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
