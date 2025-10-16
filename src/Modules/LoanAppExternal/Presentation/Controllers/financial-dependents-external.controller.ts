import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FinancialDependentsExternalService } from '../../Application/Services/financial-dependents-external.service';
import { CreateFinancialDependentsDto } from '../../Application/DTOS/dto-Financial-Dependents/create-financial-dependents.dto';
import { UpdateFinancialDependentsDto } from '../../Application/DTOS/dto-Financial-Dependents/update-financial-dependents.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial-dependents-external')
export class FinancialDependentsExternalController {
  constructor(private readonly financialdependentsexternal: FinancialDependentsExternalService) {}

  @Post()
  async create(@Body() dto: CreateFinancialDependentsDto) {
    return this.financialdependentsexternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.financialdependentsexternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.financialdependentsexternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFinancialDependentsDto) {
    return this.financialdependentsexternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.financialdependentsexternal.delete(+id);
  }
}
