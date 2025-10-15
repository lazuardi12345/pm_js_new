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
import { CollateralByBpjsExternalService } from '../../Application/Services/collateral-bpjs-external.service';
import { CreatePengajuanBPJSDto } from '../../Application/DTOS/dto-Collateral-BPJS/create-collateral-bpjs.dto';
import { UpdatePengajuanBPJSDto } from '../../Application/DTOS/dto-Collateral-BPJS/update-collateral-bpjs.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bpjs-external')
export class ColleteralBpjsExternalController {
  constructor(private readonly ColleteralBpjsExternal: CollateralByBpjsExternalService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanBPJSDto) {
    return this.ColleteralBpjsExternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.ColleteralBpjsExternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.ColleteralBpjsExternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePengajuanBPJSDto) {
    return this.ColleteralBpjsExternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.ColleteralBpjsExternal.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
