import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { PollService } from "../polls/poll.service";
import { CreatePollDto, UpdatePollDto, PollResponseDto } from "./poll.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@Controller("polls")
export class PollController {
  constructor(private pollService: PollService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @Request() req,
  ): Promise<PollResponseDto> {
    if (
      !createPollDto.options ||
      createPollDto.options.length < 2 ||
      createPollDto.options.length > 4
    ) {
      throw new BadRequestException("Poll must have between 2 and 4 options");
    }
    return this.pollService.createPoll(createPollDto, req.user.sub);
  }

  @Get()
  async getAllPolls(): Promise<PollResponseDto[]> {
    return this.pollService.getAllPolls();
  }

  @Get("active")
  async getActivePolls(): Promise<PollResponseDto[]> {
    return this.pollService.getActivePoll();
  }

  @Get(":id")
  async getPollById(@Param("id") pollId: string): Promise<PollResponseDto> {
    return this.pollService.getPollById(pollId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updatePoll(
    @Param("id") pollId: string,
    @Body() updatePollDto: UpdatePollDto,
    @Request() req,
  ): Promise<PollResponseDto> {
    return this.pollService.updatePoll(pollId, updatePollDto, req.user.sub);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deletePoll(
    @Param("id") pollId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.pollService.deletePoll(pollId, req.user.sub);
    return { message: "Poll deleted successfully" };
  }

  @Patch(":id/close")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async closePoll(
    @Param("id") pollId: string,
    @Request() req,
  ): Promise<PollResponseDto> {
    return this.pollService.closePoll(pollId, req.user.sub);
  }

  @Post(":id/reopen")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async reopenPoll(
    @Param("id") pollId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.pollService.reopenPoll(pollId, req.user.sub);
    return { message: "Poll reopened successfully" };
  }
}
