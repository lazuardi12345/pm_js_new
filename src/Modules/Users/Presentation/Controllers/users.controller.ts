import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from '../../Application/Service/Users.service';
import { CreateUserDto } from '../../Application/DTOS/create-user.dto';
import { UpdateUserDto } from '../../Application/DTOS/update-user.dto';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.usersService.findById(+id);
  }

  @Public()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.softDelete(+id);
  }
}
