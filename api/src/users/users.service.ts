import { createHash } from 'crypto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { RegisterUserDTO } from './dto/register.dto';

function hashPassword(password: string): string {
  const hash = createHash('sha256').update(password).digest('hex')
  return hash
}

function parsePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmailAndPassword(email: string, password: string) {
    const hashedPassword = hashPassword(password);

    return this.prisma.user.findFirst({
      where: {
        email,
        password: hashedPassword,
      },
    });
  }

  async listUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(user: RegisterUserDTO): Promise<void> {
    const hashedPassword = hashPassword(user.password);
    const parsedPhone = user.phone ? parsePhone(user.phone) : null;

    try {
    await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        fullname: user.fullname,
        birthdate: new Date(user.birthdate),
        phone: parsedPhone,
      },
    });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('E-mail já cadastrado');
        }
      }
    }
  }

  async searchUser(email: string): Promise<{ user: User }> {
    const user = await this.prisma.user.findFirst({
      where: { email }
    })

    return { user }
  }
}
