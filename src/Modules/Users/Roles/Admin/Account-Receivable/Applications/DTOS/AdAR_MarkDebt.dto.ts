// Applications/DTOS/AdAR_MarkBadDebt.dto.ts

import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AdAR_MarkBadDebtDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsUUID()
  @IsNotEmpty()
  frequency_id: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  from_frequency_number: number;
}
