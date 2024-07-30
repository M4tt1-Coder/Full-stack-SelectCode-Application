import { Status } from 'lib/enums/status';
import {
  Project,
  ProjectDTO,
  project_ConvertEntityToDTO,
  project_ConvertDTOtoEntity,
} from 'src/projects/project.entity';
import {
  User,
  UserDTO,
  UserList_ConvertEntityToDTO,
  UserList_ConvertDTOtoEntity,
} from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// This is the entity for a single task
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  status: Status;

  // n : m relation with a user
  @ManyToMany(() => User)
  @JoinTable()
  assignees: User[];

  //  n : 1 relation with a project
  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;
}

// --------------------
//
// DTO - Task
//
// --------------------

/**
 * Task - Data transfer object
 */
export type TaskDTO = {
  id: string;
  name: string;
  description: string;
  status: Status;
  assignees: UserDTO[];
  project: ProjectDTO;
};

/**
 *  Convert task DTO to an entity.
 *
 * @param task - DTO to entity
 */
export function task_ConvertDTOtoEntity(task: TaskDTO): Task {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    assignees: UserList_ConvertDTOtoEntity(task.assignees),
    project: project_ConvertDTOtoEntity(task.project),
  };
}

/**
 *  Returns copy of task entity as DTO.
 *
 * @param task - Entity to DTO
 */
export function task_ConvertEntityToDTO(task: Task): TaskDTO {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    status: task.status,
    assignees: UserList_ConvertEntityToDTO(task.assignees),
    project: project_ConvertEntityToDTO(task.project),
  };
}

/**
 * Converts task entities to DTOs
 *
 * @param tasks - List of task entities
 * @returns List of tasks data transfer objects
 */
export function taskList_ConvertEntityToDTO(tasks: Task[]): TaskDTO[] {
  const output: TaskDTO[] = [];

  if (typeof tasks === 'undefined' || tasks.length === 0) {
    return output;
  }

  tasks.forEach((task: Task) => {
    output.push(task_ConvertEntityToDTO(task));
  });

  return output;
}

/**
 * Converts task DTOS to entities
 *
 * @param tasks - List of task DTOS
 * @returns List of task entities
 */
export function taskList_ConvertDTOtoEntity(tasks: TaskDTO[]): Task[] {
  const output: Task[] = [];

  if (typeof tasks === 'undefined' || tasks.length === 0) {
    return output;
  }

  tasks.forEach((task: TaskDTO) => {
    output.push(task_ConvertDTOtoEntity(task));
  });

  return output;
}
