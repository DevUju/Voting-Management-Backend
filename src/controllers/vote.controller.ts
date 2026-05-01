import { Controller, Post, Get, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { VoteService, VoteResult } from '../services/vote.service';
import { CreateVoteDto, VoteResponseDto } from '../dto/vote.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NonAdminGuard } from '../guards/non-admin.guard';

@Controller('api/votes')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, NonAdminGuard)
  async createVote(@Body() createVoteDto: CreateVoteDto, @Request() req): Promise<VoteResponseDto> {
    const user = req.user;
    return this.voteService.createVote(createVoteDto, user.sub, user.state);
  }

  @Get('poll/:pollId')
  async getVotesByPoll(@Param('pollId') pollId: string): Promise<any[]> {
    const votes = await this.voteService.getVotesByPoll(pollId);
    return votes.map((vote) => ({
      id: vote.id,
      userId: vote.userId,
      pollId: vote.pollId,
      optionId: vote.optionId,
      state: vote.state,
      createdAt: vote.createdAt,
    }));
  }

  @Get('poll/:pollId/results')
  async getPollResults(@Param('pollId') pollId: string): Promise<VoteResult[]> {
    return this.voteService.getPollResults(pollId);
  }

  @Get('poll/:pollId/results/by-state')
  async getPollResultsByState(@Param('pollId') pollId: string, @Query('state') state: string): Promise<VoteResult[]> {
    return this.voteService.getPollResultsByState(pollId, state);
  }

  @Get('user/:userId/poll/:pollId')
  async getUserVoteOnPoll(@Param('userId') userId: string, @Param('pollId') pollId: string): Promise<VoteResponseDto> {
    const vote = await this.voteService.getUserVoteOnPoll(userId, pollId);
    if (!vote) {
      return null;
    }
    return vote;
  }
}
