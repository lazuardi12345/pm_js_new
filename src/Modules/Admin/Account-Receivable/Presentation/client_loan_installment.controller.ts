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
import { ClientLoanInstallmentService } from '../Applications/Services/client_loan_installment.service';
import { CreateClientLoanInstallmentDto } from '../Applications/DTOs/client_loan_installment/create_client_loan_installment.dto';
import { UpdateClientLoanInstallmentDto } from '../Applications/DTOs/client_loan_installment/update_client_loan_installment.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('client-loan-installment')
export class ClientLoanInstallmentController {
  constructor(
    private readonly clientLoanInstallmentService: ClientLoanInstallmentService,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientLoanInstallmentDto) {
    return this.clientLoanInstallmentService.create(dto);
  }

  @Get()
  async findAll() {
    return this.clientLoanInstallmentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clientLoanInstallmentService.findById(id);
  }

  @Get('frequency/:frequencyId')
  async findByFrequencyId(@Param('frequencyId') frequencyId: string) {
    return this.clientLoanInstallmentService.findByFrequencyId(frequencyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientLoanInstallmentDto,
  ) {
    return this.clientLoanInstallmentService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientLoanInstallmentService.delete(id);
  }
}
