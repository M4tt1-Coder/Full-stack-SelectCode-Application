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

  async create(project: Project): Promise<ProjectDTO> {
    const newProject = this.projectRepo.create(project);
    return project_ConvertEntityToDTO(await this.projectRepo.save(newProject));
  }

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
