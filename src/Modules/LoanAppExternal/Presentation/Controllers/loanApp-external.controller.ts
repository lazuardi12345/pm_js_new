import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { LoanApplicationExternalService } from '../../Application/Services/loanApp-external.service';
import { CreateLoanApplicationExternalDto } from '../../Application/DTOS/dto-Loan-Application/create-loan-application.dto';
import { UpdateLoanApplicationExternalDto } from '../../Application/DTOS/dto-Loan-Application/update-loan-application.dto';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loan-application-external')
export class LoanApplicationExternalController {
  constructor(
    private readonly loanApplicationService: LoanApplicationExternalService,
  ) {}

  private mapUserTypeToSearchEnum(userRole: USERTYPE): RoleSearchEnum {
    switch (userRole) {
      case USERTYPE.HM:
        return RoleSearchEnum.HM;
      case USERTYPE.SPV:
        return RoleSearchEnum.SPV;
      case USERTYPE.MARKETING:
        return RoleSearchEnum.MARKETING;
      case USERTYPE.CA:
        return RoleSearchEnum.CA;
      default:
        throw new Error(
          `Role ${userRole} is not authorized or mappable for this search.`,
        );
    }
  }
  @Get('search/history')
  @Roles(USERTYPE.HM, USERTYPE.SPV, USERTYPE.MARKETING, USERTYPE.CA)
  async searchLoanHistory(
    @Req() req: any,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const { usertype } = req.user;
    if (!usertype) throw new UnauthorizedException('Invalid User Session');
    const role = this.mapUserTypeToSearchEnum(usertype as USERTYPE);
    const results = await this.loanApplicationService.searchLoans(
      role,
      TypeSearchEnum.HISTORY,
      keyword ?? '',
      page,
      pageSize,
    );

    return {
      payload: {
        error: false,
        message: 'Search Loan History fetched successfully',
        refence: 'SEARCH_LOAN_HISTORY_OK',
        data: results,
      },
    };
  }

  @Get('search/request')
  @Roles(USERTYPE.HM, USERTYPE.SPV, USERTYPE.MARKETING, USERTYPE.CA)
  async searchLoanRequest(@Req() req: any, @Query('keyword') keyword?: string) {
    const { usertype } = req.user;
    if (!usertype) throw new UnauthorizedException('Invalid User Session');
    const role = this.mapUserTypeToSearchEnum(usertype as USERTYPE);
    return this.loanApplicationService.searchLoans(
      role,
      TypeSearchEnum.REQUEST,
      keyword ?? '',
    );
  }

  @Get('all/loan-apps')
  @Roles(USERTYPE.HM, USERTYPE.SPV, USERTYPE.MARKETING, USERTYPE.CA)
  async getLoanApplicationHistory(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const { usertype } = req.user;
    if (!usertype) throw new UnauthorizedException('Invalid User Session');

    const res =
      await this.loanApplicationService.getLoanApplicationExternalDatabase(
        page,
        pageSize,
      );

    return {
      payload: {
        error: false,
        message: 'All Loan Application retrieved successfully',
        reference: 'ALL_LOAN_APPLICATIONS_RETRIEVE_OK',
        data: res,
      },
    };
  }

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
