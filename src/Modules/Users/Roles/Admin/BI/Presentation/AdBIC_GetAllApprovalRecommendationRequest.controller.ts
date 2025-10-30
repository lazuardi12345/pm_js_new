import { Controller, InternalServerErrorException, Get } from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdBIC_FindAllRecommendationRequestUseCase } from '../Applications/AdBIC_GetAllApprovalRecommendationRequest.usecase';

@Controller('admin-bi/int')
export class AdBIC_FindAllRecommendationRequestController {
  constructor(
    private readonly useCase: AdBIC_FindAllRecommendationRequestUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Get('response/request')
  async createFindAllRecommendation() {
    try {
      return this.useCase.executeFindAllRecommendationRequest();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
