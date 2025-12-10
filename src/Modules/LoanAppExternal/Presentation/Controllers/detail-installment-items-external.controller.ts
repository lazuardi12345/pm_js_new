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
import { DetailInstallmentItemsService } from '../../Application/Services/detail-installment-items-external.service';
import { CreateDetailInstallmentItemsDto } from '../../Application/DTOS/dto-Detail-Installment-Items/create-detail-installment-items.dto';
import { UpdateDetailInstallmentItemsDto } from '../../Application/DTOS/dto-Detail-Installment-Items/update-detail-installment-items.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('detail-installment-items')
export class DetailInstallmentItemsExternalController {
  constructor(
    private readonly OtherExistLoansExternalService: DetailInstallmentItemsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateDetailInstallmentItemsDto) {
    return this.OtherExistLoansExternalService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.OtherExistLoansExternalService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.OtherExistLoansExternalService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDetailInstallmentItemsDto,
  ) {
    return this.OtherExistLoansExternalService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.OtherExistLoansExternalService.delete(+id);
  }
}
