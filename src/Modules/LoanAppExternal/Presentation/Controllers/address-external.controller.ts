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
import { AddressExternalService } from '../../Application/Services/address-external.service';
import { CreateAddressExternalDto } from '../../Application/DTOS/dto-Address/create-address.dto';
import { UpdateAddressExternalDto } from '../../Application/DTOS/dto-Address/update-address.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('address-external')
export class AddressExternalController {
  constructor(private readonly addressService: AddressExternalService) {}

  @Post()
  async create(@Body() dto: CreateAddressExternalDto) {
    return this.addressService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.addressService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.addressService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateAddressExternalDto) {
    return this.addressService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.addressService.delete(+id);
  }
}
