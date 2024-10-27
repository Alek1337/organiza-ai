import type { Response as ResponseType } from 'express';
import {
  Body,
  Controller,
  Post,
  Res
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() { email, password }: LoginDto, @Res({ passthrough: true }) res: ResponseType): Promise<AuthEntity> {
    return this.authService.login(res, email, password);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: ResponseType) {
    return await this.authService.logout(res);
  }
}
