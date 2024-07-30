import { Injectable } from '@nestjs/common';
import {
  Task,
  task_ConvertEntityToDTO,
  TaskDTO,
  taskList_ConvertEntityToDTO,
} from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'lib/enums/status';

/**
 *  _ Provider _
 *
 *  Provides all utility functions for the task entity.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(status?: Status): Promise<TaskDTO[]> {
    if (status) {
      return taskList_ConvertEntityToDTO(
        await this.taskRepo.find({ where: { status } }),
      );
    }
    return taskList_ConvertEntityToDTO(await this.taskRepo.find());
  }

  async findOne(id: string): Promise<TaskDTO> {
    return task_ConvertEntityToDTO(
      await this.taskRepo.findOne({ where: { id } }),
    );
  }

  async create(task: Task): Promise<TaskDTO> {
    const newProject = this.taskRepo.create(task);
    return task_ConvertEntityToDTO(await this.taskRepo.save(newProject));
  }

  async update(id: string, task: Partial<Task>): Promise<TaskDTO> {
    await this.taskRepo.update(id, task);
    return task_ConvertEntityToDTO(
      await this.taskRepo.findOne({ where: { id } }),
    );
  }

  async delete(id: string): Promise<TaskDTO> {
    const task = await this.taskRepo.findOne({ where: { id } });
    await this.taskRepo.delete(id);
    return task_ConvertEntityToDTO(task);
  }
}
