// votes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), AuthModule],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VotesModule {}
