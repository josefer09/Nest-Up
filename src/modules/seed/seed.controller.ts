import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Populate the database.' })
  @ApiResponse({
    status: 201,
    description: 'Seed executed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
