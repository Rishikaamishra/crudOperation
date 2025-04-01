import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  private readonly filePath = 'src/users.mock.json';

  private readUsers() {
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data).USERS;
  }

  private writeUsers(users: any[]) {
    fs.writeFileSync(this.filePath, JSON.stringify({ USERS: users }, null, 2));
  }

  findAll() {
    return this.readUsers();
  }

  findOne(id: number) {
    const users = this.readUsers();
    const user = users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  create(user: any) {
    if (!user.name || !user.position) {
      throw new BadRequestException('User must have a name and position.');
    }
    const users = this.readUsers();
    const newUser = { id: users.length + 1, ...user };
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  update(id: number, updateData: any) {
    let users = this.readUsers();
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    users[index] = { ...users[index], ...updateData };
    this.writeUsers(users);
    return users[index];
  }

  remove(id: number) {
    let users = this.readUsers();
    const filteredUsers = users.filter(user => user.id !== id);

    if (users.length === filteredUsers.length) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    this.writeUsers(filteredUsers);
    return { message: `User with ID ${id} deleted.` };
  }
}

