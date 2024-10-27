import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { IsValidDate } from "src/validators/data.validator";

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: string

  @IsValidDate()
  @IsNotEmpty()
  @ApiProperty()
  init: string

  @IsValidDate()
  @IsNotEmpty()
  @ApiProperty()
  end: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isPublic: boolean
}
