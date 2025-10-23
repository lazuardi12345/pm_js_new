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
} from '@nestjs/common';
import { CA_GetApprovalHistory_UseCase } from '../../Applications/Services/CA_GetApprovalHistory.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('ca/int/loan-apps')
export class CA_GetApprovalHistory_Controller {
  constructor(
    @Inject(CA_GetApprovalHistory_UseCase)
    private readonly getAllApprovalHistoryUseCase: CA_GetApprovalHistory_UseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.CA)
  @Get('/history')
  async getAllLoanApplications(
    @CurrentUser('id') creditAnalystId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      const result = await this.getAllApprovalHistoryUseCase.execute(
        creditAnalystId,
        page,
        pageSize,
        searchQuery,
      );

      return result;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err instanceof Error ? err.message : 'Unexpected error',
            reference: 'APPROVAL_HISTORY_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
