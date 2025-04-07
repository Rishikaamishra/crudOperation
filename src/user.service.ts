import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'; 
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // You still use InjectRepository, but it works directly with the User entity now.
    private readonly userRepository: Repository<User>,
  ) {}

  // Find all users
  async findAll() {
    return await this.userRepository.find();
  }

  // Find one user by ID
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

  // Update user by ID
  async update(id: number, updateData: any) {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  // Delete user by ID
  async remove(id: number) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
