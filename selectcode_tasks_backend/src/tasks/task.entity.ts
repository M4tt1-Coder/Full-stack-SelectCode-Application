import { Status } from 'lib/enums/status';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
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
