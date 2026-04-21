import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { AdAR_MarkBadDebtUseCase } from '../Applications/AdAR_MarkAsBadDebt.usecase';
import { AdAR_MarkBadDebtDto } from '../Applications/DTOS/AdAR_MarkDebt.dto';

@Controller('admin-ar')
export class AdAR_MarkBadDebtController {
  constructor(private readonly useCase: AdAR_MarkBadDebtUseCase) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Post('client-loan-installment/mark-as-bad-debt')
  async markBadDebt(
    @Body() dto: AdAR_MarkBadDebtDto,
    @CurrentUser('id') changer_id: number,
    @CurrentUser('nama') changed_by: string,
  ) {
    try {
      if (dto.from_frequency_number < 1) {
        throw new BadRequestException({
          success: false,
          message: 'from_frequency_number minimal 1',
          reference: 'BAD_DEBT_INVALID_FROM_NUMBER',
        });
      }

      return this.useCase.execute(dto, changer_id, changed_by);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      console.error('[AdAR_MarkBadDebt] Controller error:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
