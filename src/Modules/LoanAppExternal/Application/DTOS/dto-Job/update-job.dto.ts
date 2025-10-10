import { PartialType } from '@nestjs/mapped-types';
import { CreateJobExternalDto } from './create-job.dto';

export class UpdateJobExternalDto extends PartialType(CreateJobExternalDto) {}
