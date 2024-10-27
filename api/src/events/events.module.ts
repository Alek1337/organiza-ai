import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [EventsService, PrismaService, UsersService],
  controllers: [EventsController]
})
export class EventsModule {}
