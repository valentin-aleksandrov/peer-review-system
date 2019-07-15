import { Test, TestingModule } from '@nestjs/testing';
import { ReviewRequestsController } from './review-requests.controller';

describe('ReviewRequests Controller', () => {
  let controller: ReviewRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewRequestsController],
    }).compile();

    controller = module.get<ReviewRequestsController>(ReviewRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
