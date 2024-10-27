import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthEntity } from './entity/health.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOkResponse({ description: 'Health check', type: HealthEntity })
  async healthCheck(): Promise<{ status: string }> {
    return this.appService.healthCheck();
  }
}
