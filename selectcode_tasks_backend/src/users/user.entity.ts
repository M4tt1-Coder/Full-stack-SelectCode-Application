import { Role } from 'lib/enums/roles';
import {
  Project,
  ProjectDTO,
  projectList_ConvertDTOtoEntity,
  projectList_ConvertEntityToDTO,
} from 'src/projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

/**
 * The user entity
 */
@Entity()
// entity type for a user
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // that will be a UUID
  @Column()
  name: string;

  @Column()
  password: string;

  @Index({ unique: true })
  @Column()
  email: string;

  // can be a ADMIN || EXPERT || ADMIN
  @Column()
  role: Role;

  // when the user was lasttime online
  @UpdateDateColumn()
  lastTimeOnline: Date;

  // list of the created projects by the user
  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];
}

/**
 * Data Transfer Object for the user entity
 */
export type UserDTO = {
  id: string;
  name: string;
  password: string;
  email: string;
  role: Role;
  lto: Date;
  projects: ProjectDTO[];
};

/**
 * Converts a DTO into a user entity.
 *
 * @param userDTO - Data Transfer Object for the user to be convertef into a entity
 */
export function User_ConvertDTOtoEntity(userDTO: UserDTO): User {
  if (!userDTO || typeof userDTO === 'undefined') {
    throw new Error(
      'An empty user DTO object was passed to "User_ConvertDTOtoEntity" - function!',
    );
  }
  return {
    name: userDTO.name,
    id: userDTO.id,
    email: userDTO.email,
    password: userDTO.password,
    role: userDTO.role,
    lastTimeOnline: userDTO.lto,
    projects: projectList_ConvertDTOtoEntity(userDTO.projects),
  };
}

/**
 *  Takes in a user entity and converts it into a user DTO
 *
 * @param user - user entity to be converted into a DTO
 */
export function User_ConvertEntityToDTO(user: User): UserDTO {
  if (!user || typeof user === 'undefined') {
    throw new Error(
      'Failed to continue with an empty user object in the "User_ConvertEntitytoDTO" - function.',
    );
  }
  return {
    name: user.name,
    id: user.id,
    email: user.email,
    password: user.password,
    role: user.role,
    lto: user.lastTimeOnline,
    projects: projectList_ConvertEntityToDTO(user.projects),
  };
}

/**
 * Uses entities to convert and return a user dtos.
 *
 * @param userList - list of user entities to be converted into list of user DTOs
 */
export function UserList_ConvertEntityToDTO(userList: User[]): UserDTO[] {
  const output: UserDTO[] = [];

  if (typeof userList === 'undefined' || !userList || userList.length === 0) {
    console.log(
      'No users were passed to the "UserList_ConvertEntityToDTO" - function!',
    );
    return output;
  }

  userList.forEach((user) => {
    output.push(User_ConvertEntityToDTO(user));
  });

  return output;
}

/**
 * Uses DTOs to convert and return a user entities list.
 *
 * @param userList - list of user DTOs to be converted into list of user entities
 */
export function UserList_ConvertDTOtoEntity(userList: UserDTO[]): User[] {
  const output: User[] = [];

  if (typeof userList === 'undefined' || userList.length === 0) {
    console.log(
      'No users were passed to the "UserList_ConvertDTOToEntity" - function',
    );
    return output;
  }

  userList.forEach((user) => {
    output.push(User_ConvertDTOtoEntity(user));
  });

  return output;
}
