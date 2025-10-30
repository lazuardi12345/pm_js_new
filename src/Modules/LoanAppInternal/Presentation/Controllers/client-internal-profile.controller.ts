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
import { ClientInternalProfileService } from '../../Application/Services/client-internal-profile.service';
import { CreateClientInternalProfileDto } from '../../Application/DTOS/dto-ClientInternalProfile/create-client-internal-profile.dto';
import { UpdateClientInternalProfileDto } from '../../Application/DTOS/dto-ClientInternalProfile/update-client-internal-profile.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-internal-profile')
export class ClientInternalProfileController {
  constructor(private readonly clientInternal: ClientInternalProfileService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateClientInternalProfileDto) {
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
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientInternalProfileDto,
  ) {
    return this.clientInternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.clientInternal.delete(+id);

    return {
      eror: ' Fasle',
      message: 'data keapus oi',
    };
  }
}
