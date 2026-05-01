import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsUUID()
  pollId: string;

  @IsNotEmpty()
  @IsUUID()
  optionId: string;
}

export class VoteResponseDto {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  state: string;
  createdAt: Date;
}
