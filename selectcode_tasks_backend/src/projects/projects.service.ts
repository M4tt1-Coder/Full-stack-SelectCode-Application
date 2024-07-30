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
        await this.projectRepo.find({ where: { status } }),
      );
    }
    return projectList_ConvertEntityToDTO(await this.projectRepo.find());
  }

  async findOne(id: string): Promise<ProjectDTO> {
    return project_ConvertEntityToDTO(
      await this.projectRepo.findOne({ where: { id } }),
    );
  }

  async create(project: Project): Promise<ProjectDTO> {
    const newProject = this.projectRepo.create(project);
    return project_ConvertEntityToDTO(await this.projectRepo.save(newProject));
  }

  async update(id: string, project: Partial<Project>): Promise<ProjectDTO> {
    await this.projectRepo.update(id, project);
    return project_ConvertEntityToDTO(
      await this.projectRepo.findOne({ where: { id } }),
    );
  }

  async delete(id: string): Promise<ProjectDTO> {
    const project = await this.projectRepo.findOne({ where: { id } });
    await this.projectRepo.delete(id);
    return project_ConvertEntityToDTO(project);
  }
}
