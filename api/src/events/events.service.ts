import { BadRequestException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDTO } from './dto/create.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { AnswerInviteDto } from './dto/answer-invite.dto';
import OpenAI from 'openai';

function validateEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
}

@Injectable()
export class EventsService {
  private readonly openai: OpenAI;
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async listEvents(params: { skip?: number; take?: number, orderBy?: string, categories?: string, me?: boolean }, user: UserType = null) {
    const { skip, take, orderBy, me } = params
    const categories = params.categories ? params.categories.split(',') : null

    const filterMe = me ? { userId: user.id } : { };

    const events = await this.prismaService.event.findMany({
      skip: params.skip,
      take: params.take,
      // orderBy: params.orderBy,
      where: {
        ...filterMe,
        OR: [
          { end: { gte: new Date() } },
          { end: null }
        ],
        ...(categories !== null ? { categoryId: {
          in: categories
        } } : {})
      },
      select: {
        id: true,
        title: true,
        description: true,
        init: true,
        end: true,
        isPublic: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    return { events: events ?? [] }
  }

  async detailEvent(user: UserType, eventId: string) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId
      },
      select: {
        id: true,
        title: true,
        description: true,
        init: true,
        end: true,
        isPublic: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        invite: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                fullname: true
              }
            },
            rejectedAt: true,
            acceptedAt: true,
            createdAt: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    if (event.createdBy.id !== user.id)
      throw new ForbiddenException('Você não tem permissão para visualizar este evento');

    return event
  }

  async createEvent({ title, description, init, end, isPublic, categoryId }: CreateEventDTO, user: UserType) {
    return this.prismaService.event.create({
      data: {
        title,
        description,
        init: new Date(init),
        end: end ? new Date(end) : null,
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

  async inviteUser(requestingUser: UserType, { eventId, email: invitedEmail, message }: InviteUserDto) {
    const isValidEmail = validateEmail(invitedEmail);
    if (!isValidEmail) {
      throw new UnprocessableEntityException('E-mail inválido');
    }

    const event = await this.prismaService.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      throw new UnprocessableEntityException('Evento não encontrado');
    }

    if (event.userId !== requestingUser.id) {
      throw new ForbiddenException('Você não tem permissão para convidar usuários para este evento');
    }

    const invitedUser = await this.prismaService.user.findFirst({
      where: { email: invitedEmail }
    })

    if (!invitedUser) {
      throw new UnprocessableEntityException('Usuário não encontrado');
    }

    const existingInvite = await this.prismaService.invite.findFirst({
      where: {
        eventId,
        userId: invitedUser.id
      }
    });

    if (existingInvite) {
      throw new UnprocessableEntityException('Usuário já convidado');
    }

    const invite = await this.prismaService.invite.create({
      data: {
        eventId,
        userId: invitedUser.id,
        message,
      }
    });

    return invite
  }

  async listCategories() {
    const categories = await this.prismaService.category.findMany({
      select: {
        id: true,
        name: true
      }
    });
    return categories ?? []
  }

  async answerInvite(user: UserType, answerData: AnswerInviteDto) {
    if (answerData.answer !== "deny" && answerData.answer !== "accept") {
      throw new BadRequestException('Resposta inválida');
    }
    const invite = await this.prismaService.invite.findFirst({
      where: {
        id: answerData.inviteId,
      }
    });

    if (!invite || invite.userId !== user.id) {
      throw new ForbiddenException('Você não tem permissão para responder este convite');
    }

    if (invite.acceptedAt || invite.rejectedAt) {
      throw new UnprocessableEntityException('Convite já respondido');
    }

    await this.prismaService.invite.update({
      where: {
        id: invite.id
      },
      data: {
        [answerData.answer === "accept" ? "acceptedAt" : "rejectedAt"]: new Date()
      }
    });
  }


  async chat(conversationDto: any): Promise<string> {
    const { conversation, eventTitle } = conversationDto;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um assistente especializado em criar convites personalizados para eventos.
O evento atual é "${eventTitle}". Seja criativo e amigável nas respostas.`
        },
        ...conversation
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content || "Desculpe, não consegui gerar um convite no momento."
  }
}
