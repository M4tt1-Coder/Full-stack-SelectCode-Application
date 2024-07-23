import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//import { initTRPC } from '@trpc/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
