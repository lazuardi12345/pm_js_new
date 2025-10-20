import { PartialType } from '@nestjs/mapped-types';
import {CreateLoanApplicationDto} from '../DTOS/MKT_CreateLoanApplication.dto'

export class UpdateLoanApplicationDto extends PartialType(CreateLoanApplicationDto) {}