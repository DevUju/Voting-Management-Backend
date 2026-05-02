// polls.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption]), AuthModule],
  providers: [PollService],
  controllers: [PollController],
  exports: [PollService],
})
export class PollsModule {}
