import { Module } from '@nestjs/common';
import { RestController } from './rest.controller';

@Module({
  providers: [],
  controllers: [RestController],
})
export class RestModule { }
