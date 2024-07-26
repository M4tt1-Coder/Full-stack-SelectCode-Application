import { Role } from 'lib/enums/roles';
import { Project } from 'src/projects/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

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
