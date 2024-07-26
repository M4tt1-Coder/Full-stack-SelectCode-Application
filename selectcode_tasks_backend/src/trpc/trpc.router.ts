import { INestApplication, Injectable } from '@nestjs/common';
// import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';

// import { TRPCError } from '@trpc/server';

// trpc docs -> https://trpc.io/docs/quickstart

@Injectable()
export class TrpcRouter {
  // using dependency injection -> can use services
  constructor(private readonly trpc: TrpcService) {}

  appRouter = this.trpc.router({
    // user route
    // user: this.trpc.router({
    //   // get endpoint for user
    //   get: this.trpc.procedure
    //     .input(
    //       z.object({
    //         // represents a UUID
    //         // check if the uuid is a valid UUID
    //         // check if the input is a valid string in general
    //         id: z
    //           .string({
    //             message: 'Invalid string datatype ',
    //           })
    //           .uuid({
    //             message: 'Invalid UUID format!',
    //           }),
    //       }),
    //     )
    //     .query(({ input }) => {
    //       // destructure the input
    //       const { id } = input;

    //       // get the user wheree the input id is the same
    //       const user = this.db.user.findUnique({ where: { id: id } });

    //       // make sure the user is not null
    //       if (!user) {
    //         throw new TRPCError({
    //           message: 'Could not find an USER!',
    //           code: 'NOT_FOUND',
    //         });
    //       }

    //       return { user };
    //     }),
    //   // get all user OR all with one role
    //   getAll: this.trpc.procedure
    //     .input(
    //       z.object({
    //         role: z
    //           .enum(['Intern', 'Expert', 'Admin', 'SuperAdmin'])
    //           .optional(),
    //       }),
    //     )
    //     .query(({ input }) => {
    //       const { role } = input;
    //       if (role) {
    //         return this.db.user.findMany({ where: { role } });
    //       }
    //       return this.db.user.findMany();
    //     }),
    //
    //}),
    // ------------
    //x
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
