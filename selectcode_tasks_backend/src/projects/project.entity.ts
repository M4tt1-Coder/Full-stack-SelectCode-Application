import { Status } from 'lib/enums/status';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
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
