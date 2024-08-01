import { Injectable } from '@nestjs/common';
import {
  Project,
  project_ConvertEntityToDTO,
  ProjectDTO,
  projectList_ConvertEntityToDTO,
} from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'lib/enums/status';

/**
 * _ Provider _
 *
 * Provides utility functions for the project entity.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  /**
   * Finds all projects in the database.
   *
   * Filters out projects that are not in the same state as requested. (optional)
   *
   * @param status - Filter criteria for projects
   * @returns A list of projects
   */
  async findAll(status?: Status): Promise<ProjectDTO[]> {
    if (status) {
      return projectList_ConvertEntityToDTO(
        await this.projectRepo.find({
          where: { status },
          relations: {
            creator: true,
            tasks: true,
          },
        }),
      );
    }
    return projectList_ConvertEntityToDTO(
      await this.projectRepo.find({
        relations: {
          creator: true,
          tasks: true,
        },
      }),
    );
  }

  // solution to relation problem -> https://typeorm.io/many-to-one-one-to-many-relations
  /**
   * Uses the ID of the project to find it in the database.
   *
   * Fails if no project is found.
   *
   * @param id - ID of the project
   * @returns Data transfer object of the project
   */
  async findOne(id: string): Promise<ProjectDTO> {
    return project_ConvertEntityToDTO(
      await this.projectRepo.findOne({
        where: { id: id },
        relations: {
          creator: true,
          tasks: true,
        },
      }),
    );
  }

  /**
   * Tases in a project instance and stores it in the database.
   *
   * Fails if the project is null.
   *
   * @param project - project instance to be stored
   * @returns - the same project instance
   */
  async create(project: Project): Promise<ProjectDTO> {
    const newProject = this.projectRepo.create(project);
    return project_ConvertEntityToDTO(await this.projectRepo.save(newProject));
  }

  /**
   * Searches in the database for a project and updates its possibily properties.
   *
   *  Fails if the id doesn't match with a project.
   *
   * @param id - The id of the project
   * @param project - A partial project instance with optiona properties
   * @returns The project that has been updated
   */
  async update(id: string, project: Partial<Project>): Promise<ProjectDTO> {
    await this.projectRepo.update(id, project);
    return project_ConvertEntityToDTO(
      await this.projectRepo.findOne({
        where: { id },
        relations: {
          creator: true,
          tasks: true,
        },
      }),
    );
  }

  /**
   *  Removes a project from the database.
   *
   *  Fails if the project id is null or doesn't point to a project.
   *
   * @param id - project id
   * @returns Deleted project
   */
  async delete(id: string): Promise<ProjectDTO> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: {
        creator: true,
        tasks: true,
      },
    });
    await this.projectRepo.delete(id);
    return project_ConvertEntityToDTO(project);
  }
}
