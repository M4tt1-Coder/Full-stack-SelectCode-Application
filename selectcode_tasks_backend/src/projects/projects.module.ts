import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Container containing all things related to projects
 */
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
