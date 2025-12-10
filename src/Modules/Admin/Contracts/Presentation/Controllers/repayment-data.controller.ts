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
import { RepaymentDataService } from '../../Applications/Services/repayment-data-external.service';
import { CreateRepaymentDataDto } from '../../Applications/DTOS/dto-Repayment-Data/create-repayment-data.dto';
import { UpdateRepaymentDataDto } from '../../Applications/DTOS/dto-Repayment-Data/update-repayment-data.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('repayment-data')
export class RepaymentDataController {
  constructor(private readonly repaymentDataService: RepaymentDataService) {}

  @Post()
  async create(@Body() dto: CreateRepaymentDataDto) {
    return this.repaymentDataService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.repaymentDataService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateRepaymentDataDto) {
    return this.repaymentDataService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.repaymentDataService.delete(+id);
  }
}
