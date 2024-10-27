import { ApiProperty } from '@nestjs/swagger';

export class HealthEntity {
  @ApiProperty()
  status: string;
}

