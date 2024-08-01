import { Test, TestingModule } from '@nestjs/testing';
import { TrpcRouter } from './trpc.router';

describe('tRPC endpoint tests', () => {
  let router: TrpcRouter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrpcRouter],
    }).compile();

    router = module.get<TrpcRouter>(TrpcRouter);
  });

  describe('project endpoints', async () => {
    const caller = router.appRouter;

    it('create route should return status code 400 ', async () => {
      const res = caller.project.create({
        ctx: {},
        rawInput: {},
        path: '/',
        type: 'mutation',
      });

      expect(res).toHaveBeenCalledWith(400);
    });
  });
});
