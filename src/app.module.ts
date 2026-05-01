import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { User } from './entities/user.entity';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { Vote } from './entities/vote.entity';

import { AuthService } from './services/auth.service';
import { PollService } from './services/poll.service';
import { VoteService } from './services/vote.service';

import { AuthController } from './controllers/auth.controller';
import { PollController } from './controllers/poll.controller';
import { VoteController } from './controllers/vote.controller';

import { databaseConfig } from './config/database.config';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Poll, PollOption, Vote]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600') },
    }),
  ],
  controllers: [AuthController, PollController, VoteController],
  providers: [AuthService, PollService, VoteService],
})
export class AppModule {}
