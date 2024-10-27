import { Injectable } from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDTO } from './dto/create.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async listEvents(params: { skip?: number; take?: number, orderBy?: string, me?: string }, user: UserType) {
    const { skip, take, orderBy, me } = params

    const filterMe = me ? { userId: user.id } : {};

    return this.prismaService.event.findMany({
      skip: params.skip,
      take: params.take,
      // orderBy: params.orderBy,
      where: {
        ...filterMe,
      },
    });
  }

  async createEvent({ title, description, init, end, isPublic, categoryId }: CreateEventDTO, user: UserType) {
    return this.prismaService.event.create({
      data: {
        title,
        description,
        init: new Date(init),
        end: new Date(end),
        isPublic,
        category: {
          connect: { id: categoryId }
        },
        createdBy: {
          connect: { id: user.id }
        }
      },
    });
  }

  async listCategories() {
    return this.prismaService.category.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }
}
