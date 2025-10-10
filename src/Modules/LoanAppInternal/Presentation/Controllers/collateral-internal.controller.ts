import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CollateralInternalService } from '../../Application/Services/collateral-internal.service';
import { CreateCollateralDto } from '../../Application/DTOS/dto-Collateral/create-collateral-internal.dto';
import { UpdateCollateralDto } from '../../Application/DTOS/dto-Collateral/update-collateral-internal.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-internal')
export class CollateralInternalController {
  constructor(private readonly collateralService: CollateralInternalService) {}

  @Post()
  async create(@Body() dto: CreateCollateralDto) {
    return this.collateralService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.collateralService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.collateralService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateCollateralDto) {
    return this.collateralService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.collateralService.delete(+id);
  }
}
