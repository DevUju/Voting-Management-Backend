import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from './poll-option.entity';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private readonly pollOptionRepo: Repository<PollOption>,
  ) {}

  async create(data: Partial<PollOption>): Promise<PollOption> {
    const option = this.pollOptionRepo.create(data);
    return this.pollOptionRepo.save(option);
  }

  async findAll(): Promise<PollOption[]> {
    return this.pollOptionRepo.find({ relations: ['poll', 'votes'] });
  }

  async findOne(id: string): Promise<PollOption | null> {
    return this.pollOptionRepo.findOne({
      where: { id },
      relations: ['poll', 'votes'],
    });
  }

  async update(id: string, data: Partial<PollOption>): Promise<PollOption> {
    await this.pollOptionRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.pollOptionRepo.delete(id);
  }
}
