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
  Patch,
} from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.decorator';
import { CreateEventDTO } from './dto/create.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { AnswerInviteDto } from './dto/answer-invite.dto';
import { IsArray, IsString, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Message {
  @IsString()
  role: 'user' | 'assistant'

  @IsString()
  content: string
}

class ConversationDto  {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Message)
  conversation: Message[]

  @IsString()
  eventTitle: string

  @IsString()
  eventId: string
}

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) {}
  @Get()
  @HttpCode(200)
  async listEvents(@Query() { skip, take, orderBy, categories, meId }) {
    skip = skip ? parseInt(skip) : undefined;
    take = take ? parseInt(take) : undefined;
    return await this.eventsService.listEvents({ skip, take, orderBy, categories, me: false, meId });
  }

  @Get("mine")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async listUserEvents(@Query() { page, limit, orderBy }, @User() user: UserType) {
    const skip = page ? parseInt(page) : undefined;
    const take = limit ? parseInt(page) : undefined;
    return await this.eventsService.listEvents({ skip, take, orderBy, me: true }, user);
  }

  @Get('categories')
  @HttpCode(200)
  async listCategories() {
    return await this.eventsService.listCategories();
  }

  @Get(':eventId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getEvent(@User() user: UserType, @Param('eventId') eventId: string) {
    return await this.eventsService.detailEvent(user, eventId);
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

  @Patch('invite/answer')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async answerInvite(@User() user: UserType, @Body() answerInviteData: AnswerInviteDto) {
    return this.eventsService.answerInvite(user, answerInviteData);
  }

  @Post(':eventId/confirm')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async confirmPresence(@User() user: UserType, @Param("eventId") eventId: string) {
    return this.eventsService.confirmPresence(user, eventId);
  }

  @Post('chat')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async chat(@Body() conversation: ConversationDto) {
    const message = await this.eventsService.chat(conversation);
    return { message }
  }
}
