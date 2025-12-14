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
import { VouchersService } from '../../Applications/Services/vouchers.service';
import { CreateVoucherDto } from '../../Applications/DTOS/dto-Vouchers/create-voucher.dto';
import { UpdateVoucherDto } from '../../Applications/DTOS/dto-Vouchers/update-voucher.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly voucherService: VouchersService) {}

  @Post()
  async create(@Body() dto: CreateVoucherDto) {
    return this.voucherService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.voucherService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateVoucherDto) {
    return this.voucherService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.voucherService.delete(+id);
  }
}
