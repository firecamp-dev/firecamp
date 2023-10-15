import { NestFactory } from '@nestjs/core';
import { WsAdapter, } from '@nestjs/platform-ws';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

const shouldCompress = (req, res) =>{
  if (req.path === '/gzip'){
    console.log('compressing')
    return true
  }
  return false
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useWebSocketAdapter(new WsAdapter(app));
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser())
  // app.use(compression({threshold:0,filter:() =>true }))

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  app.getUrl().then(url => console.log(url))
}
bootstrap();
