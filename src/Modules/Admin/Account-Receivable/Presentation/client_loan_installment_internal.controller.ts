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
import { ClientLoanInstallmentInternalService } from '../Applications/Services/client_loan_installment_internal.service';
import { CreateClientLoanInstallmentInternalDto } from '../Applications/DTOs/client_loan_installment_internal/create_client_loan_installment_internal.dto';
import { UpdateClientLoanInstallmentInternalDto } from '../Applications/DTOs/client_loan_installment_internal/update_client_loan_installment_internal.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('client-loan-installment-internal')
export class ClientLoanInstallmentInternalController {
  constructor(
    private readonly clientLoanInstallmentInternalService: ClientLoanInstallmentInternalService,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientLoanInstallmentInternalDto) {
    return this.clientLoanInstallmentInternalService.create(dto);
  }

  @Get()
  async findAll() {
    return this.clientLoanInstallmentInternalService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clientLoanInstallmentInternalService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientLoanInstallmentInternalDto,
  ) {
    return this.clientLoanInstallmentInternalService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientLoanInstallmentInternalService.delete(id);
  }
}
