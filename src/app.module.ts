import { Module } from '@nestjs/common';


import { UsersModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
 
})
export class AppModule {}



