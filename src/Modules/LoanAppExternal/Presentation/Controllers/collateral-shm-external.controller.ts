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
import { CollateralSHMService } from '../../Application/Services/collateral-shm-external.service';
import { CreatePengajuanSHMDto } from '../../Application/DTOS/dto-Collateral-SHM/create-collateral-shm.dto';
import { UpdatePengajuanSHMDto } from '../../Application/DTOS/dto-Collateral-SHM/update-collateral-shm.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-shm-external')
export class CollateralShmExternalController {
  constructor(private readonly CollateralSHMService: CollateralSHMService) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanSHMDto) {
    return this.CollateralSHMService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.CollateralSHMService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.CollateralSHMService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePengajuanSHMDto) {
    return this.CollateralSHMService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.CollateralSHMService.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
