import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Poll, PollStatus } from "./poll.entity";
import { PollOption } from "../poll-options/poll-option.entity";
import { CreatePollDto, UpdatePollDto, PollResponseDto } from "./poll.dto";

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
  ) {}

  async createPoll(
    createPollDto: CreatePollDto,
    userId: string,
  ): Promise<PollResponseDto> {
    const { title, description, options } = createPollDto;

    const poll = this.pollsRepository.create({
      title,
      description,
      status: PollStatus.ACTIVE,
      createdBy: userId,
    });

    const savedPoll = await this.pollsRepository.save(poll);

    const pollOptions = options.map((optionText) =>
      this.pollOptionsRepository.create({
        pollId: savedPoll.id,
        optionText,
      }),
    );

    await this.pollOptionsRepository.save(pollOptions);
    savedPoll.options = pollOptions;

    return this.mapPollToResponse(savedPoll);
  }

  async getAllPolls(): Promise<PollResponseDto[]> {
    const polls = await this.pollsRepository.find({
      relations: ["options"],
      order: { createdAt: "DESC" },
    });
    return polls.map((poll) => this.mapPollToResponse(poll));
  }

  async getActivePoll(): Promise<PollResponseDto[]> {
    const polls = await this.pollsRepository.find({
      where: { status: PollStatus.ACTIVE },
      relations: ["options"],
      order: { createdAt: "DESC" },
    });
    return polls.map((poll) => this.mapPollToResponse(poll));
  }

  async getPollById(pollId: string): Promise<PollResponseDto> {
    const poll = await this.pollsRepository.findOne({
      where: { id: pollId },
      relations: ["options"],
    });

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    return this.mapPollToResponse(poll);
  }

  async updatePoll(
    pollId: string,
    updatePollDto: UpdatePollDto,
    userId: string,
  ): Promise<PollResponseDto> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId } });

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    if (poll.createdBy !== userId) {
      throw new ForbiddenException("You can only update your own polls");
    }

    Object.assign(poll, updatePollDto);
    const updatedPoll = await this.pollsRepository.save(poll);

    return this.getPollById(updatedPoll.id);
  }

  async deletePoll(pollId: string, userId: string): Promise<void> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId } });

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    if (poll.createdBy !== userId) {
      throw new ForbiddenException("You can only delete your own polls");
    }

    await this.pollsRepository.delete(pollId);
  }

  async closePoll(pollId: string, userId: string): Promise<PollResponseDto> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId } });

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    if (poll.createdBy !== userId) {
      throw new ForbiddenException("You can only close your own polls");
    }

    poll.status = PollStatus.CLOSED;
    await this.pollsRepository.save(poll);

    return this.getPollById(pollId);
  }

  async reopenPoll(pollId: string, userId: string): Promise<PollResponseDto> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId } });

    if (!poll) {
      throw new NotFoundException("Poll not found");
    }

    if (poll.createdBy !== userId) {
      throw new ForbiddenException("You can only reopen your own polls");
    }

    poll.status = PollStatus.ACTIVE;
    await this.pollsRepository.save(poll);

    return this.getPollById(pollId);
  }

  private mapPollToResponse(poll: Poll): PollResponseDto {
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      options: poll.options.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
      })),
    };
  }
}
