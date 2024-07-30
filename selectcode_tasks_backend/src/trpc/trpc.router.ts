import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TRPCError } from '@trpc/server';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';
import { defaultRole, isMember, stringToRole } from 'lib/enums/roles';
import { SHA256 } from 'crypto-js';

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
  ) {}

  // TODO - test the endpoints
  // TODO - Setup all endpoints

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
    project: this.trpc.router({}),
    // ------------
    //
    //
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
