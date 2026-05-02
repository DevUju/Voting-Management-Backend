import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PollOptionsService } from './poll-options.service';
import { PollOption } from './poll-option.entity';

@Controller('poll-options')
export class PollOptionsController {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  @Post()
  async create(@Body() body: Partial<PollOption>) {
    return this.pollOptionsService.create(body);
  }

  @Get()
  async findAll() {
    return this.pollOptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pollOptionsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<PollOption>) {
    return this.pollOptionsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pollOptionsService.remove(id);
  }
}
