import { Controller, InternalServerErrorException, Get } from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdBIC_FindAllRecommendationHistoryUseCase } from '../Applications/AdBIC_GetAllApprovalRecommendationHistory.usecase';

@Controller('admin-bi')
export class AdBIC_FindAllRecommendationHistoryController {
  constructor(
    private readonly useCase: AdBIC_FindAllRecommendationHistoryUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Get('int/response/history')
  async createFindAllInternalRecommendation() {
    try {
      return this.useCase.executeFindAllRecommendationInternalHistory();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }

  @Roles(USERTYPE.ADMIN_BI)
  @Get('ext/response/history')
  async createFindAllExternalRecommendation() {
    try {
      return this.useCase.executeFindAllRecommendationExternalHistory();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
