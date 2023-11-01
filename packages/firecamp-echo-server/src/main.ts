import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  app.getUrl().then((url) => console.log(url));
}
bootstrap();
