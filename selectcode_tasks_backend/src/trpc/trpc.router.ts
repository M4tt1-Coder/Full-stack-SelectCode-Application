import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TRPCError } from '@trpc/server';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';
import { defaultRole, isMember, stringToRole } from 'lib/enums/roles';
import { SHA256 } from 'crypto-js';
import { ProjectsService } from 'src/projects/projects.service';
import { User_ConvertDTOtoEntity } from 'src/users/user.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { project_ConvertDTOtoEntity } from 'src/projects/project.entity';

// trpc docs -> https://trpc.io/docs/quickstart
//! tRPC can't handle classes in a procedure output -> needs to be type

/**
 * The main router tRPC server endpoint -> handles all requests and responses in the monorepo
 */
@Injectable()
export class TrpcRouter {
  // using dependency injection -> can use services
  constructor(
    private readonly trpc: TrpcService,
    private readonly users: UsersService,
    private readonly projects: ProjectsService,
    private readonly tasks: TasksService,
  ) {}

  appRouter = this.trpc.router({
    // user route
    user: this.trpc.router({
      // get endpoint for user
      // * (means endpoint has been tested and it is working as expected)
      get: this.trpc.procedure
        .input(
          z.object({
            // represents a UUID
            // check if the uuid is a valid UUID
            // check if the input is a valid string in general
            id: z
              .string({
                message: 'Invalid string datatype ',
              })
              .uuid({
                message: 'Invalid UUID format!',
              }),
          }),
        )
        .query(async ({ input }) => {
          // destructure the input
          const { id } = input;

          // get the user wheree the input id is the same
          const user = await this.users.findOne(id);

          // make sure the user is not null
          if (!user) {
            throw new TRPCError({
              message: 'Could not find an USER!',
              code: 'NOT_FOUND',
            });
          }

          return user;
        }),
      // get all user OR all with one role
      // *
      getAll: this.trpc.procedure
        .input(
          z.object({
            role: z
              .enum(['Intern', 'Expert', 'Admin', 'SuperAdmin'])
              .optional(),
          }),
        )
        .query(async ({ input }) => {
          const { role } = input;
          if (role) {
            return await this.users.findAll(role);
          }
          return await this.users.findAll();
        }),
      // create endpoint for users
      // *
      create: this.trpc.procedure
        .input(
          z.object({
            name: z.string().min(3),
            password: z.string(), // need to hash the password here
            email: z.string().email(),
          }),
        )
        .mutation(async ({ input }) => {
          const { email, name, password } = input;

          // check if data is null
          if (!email || !password || !name) {
            throw new TRPCError({
              message: 'Necessary data missing!',
              code: 'BAD_REQUEST',
            });
          }

          // hashing the password
          // create a new user
          const user = await this.users.create({
            name,
            email,
            password: SHA256(password).toString(),
            id: v4(), // uuid version 4
            role: defaultRole(),
            lastTimeOnline: new Date(),
            projects: [],
          });

          if (!user) {
            throw new TRPCError({
              message: `Could not save user ${name}`,
              code: 'INTERNAL_SERVER_ERROR',
            });
          }

          return user;
        }),
      // delete user be his / her id
      // *
      delete: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .mutation(async ({ input }) => {
          const { id } = input;

          // delete and return deleted user
          const user = await this.users.delete(id);

          if (!user) {
            throw new TRPCError({
              message: `User ${id} could not be deleted!`,
              code: 'BAD_REQUEST',
            });
          }

          return user;
        }),
      // update a user
      // *
      update: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            password: z.string().optional(),
            email: z.string().email().optional(),
            role: z
              .enum(['Intern', 'Expert', 'Admin', 'SuperAdmin'])
              .optional(), // get Role enum type from string
          }),
        )
        .mutation(async ({ input }) => {
          const { id, name, password, role, email } = input;

          // check for right enum type of the role input
          if (role) {
            if (!isMember(role)) {
              throw new TRPCError({
                message: `Role ${role} does not exist!`,
                code: 'BAD_REQUEST',
              });
            }
          }

          const convertedRole = stringToRole(role);

          const user = this.users.update(id, {
            name: name,
            email,
            password: SHA256(password).toString(),
            role: convertedRole,
          });

          return user;
        }),
    }),
    // --------------------------
    //
    //
    //
    // project route
    project: this.trpc.router({
      // create a new project
      // *
      create: this.trpc.procedure
        .input(
          z.object({
            name: z.string(),
            description: z.string(),
            creatorID: z.string().uuid(),
          }),
        )
        .mutation(async ({ input }) => {
          const { name, description, creatorID } = input;

          // get the the creator
          const creator = await this.users.findOne(creatorID);

          if (!creator) {
            throw new TRPCError({
              message: 'creator not found',
              code: 'NOT_FOUND',
            });
          }

          const project = await this.projects.create({
            name: name,
            Description: description,
            id: v4(),
            status: 'Preparing',
            tasks: [],
            creator: User_ConvertDTOtoEntity(creator),
          });

          return project;
        }),
      // get a single project from the database
      // *
      get: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .query(async ({ input }) => {
          const { id } = input;

          // get the project by its id
          const project = await this.projects.findOne(id);

          if (!project) {
            throw new TRPCError({
              message: 'Project not found',
              code: 'NOT_FOUND',
            });
          }

          return project;
        }),
      // return all projects OR just the ones in a special status
      // *
      getAll: this.trpc.procedure
        .input(
          z.object({
            status: z.enum(['Preparing', 'Development', 'Finished']).optional(),
          }),
        )
        .query(async ({ input }) => {
          const { status } = input;

          // get all projects
          const projects = await this.projects.findAll(status);

          if (!projects || projects.length === 0) {
            throw new TRPCError({
              message: 'No projects found',
              code: 'NOT_FOUND',
            });
          }

          return projects;
        }),
      // delete a project by using its id
      //*
      delete: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .mutation(async ({ input }) => {
          const { id } = input;

          // delete the project
          const project = await this.projects.delete(id);

          if (!project) {
            throw new TRPCError({
              message: 'Project not found OR already deleted',
              code: 'NOT_FOUND',
            });
          }

          return project;
        }),
      // updating a project
      // *
      update: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
            name: z.string().min(5).optional(),
            description: z.string().min(20).optional(),
            status: z.enum(['Preparing', 'Development', 'Finished']).optional(),
            // no 'tasks' property input -> tasks are modified seperately
          }),
        )
        .mutation(async ({ input }) => {
          const { id, name, description, status } = input;

          const project = await this.projects.update(id, {
            name,
            Description: description,
            status,
          });

          if (!project) {
            throw new TRPCError({
              message: 'Project not found and updated!',
              code: 'NOT_FOUND',
            });
          }

          return project;
        }),
    }),
    // ------------
    //
    //
    //
    // task route
    task: this.trpc.router({
      // create a new task
      // *
      create: this.trpc.procedure
        .input(
          z.object({
            name: z.string().min(5),
            description: z.string().min(20),
            projectID: z.string().uuid(),
          }),
        )
        .mutation(async ({ input }) => {
          const { name, description, projectID } = input;

          // condition for thw creation of task is that the project already exists
          const project = await this.projects.findOne(projectID);

          if (!project) {
            throw new TRPCError({
              message: 'Task could be associated with any project!',
              code: 'NOT_FOUND',
            });
          }

          const task = await this.tasks.create({
            name,
            description,
            id: v4(),
            status: 'Preparing',
            assignees: [],
            project: project_ConvertDTOtoEntity(project),
          });

          return task;
        }),
      //  get a task from the identifier
      // *
      get: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .query(async ({ input }) => {
          const { id } = input;

          // get the task from the database
          const task = await this.tasks.findOne(id);

          if (!task) {
            throw new TRPCError({
              message: 'Task not found',
              code: 'NOT_FOUND',
            });
          }

          return task;
        }),
      // get all tasks filtered by status
      // *
      getAll: this.trpc.procedure
        .input(
          z.object({
            status: z.enum(['Preparing', 'Development', 'Finished']).optional(),
          }),
        )
        .query(async ({ input }) => {
          const { status } = input;

          //get a filtered list of tasks
          const tasks = await this.tasks.findAll(status);

          // notity the client that
          if (!tasks || tasks.length === 0) {
            throw new TRPCError({
              message: 'No tasks found or created',
              code: 'NOT_FOUND',
            });
          }

          return tasks;
        }),
      // delete a task by its ID
      // *
      delete: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .mutation(async ({ input }) => {
          const { id } = input;

          // delete and retrieve the deleted task
          const task = await this.tasks.delete(id);

          if (!task) {
            throw new TRPCError({
              message: 'Task not found',
              code: 'NOT_FOUND',
            });
          }

          return task;
        }),
      // update the task
      // *
      update: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
            status: z.enum(['Preparing', 'Development', 'Finished']).optional(),
            name: z.string().optional(),
            description: z.string().optional(),
            assigneesIDs: z.array(z.string().uuid()).optional(), // list of ids of assignees -> used to get list of assignees
          }),
        )
        .mutation(async ({ input }) => {
          const { id, status, name, description, assigneesIDs } = input;

          // get all new assignees
          const assignees = await this.users.findAllOfTask(assigneesIDs);
          console.log(assignees);

          // update the task
          const task = await this.tasks.update(id, {
            id,
            name,
            description,
            assignees,
            status,
          });

          if (!task) {
            throw new TRPCError({
              message: 'Task not found or already created',
              code: 'NOT_FOUND',
            });
          }

          return task;
        }),
      // get list of tasks a uses is assigned to
      // *
      getTaskOfUser: this.trpc.procedure
        .input(
          z.object({
            userID: z.string().uuid(),
          }),
        )
        .query(async ({ input }) => {
          const { userID } = input;

          // get the list of tasks
          const tasks = await this.tasks.findTaskOfUser(userID);

          if (!tasks) {
            throw new TRPCError({
              message: 'Tasks of user not found',
              code: 'NOT_FOUND',
            });
          }

          return tasks;
        }),
    }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
