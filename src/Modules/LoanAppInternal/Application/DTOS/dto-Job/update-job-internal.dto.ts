import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job-internal.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
