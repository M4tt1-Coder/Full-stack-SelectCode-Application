import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';

// trpc docs -> https://trpc.io/docs/quickstart

@Injectable()
export class TrpcRouter {
  // using dependency injection -> can use services
  constructor(private readonly trpc: TrpcService) {}

  appRouter = this.trpc.router({
    test: this.trpc.procedure
      .input(z.object({ data: z.string() }))
      .query(({ input }) => {
        const { data } = input;

        return {
          greeting: `Okay so you have ${data} in your home!`,
        };
      }),
    hello: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        }),
      ) // thats signalizes a get request 'query'
      .query(({ input }) => {
        const { name } = input;
        return {
          greeting: `Hello to ${name ? name : `Bilbo`}`,
        };
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
