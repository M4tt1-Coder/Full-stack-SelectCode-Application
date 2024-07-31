import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

// TODO - Add a context -> for access authentication maybe

/**
 * _ Provider _
 *
 * Initialization function for the tRPC server
 */
@Injectable()
export class TrpcService {
  trpc = initTRPC.create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  middleware = this.trpc.middleware;
}
