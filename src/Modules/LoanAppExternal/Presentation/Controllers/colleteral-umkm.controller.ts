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
import { CollateralUMKMService } from '../../Application/Services/collateral-umkm.service';
import { CreatePengajuanUmkmDto } from '../../Application/DTOS/dto-Collateral-UMKM/create-collateral-umkm.dto';
import { UpdatePengajuanUmkmDto } from '../../Application/DTOS/dto-Collateral-UMKM/update-collateral-umkm.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-umkm-external')
export class CollateralUmkmExternalController {
  constructor(private readonly collateralUMKMService: CollateralUMKMService) {}
    
  // ========== CREATE ==========
  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanUmkmDto ) {
    return this.collateralUMKMService.create(dto);
  }

  // ========== GET BY ID ==========
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.collateralUMKMService.findById(+id);
  }

//   // ========== GET BY PENGAJUAN ID ==========
//   @Get('pengajuan/:pengajuanId')
//   async findByPengajuanId(@Param('pengajuanId') pengajuanId: number) {
//     return this.collateralUMKMService.findByPengajuanId(+pengajuanId);
//   }

  // ========== GET ALL ==========
  @Get()
  async findAll() {
    return this.collateralUMKMService.findAll();
  }

  // ========== UPDATE ==========
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePengajuanUmkmDto) {
    return this.collateralUMKMService.update(+id, dto);
  }

  // ========== DELETE ==========
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.collateralUMKMService.delete(+id);

    return {
      error: false,
      message: 'Data Collateral UMKM berhasil dihapus',
    };
  }
}
