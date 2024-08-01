import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Container for all tasks related stuff.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
