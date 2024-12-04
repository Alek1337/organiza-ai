import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AnswerInviteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  inviteId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  answer: string
}
