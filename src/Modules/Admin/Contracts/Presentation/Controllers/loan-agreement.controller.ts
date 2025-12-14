import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LoanAgreementService } from '../../Applications/Services/loan-agreements.service';
import { CreateLoanAgreementDto } from '../../Applications/DTOS/dto-Loan-Agreement/create-loan-agreement.dto';
import { UpdateLoanAgreementDto } from '../../Applications/DTOS/dto-Loan-Agreement/update-loan-agreement.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('loan-agreement')
export class loanAgreementController {
  constructor(private readonly loanAgreementService: LoanAgreementService) {}

  @Post()
  async create(@Body() dto: CreateLoanAgreementDto) {
    return this.loanAgreementService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.loanAgreementService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateLoanAgreementDto) {
    return this.loanAgreementService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.loanAgreementService.delete(+id);
  }
}
