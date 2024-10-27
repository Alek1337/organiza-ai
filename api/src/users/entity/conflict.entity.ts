import { ApiProperty } from '@nestjs/swagger';

export class UserConflictEntity {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}

