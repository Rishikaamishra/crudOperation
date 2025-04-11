import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'; 
import { Repository } from 'typeorm';
import { ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  
  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = 'id',
      order = 'ASC',
    } = query;
  
    const take = +limit;
    const skip = (page - 1) * take;
  
    const where = search
      ? [
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
        ]
      : {};
  
    const [data, total] = await this.userRepository.findAndCount({
      where,
      take,
      skip,
      order: { [orderBy]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' },
      withDeleted: false, 
    });
  
    return {
      data,
      total,
      page: +page,
      pageCount: Math.ceil(total / take),
    };
  }
  
  
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // Create a new user
 
  // async create(createUserDto: any) {
  //   try {
  //     const data = this.userRepository.create({
  //       firstName: 'rishika',
  //       lastName: 'mishra',
  //       email: 'mishra@gmail.com',
  //     });
  
  //     console.log('Created Data:', data);
      
  //     const details = await this.userRepository.save(data);
  //     console.log('Saved Details:', details);
      
  //     return 'New user created';
  //   } catch (error) {
  //     console.error('Error saving user:', error);
  //     throw new BadRequestException('Error creating user');
  //   }
  // }
  
  async create(createUserDto: any) {
    if (!createUserDto.firstName || !createUserDto.lastName || !createUserDto.email) {
      throw new BadRequestException('User must have a first name, last name, and email.');
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  
  async update(id: number, updateData: any) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true, 
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  
    if (user.deletedAt || user.isActive === false) {
      throw new BadRequestException('Cannot update a deleted or inactive user.');
    }
  
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }
  

  
  async remove(id: number) {
    const user = await this.findOne(id);
  
    user.isActive = false;
    await this.userRepository.save(user);
  

    await this.userRepository.softDelete(id);
  
    return { message: 'User soft-deleted and deactivated.' };
  }
  

  async restore(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  
    if (!user || !user.deletedAt) {
      throw new NotFoundException(`User with ID ${id} is not deleted or does not exist.`);
    }
  
  
    await this.userRepository.restore(id);
  
    
    user.isActive = true;
    await this.userRepository.save(user);
  
    return { message: 'User successfully restored.' };
  }
  
  
}
