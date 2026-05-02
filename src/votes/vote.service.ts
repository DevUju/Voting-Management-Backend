import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vote } from "./vote.entity";
import { CreateVoteDto, VoteResponseDto } from "./vote.dto";

export interface VoteResult {
  optionId: string;
  optionText: string;
  totalVotes: number;
  stateBreakdown: {
    [state: string]: number;
  };
}

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async createVote(
    createVoteDto: CreateVoteDto,
    userId: string,
    state: string,
  ): Promise<VoteResponseDto> {
    const { pollId, optionId } = createVoteDto;

    // Check if user already voted on this poll
    const existingVote = await this.votesRepository.findOne({
      where: { user: { id: userId }, poll: { id: pollId } },
    });

    if (existingVote) {
      throw new BadRequestException("You have already voted on this poll");
    }

    const vote = this.votesRepository.create({
      user: { id: userId },
      poll: { id: pollId },
      option: { id: optionId },
      state,
    });

    const savedVote = await this.votesRepository.save(vote);
    return this.mapVoteToResponse(savedVote);
  }

  async getVotesByPoll(pollId: string): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { poll: { id: pollId } },
      relations: ["option"],
    });
  }

  async getPollResults(pollId: string): Promise<VoteResult[]> {
    const votes = await this.votesRepository
      .createQueryBuilder("vote")
      .leftJoinAndSelect("vote.option", "option")
      .where("vote.pollId = :pollId", { pollId })
      .getMany();

    if (votes.length === 0) {
      return [];
    }

    const resultsMap = new Map<string, VoteResult>();

    votes.forEach((vote) => {
      const optionId = vote.option?.id;
      if (!resultsMap.has(optionId)) {
        resultsMap.set(optionId, {
          optionId,
          optionText: vote.option?.optionText || "",
          totalVotes: 0,
          stateBreakdown: {},
        });
      }

      const result = resultsMap.get(optionId);
      result.totalVotes++;
      result.stateBreakdown[vote.state] =
        (result.stateBreakdown[vote.state] || 0) + 1;
    });

    return Array.from(resultsMap.values());
  }

  async getPollResultsByState(
    pollId: string,
    state: string,
  ): Promise<VoteResult[]> {
    const allResults = await this.getPollResults(pollId);
    return allResults.map((result) => ({
      ...result,
      totalVotes: result.stateBreakdown[state] || 0,
      stateBreakdown: { [state]: result.stateBreakdown[state] || 0 },
    }));
  }

  async getUserVoteOnPoll(
    userId: string,
    pollId: string,
  ): Promise<VoteResponseDto | null> {
    const vote = await this.votesRepository.findOne({
      where: { user: { id: userId }, poll: { id: pollId } },
    });
    return vote ? this.mapVoteToResponse(vote) : null;
  }

  private mapVoteToResponse(vote: Vote): VoteResponseDto {
    return {
      id: vote.id,
      userId: vote.user.id,
      pollId: vote.poll.id,
      optionId: vote.option.id,
      state: vote.state,
      createdAt: vote.createdAt,
    };
  }
}
