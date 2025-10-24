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
import { ApprovalRecommendationService } from '../../Applications/Services/approval-recommendation.entity';
import { CreateApprovalRecommendationDto } from '../../Applications/DTOS/dto-ApprovalRecommendation/create-approval-recommendation.dto';
import { UpdateApprovalRecommendationDto } from '../../Applications/DTOS/dto-ApprovalRecommendation/update-approval-recommendation.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('approval-recommendation')
export class ApprovalRecommendationController {
  constructor(
    private readonly approvalRecomendationService: ApprovalRecommendationService,
  ) {}

  @Post()
  async create(@Body() dto: CreateApprovalRecommendationDto) {
    return this.approvalRecomendationService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.approvalRecomendationService.findById(+id);
  }

  @Get('draft/:id')
  async findByDraftId(@Param('id') draftId: string) {
    return this.approvalRecomendationService.findByDraftId(draftId);
  }

  @Get('nik/:nik')
  async findByNIK(@Param('nik') nik: string) {
    return this.approvalRecomendationService.findByNIK(nik);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateApprovalRecommendationDto,
  ) {
    return this.approvalRecomendationService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.approvalRecomendationService.delete(+id);
  }
}
