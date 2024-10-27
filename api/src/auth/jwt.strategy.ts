import type { Request as RequestType } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtSecret } from './auth.module';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    console.log(req.cookies)
    if (
      req.cookies &&
      'session_token' in req.cookies &&
      req.cookies.session_token.length > 0
    ) {
      return req.cookies.session_token;
    }
    return null;
  }

  async validate(payload: { userId: string }) {
    const user = await this.usersService.getUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password
    return user;
  }
}

