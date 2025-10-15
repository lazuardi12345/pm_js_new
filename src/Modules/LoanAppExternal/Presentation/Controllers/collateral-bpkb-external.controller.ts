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
import { CollateralBpkbExternalService } from '../../Application/Services/collateral-bpkb-external.service';
import { CreatePengajuanBPKBDto } from '../../Application/DTOS/dto-Collateral-BPKB/create-collateral-bpkb.dto';
import { UpdatePengajuanBPKBDto } from '../../Application/DTOS/dto-Collateral-BPKB/update-collateral-bpkb.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-bpkp-external')
export class CollateralBpkbExternalController {
  constructor(private readonly CollateralBpkbExternal: CollateralBpkbExternalService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanBPKBDto) {
    return this.CollateralBpkbExternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.CollateralBpkbExternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.CollateralBpkbExternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePengajuanBPKBDto) {
    return this.CollateralBpkbExternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.CollateralBpkbExternal.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
