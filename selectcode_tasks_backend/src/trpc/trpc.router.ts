import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
// import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

// trpc docs -> https://trpc.io/docs/quickstart

@Injectable()
export class TrpcRouter {
  // using dependency injection -> can use services
  constructor(
    private readonly trpc: TrpcService,
    private readonly db: DatabaseService,
  ) {}

  appRouter = this.trpc.router({
    // user route
    user: this.trpc.router({
      get: this.trpc.procedure.query(() => {}),
    }),
    // project route
    project: this.trpc.router({}),
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
