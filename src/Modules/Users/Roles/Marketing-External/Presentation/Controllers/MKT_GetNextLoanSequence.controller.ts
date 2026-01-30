import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MKT_GetNextLoanSequenceUseCase } from '../../Applications/Services/MKT_GetNextLoanSequence.usecase';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@Controller('mkt/ext')
export class MKT_GetNextLoanSequenceController {
  constructor(private readonly useCase: MKT_GetNextLoanSequenceUseCase) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get('drafts/next-sequence')
  async getNextDraftSequence(@Query('nik') nik: string) {
    return this.useCase.getNextDraftsPinjamanKe(nik);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get('loan-apps/next-sequence')
  async getNextLoanSequence(@Query('nik') nik: string) {
    return this.useCase.getNextLoanAppsPinjamanKe(nik);
  }
}
