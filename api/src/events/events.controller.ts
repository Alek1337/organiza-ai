import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express'
import type { User as UserType } from '@prisma/client';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { CreateEventDTO } from './dto/create.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) {}
  @Get()
  @HttpCode(200)
  async listEvents(@Query() { skip, take, orderBy }) {
    skip = skip ? parseInt(skip) : undefined;
    take = take ? parseInt(take) : undefined;
    return await this.eventsService.listEvents({ skip, take, orderBy, me: false });
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async listUserEvents(@Query() { skip, take, orderBy }, @User() user: UserType) {
    skip = skip ? parseInt(skip) : undefined;
    take = take ? parseInt(take) : undefined;
    return await this.eventsService.listEvents({ skip, take, orderBy, me: true }, user);
  }

  @Get('categories')
  @HttpCode(200)
  async listCategories() {
    return await this.eventsService.listCategories();
  }

  @Get(':eventId')
  @HttpCode(200)
  async getEvent(@Param('eventId') eventId: string) {
    return await this.eventsService.getEvent(eventId);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createEvent(@User() user: UserType, @Body() data: CreateEventDTO) {
    return await this.eventsService.createEvent(data, user);
  }

  @Post('invite')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async inviteUser(@User() user: UserType, @Body() inviteRelatedData: InviteUserDto) {
    return await this.eventsService.inviteUser(user, inviteRelatedData);
  }
}
