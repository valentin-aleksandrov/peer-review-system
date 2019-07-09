import { Controller, Post, UseGuards, ValidationPipe, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { User } from 'src/entities/user.entity';
import { TeamInvitationService } from './team-invitation.service';

@Controller('api/team-invitation')
export class TeamInvitationController {
    constructor(
        private readonly teamInvitationService: TeamInvitationService,
      ) {}

    @Post()
    @UseGuards(AuthGuard())
    public async createInvitation(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: string,
    @SessionUser() user: User,
  ): Promise<any> {
    return await this.teamInvitationService.createTeamInvitation(body, user);
  }


}
