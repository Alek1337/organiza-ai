import type { Response as ResponseType } from 'express';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) { }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  async login(res: ResponseType, email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findByEmailAndPassword(email, password);
    if (!user) {
      throw new NotFoundException(`Nenhum usuário encontrado com o email ${email}`);
    }

    const twelveHours = 12 * 60 * 60 * 1000;

    res.cookie('session_token', this.jwtService.sign({ userId: user.id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'none',
      expires: new Date(Date.now() + twelveHours),
    });

    return {
      token: this.jwtService.sign({ userId: user.id }),
    };
  }

  async logout (res: ResponseType) {
    res.clearCookie('session_token');
  }
}
