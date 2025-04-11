import { Controller, Get, Post, Put, Delete, Param, Body, Query, Patch, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }
  
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.restore(id);
  }
  


  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() user: any) {
    return this.usersService.create(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

 

}
