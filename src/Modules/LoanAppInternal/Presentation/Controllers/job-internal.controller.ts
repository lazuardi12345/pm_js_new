import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JobInternalService } from '../../Application/Services/job-internal.service';
import { CreateJobDto } from '../../Application/DTOS/dto-Job/create-job-internal.dto';
import { UpdateJobDto } from '../../Application/DTOS/dto-Job/update-job-internal.dto';

import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-internal')
export class JobInternalController {
  constructor(private readonly jobService: JobInternalService) {}

  @Post()
  async create(@Body() dto: CreateJobDto) {
    return this.jobService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.jobService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.jobService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateJobDto) {
    return this.jobService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.jobService.delete(+id);
  }
}
