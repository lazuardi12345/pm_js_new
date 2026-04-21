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
import { ClientInstallmentFrequencyService } from '../Applications/Services/client_loan_installment_frequency.service';
import { CreateClientInstallmentFrequencyDto } from '../Applications/DTOs/client_loan_installment_frequency/create_client_loan_installment_frequency.entity';
import { UpdateClientInstallmentFrequencyDto } from '../Applications/DTOs/client_loan_installment_frequency/update_client_loan_installment_frequency.entity';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('client-installment-frequency')
export class ClientInstallmentFrequencyController {
  constructor(
    private readonly clientInstallmentFrequencyService: ClientInstallmentFrequencyService,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientInstallmentFrequencyDto) {
    return this.clientInstallmentFrequencyService.create(dto);
  }

  @Get()
  async findAll() {
    return this.clientInstallmentFrequencyService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.clientInstallmentFrequencyService.findById(id);
  }

  @Get('client/:clientId')
  async findByClientId(@Param('clientId') clientId: string) {
    return this.clientInstallmentFrequencyService.findByClientId(clientId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientInstallmentFrequencyDto,
  ) {
    return this.clientInstallmentFrequencyService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientInstallmentFrequencyService.delete(id);
  }
}
