import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OtherExistLaonExternalService } from '../../Application/Services/other-exist-loans-external.service';
import { CreateOtherExistLoansExternalDto } from '../../Application/DTOS/dto-Other-Exist-Loans/create-other-exist-loans.dto';
import { UpdateOtherExistLoansExternalDto } from '../../Application/DTOS/dto-Other-Exist-Loans/update-other-exist-loans.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('other-exist-external')
export class OtherExixtLoansExternalController {
  constructor(private readonly OtherExistLoansExternalService: OtherExistLaonExternalService) {}

  @Post()
  async create(@Body() dto: CreateOtherExistLoansExternalDto) {
    return this.OtherExistLoansExternalService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.OtherExistLoansExternalService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.OtherExistLoansExternalService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateOtherExistLoansExternalDto) {
    return this.OtherExistLoansExternalService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.OtherExistLoansExternalService.delete(+id);
  }
}
