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
import { ClientExternalProfileService } from '../../Application/Services/client-external-profile.service';
import { CreateClientExternalProfileDto } from '../../Application/DTOS/dto-ClientExternalProfile/create-client-external-profile.dto';
import { UpdateClientExternalProfileDto } from '../../Application/DTOS/dto-ClientExternalProfile/update-client-external-profile.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-external')
export class ClientExternalProfileController {
  constructor(private readonly clientExternal: ClientExternalProfileService) {}

  @Post()
  async create(@Body() dto: CreateClientExternalProfileDto) {
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
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientExternalProfileDto,
  ) {
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
