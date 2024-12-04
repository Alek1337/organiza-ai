import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from './entity/user.entity';
import { RegisterUserDTO } from './dto/register.dto';
import { UserConflictEntity } from './entity/conflict.entity';
import { User } from 'src/user/user.decorator';
import { User as UserType } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserEntity })
  async getMe(@User() user: UserType) {
    return this.usersService.getMe(user)
  }

  @Post('/register')
  @ApiCreatedResponse()
  @ApiConflictResponse( { type: UserConflictEntity })
  async register(@Body() { email, password, fullname, birthdate, phone }: RegisterUserDTO) {
    return this.usersService.createUser({
      email,
      password,
      fullname,
      birthdate,
      phone,
    })
  }

  @Get('/search')
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  async search(@Request() req: Request, @Query() { email }) {
    return this.usersService.searchUser(email);
  }
}
