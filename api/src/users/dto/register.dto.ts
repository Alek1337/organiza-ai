import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail, IsNotEmpty, IsOptional, IsString, MinLength,
} from 'class-validator';
import { IsValidDate } from '../../validators/data.validator';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  @ApiProperty()
  password: string;

  @IsValidDate({ message: 'Data de nascimento inválida' })
  @IsNotEmpty()
  @ApiProperty()
  birthdate: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;
}
