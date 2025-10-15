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







import { CollateralKedinasanExternalService } from '../../Application/Services/collateral-kedinasan-external.service';
import { CreatePengajuanKedinasanDto } from '../../Application/DTOS/dto-Collateral-Kedinasan/create-collateral-kedinasan.dto';
import { UpdatePengajuanKedinasanDto } from '../../Application/DTOS/dto-Collateral-Kedinasan/update-collateral-kedinasan.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-kedinasan-external')
export class CollateralKedinasanExternalController {
  constructor(private readonly CollateralKedinasanExternal: CollateralKedinasanExternalService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanKedinasanDto) {
    return this.CollateralKedinasanExternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.CollateralKedinasanExternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.CollateralKedinasanExternal.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePengajuanKedinasanDto) {
    return this.CollateralKedinasanExternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.CollateralKedinasanExternal.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
