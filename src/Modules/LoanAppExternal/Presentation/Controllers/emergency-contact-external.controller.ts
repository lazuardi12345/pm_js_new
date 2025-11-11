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
import { EmergencyContactExternalService } from '../../Application/Services/emergency-contact-external.service';
import { CreateEmergencyContactExternalDto } from '../../Application/DTOS/dto-Emergency-Contact/create-emergency-contact.dto';
import { UpdateEmergencyContactExternalDto } from '../../Application/DTOS/dto-Emergency-Contact/update-emergency-contact.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('emergency-contact-external')
export class EmergencyContactExternalController {
  constructor(
    private readonly emergencycontactexternal: EmergencyContactExternalService,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmergencyContactExternalDto) {
    return this.emergencycontactexternal.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.emergencycontactexternal.findById(+id);
  }

  @Get()
  async findAll() {
    return this.emergencycontactexternal.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateEmergencyContactExternalDto,
  ) {
    return this.emergencycontactexternal.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.emergencycontactexternal.delete(+id);
  }
}
