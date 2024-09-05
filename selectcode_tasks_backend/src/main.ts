import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from './trpc/trpc.router';

// https://www.tomray.dev/nestjs-nextjs-trpc [for trpc setup]

/**
 * Starts the server
 *
 * Activates the trpc server
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // enable trpc
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);
  await app.listen(4000);
}
bootstrap();
