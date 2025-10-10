import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FamilyInternalService } from '../../Application/Services/family-internal.service';
import { CreateFamilyDto } from '../../Application/DTOS/dto-Family/create-family-internal.dto';
import { UpdateFamilyDto } from '../../Application/DTOS/dto-Family/update-family-internal.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('family-internal')
export class FamilyInternalController {
  constructor(private readonly familyService: FamilyInternalService) {}

  @Post()
  async create(@Body() dto: CreateFamilyDto) {
    return this.familyService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.familyService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.familyService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFamilyDto) {
    return this.familyService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.familyService.delete(+id);
  }
}
