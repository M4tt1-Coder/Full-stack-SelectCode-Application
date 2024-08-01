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

/**
 * _ Provider _
 *
 * Provides all the functionality for handling the user entity.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Gets a list of all users or just of one specific role.
   *
   * @param role - role after which can be filtered
   * @returns list of users
   */
  async findAll(role?: Role): Promise<UserDTO[]> {
    if (role) {
      return UserList_ConvertEntityToDTO(
        await this.userRepo.find({ where: { role } }),
      );
    }
    return UserList_ConvertEntityToDTO(await this.userRepo.find());
  }

  /**
   * Searches for one user in the database by its id.
   *
   * id can't be null / undefined.
   *
   * @param id - id of the user
   * @returns user instance
   */
  async findOne(id: string): Promise<UserDTO> {
    return User_ConvertEntityToDTO(
      await this.userRepo.findOne({ where: { id } }),
    );
  }

  /**
   * Uses a list of user ids to return a list of users
   *
   * @param userIDs - List of user ids
   */
  async findAllOfTask(userIDs: string[]): Promise<User[]> {
    const output: User[] = [];

    if (typeof userIDs === 'undefined' || userIDs.length === 0) {
      console.log('No user IDs');
    }

    for (let i = 0; i < userIDs.length; i++) {
      const user = await this.userRepo.findOne({ where: { id: userIDs[i] } });

      output.push(user);
    }

    return output;
  }

  /**
   * Creates a new user and saves it to the database.
   *
   * User must have all needed properties.
   *
   * @param user - user object
   * @returns user that was created
   */
  async create(user: User): Promise<UserDTO> {
    const newuser = this.userRepo.create(user);
    return User_ConvertEntityToDTO(await this.userRepo.save(newuser));
  }

  /**
   *  Takes in a user object with all new optional properties.
   *
   *  Fails if the id doesn't exist on a stored user object.
   *
   * @param id - Identifier of the user
   * @param user - The particular props
   * @returns updated user object
   */
  async update(id: string, user: Partial<User>): Promise<UserDTO> {
    await this.userRepo.update(id, user);
    return User_ConvertEntityToDTO(
      await this.userRepo.findOne({ where: { id } }),
    );
  }

  /**
   *  Deletes a user with its ID.
   *
   * ID can not be undefined.
   *
   * @param id - The ID of the user.
   * @returns data of the deleted user
   */
  async delete(id: string): Promise<UserDTO> {
    const user = await this.userRepo.findOne({ where: { id } });
    await this.userRepo.delete(id);
    return User_ConvertEntityToDTO(user);
  }
}
