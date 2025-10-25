import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { LoanApplicationInternalService } from '../../Application/Services/loan-app-internal.service';
import { CreateLoanApplicationInternalDto } from '../../Application/DTOS/dto-LoanApp/create-loan-application.dto';
import { UpdateLoanAplicationInternalDto } from '../../Application/DTOS/dto-LoanApp/update-loan-application.dto';

// import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';

@Controller('loan-application-internal')
export class LoanApplicationInternalController {
  constructor(
    private readonly loanApplicationService: LoanApplicationInternalService,
  ) {}

  private mapUserTypeToSearchEnum(userRole: USERTYPE): RoleSearchEnum {
    switch (userRole) {
      case USERTYPE.HM:
        return RoleSearchEnum.HM;
      case USERTYPE.SPV:
        return RoleSearchEnum.SPV;
      case USERTYPE.MARKETING:
        return RoleSearchEnum.MARKETING; // Sesuaikan dengan MKT di RoleSearchEnum
      case USERTYPE.CA:
        return RoleSearchEnum.CA;
      default:
        // Lempar error jika role tidak diizinkan atau tidak ditemukan di RoleSearchEnum
        throw new Error(
          `Role ${userRole} is not authorized or mappable for this search.`,
        );
    }
  }
  @Get('search/history')
  @Roles(USERTYPE.HM, USERTYPE.SPV, USERTYPE.MARKETING, USERTYPE.CA)
  async searchLoanHistory(@Req() req: any, @Query('keyword') keyword?: string) {
    const userRole: USERTYPE = req.user.role;
    const role: RoleSearchEnum = this.mapUserTypeToSearchEnum(userRole);
    return this.loanApplicationService.searchLoans(
      role, // langsung
      TypeSearchEnum.REQUEST,
      keyword ?? '',
    );
  }

  @Get('search/request')
  @Roles(USERTYPE.HM, USERTYPE.SPV, USERTYPE.MARKETING, USERTYPE.CA)
  async searchLoanRequest(@Req() req: any, @Query('keyword') keyword?: string) {
    const userRole: USERTYPE = req.user.role;
    const role: RoleSearchEnum = this.mapUserTypeToSearchEnum(userRole);
    return this.loanApplicationService.searchLoans(
      role, // langsung
      TypeSearchEnum.HISTORY,
      keyword ?? '',
    );
  }

  @Post()
  async create(@Body() dto: CreateLoanApplicationInternalDto) {
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
    @Body() dto: UpdateLoanAplicationInternalDto,
  ) {
    return this.loanApplicationService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.loanApplicationService.delete(+id);
  }
}
