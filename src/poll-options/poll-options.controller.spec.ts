import { Test, TestingModule } from '@nestjs/testing';
import { PollOptionsController } from './poll-options.controller';

describe('PollOptionsController', () => {
  let controller: PollOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollOptionsController],
    }).compile();

    controller = module.get<PollOptionsController>(PollOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
