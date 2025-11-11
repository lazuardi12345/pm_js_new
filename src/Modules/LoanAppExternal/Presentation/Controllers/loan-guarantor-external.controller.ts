import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LoanGuarantorExternalService } from '../../Application/Services/loan-guarantor-external.service';
import { CreateLoanGuarantorExternalDto } from '../../Application/DTOS/dto-Loan-Guarantor/create-loan-guarantor.dto';
import { UpdateLoanGuarantorExternalDto } from '../../Application/DTOS/dto-Loan-Guarantor/update-loan-guarantor.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loan-guarantor-external')
export class LoanGuarantorExternalController {
  constructor(
    private readonly loanGuarantorService: LoanGuarantorExternalService,
  ) {}

  @Post()
  async create(@Body() dto: CreateLoanGuarantorExternalDto) {
    return this.loanGuarantorService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.loanGuarantorService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.loanGuarantorService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLoanGuarantorExternalDto,
  ) {
    return this.loanGuarantorService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.loanGuarantorService.delete(+id);
  }
}
