import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApprovalInternalService } from '../../Application/Services/approval-internal.service';
import { CreateApprovalDto } from '../../Application/DTOS/dto-Approval/create-approval.dto';
import { UpdateApprovalDto } from '../../Application/DTOS/dto-Approval/update-approval.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approval-internal')
export class ApprovalInternalController {
  constructor(private readonly approvalService: ApprovalInternalService) {}

  @Post()
  async create(@Body() dto: CreateApprovalDto) {
    console.log(`
      
      TOL KONTL:`, dto)
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
  async update(@Param('id') id: number, @Body() dto: UpdateApprovalDto) {
    return this.approvalService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.approvalService.delete(+id);
  }
}
