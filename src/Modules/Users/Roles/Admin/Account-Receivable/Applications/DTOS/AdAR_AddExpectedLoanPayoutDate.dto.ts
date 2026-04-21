// Applications/DTOS/AdAR_UpdateExpectedPayoutDate.dto.ts

import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class AdAR_AddExpectedLoanPayoutDateDto {
  @IsDateString()
  @IsNotEmpty()
  expected_payout_date: string;
}
