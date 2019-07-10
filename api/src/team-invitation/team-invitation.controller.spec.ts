import { Test, TestingModule } from '@nestjs/testing';
import { TeamInvitationController } from './team-invitation.controller';

describe('TeamInvitation Controller', () => {
  let controller: TeamInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamInvitationController],
    }).compile();

    controller = module.get<TeamInvitationController>(TeamInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
