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

  /**
   * Takes in a status parameter, filters the results with it.
   *
   * Gets a list of tasks from the database.
   *
   * @param status - status of the tasks
   * @returns list of tasks
   */
  async findAll(status?: Status): Promise<TaskDTO[]> {
    if (status) {
      return taskList_ConvertEntityToDTO(
        await this.taskRepo.find({
          where: { status },
          relations: {
            assignees: true,
            project: true,
          },
        }),
      );
    }
    return taskList_ConvertEntityToDTO(
      await this.taskRepo.find({
        relations: {
          assignees: true,
          project: true,
        },
      }),
    );
  }

  /**
   * Uses a task id to retrieve it from the storage.
   *
   * The id can't be empty or it will fail.
   *
   * @param id - task id
   * @returns task object
   */
  async findOne(id: string): Promise<TaskDTO> {
    return task_ConvertEntityToDTO(
      await this.taskRepo.findOne({
        where: { id },
        relations: {
          assignees: true,
          project: true,
        },
      }),
    );
  }

  /**
   *  Uses the user id to determine all tasks one user has to do.
   *
   *  Fails when no tasks are saved on the server.
   * @param userID - identifier of the user
   * @returns - list of tasks which one user is assigned to
   */
  async findTaskOfUser(userID: string): Promise<TaskDTO[]> {
    const output: TaskDTO[] = [];

    const tasks = await this.findAll();

    if (!tasks || tasks.length === 0) {
      throw new Error('No tasks were found in the database');
    }

    tasks.forEach((task) => {
      if (!task.assignees || task.assignees.length === 0) {
        throw new Error(
          `No users were assigned to the task with the id ${task.id}`,
        );
      }

      task.assignees.forEach((assignee) => {
        if (assignee.id === userID) {
          output.push(task);
        }
      });
    });

    return output;
  }

  /**
   * Creates a new task.
   *
   * Fails when the task parameter is undefined.
   *
   * @param task - task information to be stored
   * @returns created task
   */
  async create(task: Task): Promise<TaskDTO> {
    const newProject = this.taskRepo.create(task);
    return task_ConvertEntityToDTO(await this.taskRepo.save(newProject));
  }

  //! cant query across many-to-many associations -> needed to use the 'save'-method instead of 'update' => https://github.com/typeorm/typeorm/issues/8245
  /**
   * First saves changes to the database and returns result.
   *
   * @param id - id of the task
   * @param task - optional props for the task to be updated
   * @returns updated task
   */
  async update(id: string, task: Partial<Task>): Promise<TaskDTO> {
    await this.taskRepo.save(task);
    return task_ConvertEntityToDTO(
      await this.taskRepo.findOne({
        where: { id },
        relations: {
          assignees: true,
          project: true,
        },
      }),
    );
  }

  /**
   *  Deletes a task from the database using its id.
   *
   * Fails when the id is invalid.
   *
   * @param id - id of the task to be deleted
   * @returns instance of deleted task
   */
  async delete(id: string): Promise<TaskDTO> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: { assignees: true, project: true },
    });
    await this.taskRepo.delete(id);
    return task_ConvertEntityToDTO(task);
  }
}
