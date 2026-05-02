import { IsNotEmpty, IsString, IsArray, ArrayMinSize, ArrayMaxSize, IsOptional, IsEnum } from 'class-validator';
import { PollStatus } from './poll.entity';

export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  options: string[];
}

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(PollStatus)
  status: PollStatus;
}

export class PollResponseDto {
  id: string;
  title: string;
  description: string;
  status: PollStatus;
  createdAt: Date;
  updatedAt: Date;
  options: {
    id: string;
    optionText: string;
  }[];
}
