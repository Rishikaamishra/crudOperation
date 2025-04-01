import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  createUser(@Body() user: any) {
    return this.usersService.create(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateData: any) {
    return this.usersService.update(Number(id), updateData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(Number(id));
  }
}
