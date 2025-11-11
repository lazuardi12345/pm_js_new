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
import { LoanApplicationExternalService } from '../../Application/Services/loanApp-external.service';
import { CreateLoanApplicationExternalDto } from '../../Application/DTOS/dto-Loan-Application/create-loan-application.dto';
import { UpdateLoanApplicationExternalDto } from '../../Application/DTOS/dto-Loan-Application/update-loan-application.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loan-application-external')
export class LoanApplicationExternalController {
  constructor(
    private readonly loanApplicationService: LoanApplicationExternalService,
  ) {}

  @Post()
  async create(@Body() dto: CreateLoanApplicationExternalDto) {
    return this.loanApplicationService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.loanApplicationService.findById(+id);
  }

  @Get()
  async findAll() {
    return this.loanApplicationService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLoanApplicationExternalDto,
  ) {
    return this.loanApplicationService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.loanApplicationService.delete(+id);
  }
}
