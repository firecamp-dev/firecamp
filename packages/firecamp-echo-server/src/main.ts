import { NestFactory } from '@nestjs/core';
import { WsAdapter, } from '@nestjs/platform-ws';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useWebSocketAdapter(new WsAdapter(app));
  // app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
