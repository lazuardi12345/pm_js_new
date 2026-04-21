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
import { ClientLoanInstallmentDetailService } from '../Applications/Services/client_loan_installment_detail.service';
import { CreateClientLoanInstallmentDetailDto } from '../Applications/DTOs/client_loan_installment_detail/create_client_loan_installment_detail.dto';
import { UpdateClientLoanInstallmentDetailDto } from '../Applications/DTOs/client_loan_installment_detail/update_client_loan_installment_detail.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('client-loan-installment-detail')
export class ClientLoanInstallmentDetailController {
  constructor(
    private readonly clientLoanInstallmentDetailService: ClientLoanInstallmentDetailService,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientLoanInstallmentDetailDto) {
    return this.clientLoanInstallmentDetailService.create(dto);
  }

  @Get()
  async findAll() {
    return this.clientLoanInstallmentDetailService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clientLoanInstallmentDetailService.findById(id);
  }

  @Get('installment/:installmentId')
  async findByInstallmentId(@Param('installmentId') installmentId: string) {
    return this.clientLoanInstallmentDetailService.findByInstallmentId(
      installmentId,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientLoanInstallmentDetailDto,
  ) {
    return this.clientLoanInstallmentDetailService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientLoanInstallmentDetailService.delete(id);
  }
}
