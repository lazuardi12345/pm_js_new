import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClientInternalService } from '../../Application/Services/client-internal.service';
import { CreateClientInternalDto } from '../../Application/DTOS/dto-ClientInternal/create-client-internal.dto';
import { UpdateClientInternalDto } from '../../Application/DTOS/dto-ClientInternal/update-client-internal.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-internal')
export class ClientInternalController {
  constructor(private readonly clientInternal: ClientInternalService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateClientInternalDto) {
    return this.clientInternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.clientInternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.clientInternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateClientInternalDto) {
    return this.clientInternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.clientInternal.delete(+id);

    return {
      eror: " Fasle",
      message: "data keapus oi"
    }
  }
}
