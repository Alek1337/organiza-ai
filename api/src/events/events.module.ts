import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [EventsService, PrismaService, UsersService],
  controllers: [EventsController]
})
export class EventsModule {}
