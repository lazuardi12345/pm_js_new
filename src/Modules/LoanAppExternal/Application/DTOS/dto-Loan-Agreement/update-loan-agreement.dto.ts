import { PartialType } from '@nestjs/mapped-types';
import { CreateSuratKontrakDto } from './create-loan-agreement.dto';

export class UpdateSuratKontrakDto extends PartialType(CreateSuratKontrakDto) {}
