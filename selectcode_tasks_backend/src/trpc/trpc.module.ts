import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { ProjectsModule } from 'src/projects/projects.module';

/**
 * Heart of the trcp scope
 *
 * Spreads the trpc functionality in the application.
 */
@Module({
  imports: [UsersModule, TasksModule, ProjectsModule],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcService],
})
export class TrpcModule {}
