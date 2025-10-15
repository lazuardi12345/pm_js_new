import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApprovalExternalService } from '../../Application/Services/approval-external.service';
import { CreateApprovalExternalDto } from '../../Application/DTOS/dto-Approval/create-approval.dto';
import { UpdateApprovalExternalDto } from '../../Application/DTOS/dto-Approval/update-approval.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approval-external')
export class ApprovalExternalController {
  constructor(private readonly approvalService: ApprovalExternalService) {}

  @Post()
  async create(@Body() dto: CreateApprovalExternalDto) {
  
    return this.approvalService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.approvalService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.approvalService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateApprovalExternalDto) {
    return this.approvalService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.approvalService.delete(+id);
  }
}
