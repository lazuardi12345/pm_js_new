import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationDto } from '../../Applications/DTOS/LoanAppInternal/NotifLoanAppInternal.dto';
import { CreateNotifLoanApplicationUseCase } from '../../Applications/Service/CreateNotifLoanApplication.usecase';

import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotifLoanAppInternal_Controller {
  constructor(
    private readonly createNotifLoanAppUseCase: CreateNotifLoanApplicationUseCase,
  ) {}

  @Post('add')
  async createDraft(
    @CurrentUser('id') marketingId: number,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.createNotifLoanAppUseCase.executeCreateNotif(marketingId, dto);
  }

  // @Public()
  @Get()
  async getDraftByMarketingId(@CurrentUser('id') marketingId: number) {
    return this.createNotifLoanAppUseCase.renderDraftByMarketingId(marketingId);
  }

//   @Delete('delete/:id')
//   // async (@CurrentUser('id') Id: number) {
//   async softDelete(@Param('id') Id: string) {
//     return this.createNotifLoanAppUseCase.deleteDraftByMarketingId(Id);
//   }

  @Patch('update/:id')
  async updateDraftById(
    @Param('id') Id: string,
    @Body() updateData: Partial<CreateNotificationDto>,
  ) {
    return this.createNotifLoanAppUseCase.updateDraftById(Id, updateData);
  }
}
