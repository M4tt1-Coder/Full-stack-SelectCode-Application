import { Status } from 'lib/enums/status';
import {
  Task,
  TaskDTO,
  taskList_ConvertDTOtoEntity,
  taskList_ConvertEntityToDTO,
} from 'src/tasks/task.entity';
import {
  User,
  UserDTO,
  User_ConvertDTOtoEntity,
  User_ConvertEntityToDTO,
} from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity for a project
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  Description: string;

  @Column()
  status: Status;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  // n : 1 relation to a user
  @ManyToOne(() => User, (user) => user.projects)
  creator: User;
}

// --------------------
//
// DTO - Project
//
// --------------------

/**
 * Data transfer object for a project
 */
export type ProjectDTO = {
  id: string;
  name: string;
  description: string;
  status: Status;
  creator: UserDTO;
  tasks: TaskDTO[];
};

/**
 *  Convert Project DTO to an entity.
 *
 * @param project - DTO to entity
 */
export function project_ConvertDTOtoEntity(project: ProjectDTO): Project {
  if (!project || typeof project === 'undefined') return null;
  return {
    name: project.name,
    id: project.id,
    Description: project.description,
    status: project.status,
    creator: User_ConvertDTOtoEntity(project.creator),
    tasks: taskList_ConvertDTOtoEntity(project.tasks),
  };
}

/**
 *  Returns copy of project entity as DTO.
 *
 * @param project - Entity to DTO
 */
export function project_ConvertEntityToDTO(project: Project): ProjectDTO {
  if (!project || typeof project === 'undefined') return null;
  return {
    name: project.name,
    id: project.id,
    description: project.Description,
    status: project.status,
    creator: User_ConvertEntityToDTO(project.creator),
    tasks: taskList_ConvertEntityToDTO(project.tasks),
  };
}

/**
 * Converts project entities to DTOs
 *
 * @param projects - List of projects entities
 * @returns List of projects data transfer objects
 */
export function projectList_ConvertEntityToDTO(
  projects: Project[],
): ProjectDTO[] {
  const output: ProjectDTO[] = [];

  if (typeof projects === 'undefined' || projects.length === 0) {
    return output;
  }

  projects.forEach((project: Project) => {
    output.push(project_ConvertEntityToDTO(project));
  });

  return output;
}

/**
 * Converts project DTOS to entities
 *
 * @param projects - List of projects DTOS
 * @returns List of project entities
 */
export function projectList_ConvertDTOtoEntity(
  projects: ProjectDTO[],
): Project[] {
  const output: Project[] = [];

  if (typeof projects === 'undefined' || projects.length === 0) {
    return output;
  }

  projects.forEach((project: ProjectDTO) => {
    output.push(project_ConvertDTOtoEntity(project));
  });

  return output;
}
