import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LoanApplicationInternalService } from '../../Application/Services/loan-app-internal.service';
import { CreateLoanApplicationInternalDto } from '../../Application/DTOS/dto-LoanApp/create-loan-application.dto';
import { UpdateLoanAplicationInternalDto } from '../../Application/DTOS/dto-LoanApp/update-loan-application.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loan-application-internal')
export class LoanApplicationInternalController {
  constructor(private readonly loanApplicationService: LoanApplicationInternalService) {}

  @Post()
  async create(@Body() dto: CreateLoanApplicationInternalDto) {
    return this.loanApplicationService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.loanApplicationService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.loanApplicationService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateLoanAplicationInternalDto) {
    return this.loanApplicationService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.loanApplicationService.delete(+id);
  }
}
