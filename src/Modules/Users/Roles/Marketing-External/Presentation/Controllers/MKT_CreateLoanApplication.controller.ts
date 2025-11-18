// import {
//   Controller,
//   Post,
//   Body,
//   BadRequestException,
//   InternalServerErrorException,
//   UseGuards,
//   ValidationPipe,
// } from '@nestjs/common';
// import { MKT_CreateLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateLoanApplication.usecase';
// import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
// import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
// import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
// import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
// import { CreateLoanApplicationExternalDto } from '../../Applications/DTOS/MKT_CreateLoanApplicationExternal.dto';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('mkt/int/loan-apps')
// export class MKT_CreateLoanApplicationController {
//   constructor(
//     private readonly createLoanApplication: MKT_CreateLoanApplicationUseCase,
//   ) {}

//   @Post('create')
//   async submitLoanApp(
//     @CurrentUser('id') marketingId: number,
//     @Body() body: any, // Terima apa saja dulu
//   ) {
//     try {
//       // Extract langsung payload dari body
//       const dto = body.payload;

//       // Validasi manual dengan ValidationPipe
//       const validatedDto = await new ValidationPipe({
//         whitelist: true,
//         forbidNonWhitelisted: true,
//       }).transform(dto, {
//         type: 'body',
//         metatype: CreateLoanApplicationExternalDto,
//       });

//       return await this.createLoanApplication.execute(
//         validatedDto,
//         marketingId,
//       );
//     } catch (error) {
//       console.error('Error occurred:', error);
//       if (error instanceof BadRequestException) throw error;

//       throw new InternalServerErrorException(
//         'An error occurred while processing your request',
//       );
//     }
//   }
// }
