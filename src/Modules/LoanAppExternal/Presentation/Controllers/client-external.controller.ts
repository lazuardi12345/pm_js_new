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
import { ClientExternalService } from '../../Application/Services/client-external.service';
import { CreateClientExternalDto } from '../../Application/DTOS/dto-ClientExternal/create-client-external.dto';
import { UpdateClientExternalDto } from '../../Application/DTOS/dto-ClientExternal/update-client-external.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-external')
export class ClientExternalController {
  constructor(private readonly clientExternal: ClientExternalService) {}

  @Post()
  async create(@Body() dto: CreateClientExternalDto) {
    return this.clientExternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.clientExternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.clientExternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateClientExternalDto) {
    return this.clientExternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.clientExternal.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
