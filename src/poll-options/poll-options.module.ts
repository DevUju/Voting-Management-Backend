import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from './poll-option.entity';
import { PollOptionsService } from './poll-options.service';
import { PollOptionsController } from './poll-options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption])],
  providers: [PollOptionsService],
  controllers: [PollOptionsController],
  exports: [PollOptionsService],
})
export class PollOptionsModule {}
