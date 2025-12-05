import { Controller, InternalServerErrorException, Get } from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdBIC_FindAllRecommendationRequestUseCase } from '../Applications/AdBIC_GetAllApprovalRecommendationRequest.usecase';

@Controller('admin-bi')
export class AdBIC_FindAllRecommendationRequestController {
  constructor(
    private readonly useCase: AdBIC_FindAllRecommendationRequestUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_BI)
  @Get('int/response/request')
  async createFindAllInternalRecommendationRequest() {
    try {
      return this.useCase.executeFindAllRecommendationInternalRequest();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }

  @Roles(USERTYPE.ADMIN_BI)
  @Get('ext/response/request')
  async createFindAllExternalRecommendationRequest() {
    try {
      return this.useCase.executeFindAllRecommendationExternalRequest();
    } catch (error) {
      console.error('Create approval recommendation failed:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
