import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RelativeInternalService } from '../../Application/Services/relative-internal.entity';
import { CreateRelativeInternalDto } from '../../Application/DTOS/dto-Relatives/create-relatives-internal.dto';
import { UpdateRelativeInternalDto } from '../../Application/DTOS/dto-Relatives/update-relatives-internal.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('relative-internal')
export class RelativeInternalController {
  constructor(private readonly relativeService: RelativeInternalService) {}

  @Post()
  async create(@Body() dto: CreateRelativeInternalDto) {
    return this.relativeService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.relativeService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.relativeService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateRelativeInternalDto) {
    return this.relativeService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.relativeService.delete(+id);
  }
}
