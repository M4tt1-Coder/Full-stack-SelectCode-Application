import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

// TODO - Add a context definition

@Injectable()
export class TrpcService {
  trpc = initTRPC.create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
}
