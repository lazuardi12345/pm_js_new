import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JobExternalService } from '../../Application/Services/job-external.service';
import { CreateJobExternalDto } from '../../Application/DTOS/dto-Job/create-job.dto';
import { UpdateJobExternalDto } from '../../Application/DTOS/dto-Job/update-job.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-external')
export class JobExternalController {
  constructor(private readonly jobService: JobExternalService) {}

  @Post()
  async create(@Body() dto: CreateJobExternalDto) {
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
  async update(@Param('id') id: number, @Body() dto: UpdateJobExternalDto) {
    return this.jobService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.jobService.delete(+id);
  }
}
