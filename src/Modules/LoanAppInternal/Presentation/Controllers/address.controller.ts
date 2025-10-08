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
import { AddressInternalService } from '../../Application/Services/address-internal.service';
import { CreateAddressDto } from '../../Application/DTOS/dto-Address/create-address.dto';
import { UpdateAddressDto } from '../../Application/DTOS/dto-Address/update-address.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('address-internal')
export class AddressInternalController {
  constructor(private readonly addressService: AddressInternalService) {}

  @Post()
  async create(@Body() dto: CreateAddressDto) {
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
  async update(@Param('id') id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.addressService.delete(+id);
  }
}
