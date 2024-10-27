import {
    Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decorator';
import { CreateEventDTO } from './dto/create.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async listEvents(@Query() { skip, take, orderBy, me }, @User() user: UserType) {
    skip = skip ? parseInt(skip) : undefined;
    take = take ? parseInt(take) : undefined;
    return await this.eventsService.listEvents({ skip, take, orderBy, me }, user);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createEvent(@User() user: UserType, @Body() data: CreateEventDTO) {
    await this.eventsService.createEvent(data, user);
  }

  @Get('categories')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async listCategories() {
    return await this.eventsService.listCategories();
  }
}
