import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TRPCError } from '@trpc/server';
import { UsersService } from 'src/users/users.service';
// import { UserDTO } from 'src/users/user.entity';
import * as b from 'bcrypt';
import { v4 } from 'uuid';
import { defaultRole, isMember, stringToRole } from 'lib/enums/roles';
// import { UserDTO } from 'src/users/user.entity';
// import { Project } from 'src/projects/project.entity';

// trpc docs -> https://trpc.io/docs/quickstart
//! tRPC can't handle classes in a procedure output -> needs to be type

@Injectable()
export class TrpcRouter {
  // using dependency injection -> can use services
  constructor(
    private readonly trpc: TrpcService,
    private readonly users: UsersService,
  ) {}

  // TODO - test the endpoints
  // TODO - Setup all endpoints

  appRouter = this.trpc.router({
    // user route
    user: this.trpc.router({
      // get endpoint for user
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

          return { result: user };
        }),
      // get all user OR all with one role
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
      create: this.trpc.procedure
        .input(
          z.object({
            name: z.string().min(3),
            password: z.string(), // need to hash the password here
            email: z.string().email(),
          }),
        )
        // .output(
        //   z.object({
        //     name: z.string().min(3),
        //     password: z.string(),
        //     email: z.string().email(),
        //     id: z.string().uuid(),
        //     role: z.enum(['Intern', 'Expert', 'Admin', 'SuperAdmin']),
        //     lto: z.date(),
        //     projects: z.array(Project).optional(),
        //   }),
        // )
        .mutation(async ({ input }) => {
          const { email, name, password } = input;

          // check if data is null
          if (!email || !password || !name) {
            throw new TRPCError({
              message: 'Necessary data missing!',
              code: 'BAD_REQUEST',
            });
          }

          // TODO - hashing doesn't work
          // hashing the password
          let passwordHash: string = '';
          b.hash(password, 10, (err, hash) => {
            if (err) {
              console.log(err);
              return;
            }
            passwordHash = hash;
          });

          // create a new user
          const user = await this.users.create({
            name,
            email,
            password: passwordHash,
            id: v4(),
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

          const output = {
            name: user.name,
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            // projects: user.projects,
            lto: user.lto,
          };

          return {
            name: output.name,
            id: output.id,
            email: output.email,
            password: output.password,
            // role: user.role,
            // projects: user.projects,
            lto: output.lto,
          };
        }),
      // delete user be his / her id
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

          return {};
        }),
      // update a user
      update: this.trpc.procedure
        .input(
          z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            password: z.string().optional(),
            email: z.string().email().optional(),
            role: z.string().optional(), // get Role enum type from string
            projects: z.array(
              z.string().uuid({ message: 'A project id was not a UUID!' }),
            ), // TODO - list of ids of some projects -> loop through projects & reassign them + check if all ids belong to a project -> in project service
          }),
        )
        .mutation(async ({ input }) => {
          const { id, name, password, role, /*projects*/ email } = input;

          // check for right enum type of the role input
          if (!isMember(role)) {
            throw new TRPCError({
              message: `Role ${role} does not exist!`,
              code: 'BAD_REQUEST',
            });
          }

          const convertedRole = stringToRole(role);

          // TODO -  get the projects with these ids

          const user = this.users.update(id, {
            name: name,
            email,
            password,
            role: convertedRole,
            //projects,
          });

          return {
            updatedUser: user,
          };
        }),
    }),
    // --------------------------
    //
    //
    //
    // project route
    project: this.trpc.router({}),
    // ------------
    //
    // task route
    task: this.trpc.router({}),
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
