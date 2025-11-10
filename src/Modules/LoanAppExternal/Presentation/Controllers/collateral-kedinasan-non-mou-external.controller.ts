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
import { CollateralKedinasan_NonMOU_ExternalService } from '../../Application/Services/collateral-kedinasan-non-mou-external.service';
import { CreatePengajuanKedinasan_Non_MOU_Dto } from '../../Application/DTOS/dto-Collateral-Kedinasan_NON_MOU/create-collateral-kedinasan.dto';
import { UpdatePengajuanKedinasan_Non_MOU_Dto } from '../../Application/DTOS/dto-Collateral-Kedinasan_NON_MOU/update-collateral-kedinasan.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collateral-kedinasan-external-nm')
export class CollateralKedinasan_Non_MOU_ExternalController {
  constructor(
    private readonly CollateralKedinasanNonMOUExternal: CollateralKedinasan_NonMOU_ExternalService,
  ) {}

  @Public()
  @Post()
  async create(@Body() dto: CreatePengajuanKedinasan_Non_MOU_Dto) {
    return this.CollateralKedinasanNonMOUExternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.CollateralKedinasanNonMOUExternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.CollateralKedinasanNonMOUExternal.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePengajuanKedinasan_Non_MOU_Dto,
  ) {
    return this.CollateralKedinasanNonMOUExternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.CollateralKedinasanNonMOUExternal.delete(+id);

    return {
      error: false,
      message: 'Data berhasil dihapus',
    };
  }
}
