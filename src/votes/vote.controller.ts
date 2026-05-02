import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { VoteService } from "./vote.service";
import { CreateVoteDto, VoteResponseDto } from "./vote.dto";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

type AuthenticatedRequest = Request & { user?: any };

@Controller("votes")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createVote(
    @Body() createVoteDto: CreateVoteDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<VoteResponseDto> {
    return this.voteService.createVote(
      createVoteDto,
      "test-user-id",
      "test-state",
    );
  }

  @Get("poll/:pollId")
  async getVotesByPoll(@Param("pollId") pollId: string) {
    return this.voteService.getVotesByPoll(pollId);
  }

  @Get("poll/:pollId/results")
  async getPollResults(@Param("pollId") pollId: string) {
    return this.voteService.getPollResults(pollId);
  }

  @Get("poll/:pollId/results/state/:state")
  async getPollResultsByState(
    @Param("pollId") pollId: string,
    @Param("state") state: string,
  ) {
    return this.voteService.getPollResultsByState(pollId, state);
  }

  @UseGuards(JwtAuthGuard)
  @Get("poll/:pollId/me")
  async getUserVote(@Param("pollId") pollId: string, @Req() req: Request) {
    return this.voteService.getUserVoteOnPoll("test-user-id", pollId);
  }
}
