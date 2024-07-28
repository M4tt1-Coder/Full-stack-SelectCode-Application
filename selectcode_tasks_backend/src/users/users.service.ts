import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  User_ConvertEntityToDTO,
  UserDTO,
  UserList_ConvertEntityToDTO,
} from './user.entity';
import { Repository } from 'typeorm';
import { Role } from 'lib/enums/roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(role?: Role): Promise<UserDTO[]> {
    if (role) {
      return UserList_ConvertEntityToDTO(
        await this.userRepo.find({ where: { role } }),
      );
    }
    return UserList_ConvertEntityToDTO(await this.userRepo.find());
  }

  async findOne(id: string): Promise<UserDTO> {
    return User_ConvertEntityToDTO(
      await this.userRepo.findOne({ where: { id } }),
    );
  }

  async create(user: User): Promise<UserDTO> {
    const newuser = this.userRepo.create(user);
    return User_ConvertEntityToDTO(await this.userRepo.save(newuser));
  }

  async update(id: string, user: Partial<User>): Promise<UserDTO> {
    await this.userRepo.update(id, user);
    return User_ConvertEntityToDTO(
      await this.userRepo.findOne({ where: { id } }),
    );
  }

  async delete(id: string): Promise<UserDTO> {
    const user = await this.userRepo.findOne({ where: { id } });
    await this.userRepo.delete(id);
    return User_ConvertEntityToDTO(user);
  }
}
