import { Controller, InternalServerErrorException, Get } from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdBIC_FindAllRecommendationHistoryUseCase } from '../Applications/AdBIC_GetAllApprovalRecommendationHistory.usecase';

@Controller('admin-bi/int')
export class AdBIC_FindAllRecommendationHistoryController {
  constructor(
    private readonly useCase: AdBIC_FindAllRecommendationHistoryUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Get('response/history')
  async createFindAllRecommendation() {
    try {
      return this.useCase.executeFindAllRecommendationHistory();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
