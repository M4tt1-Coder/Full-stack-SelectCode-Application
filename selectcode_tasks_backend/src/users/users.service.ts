import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Role } from 'lib/enums/roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(role?: Role): Promise<User[]> {
    if (role) {
      return this.userRepo.find({ where: { role } });
    }
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    const newuser = this.userRepo.create(user);
    return this.userRepo.save(newuser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepo.update(id, user);
    return this.userRepo.findOne({ where: { id } });
  }

  async delete(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    await this.userRepo.delete(id);
    return user;
  }
}
