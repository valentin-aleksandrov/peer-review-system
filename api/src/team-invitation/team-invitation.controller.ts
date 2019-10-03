import { Controller, Post, UseGuards, ValidationPipe, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { User } from 'src/entities/user.entity';
import { TeamInvitationService } from './team-invitation.service';
import { AddTeamInvitationDTO } from './models/add-team-invitation.dto';
import { ShowTeamInvitationDTO } from './models/show-team-invitation.dto';

@Controller()
export class TeamInvitationController {
    constructor(
        private readonly teamInvitationService: TeamInvitationService,
      ) {}

    @Post('api/team-invitation')
    @UseGuards(AuthGuard())
    public async createInvitation(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: AddTeamInvitationDTO,
    @SessionUser() user: User,
  ): Promise<ShowTeamInvitationDTO> {
    return await this.teamInvitationService.createTeamInvitation(body, user);
  }

  @Put('api/team-invitation/:id')
    @UseGuards(AuthGuard())
    public async acceptInvitation(
    @Param('id') id: string,
  ): Promise<ShowTeamInvitationDTO> {
    return await this.teamInvitationService.acceptInvitation(id);
  }

  @Delete('api/team-invitation/:id')
    @UseGuards(AuthGuard())
    public async rejectInvitation(
    @Param('id') id: string,
  ): Promise<ShowTeamInvitationDTO> {
    return await this.teamInvitationService.rejectInvitation(id);
  }

  
  @Get('api/users/:userId/active-invitations')
  @UseGuards(AuthGuard())
    async getActiveInvitations(
      @Param('userId') userId: string,
    ): Promise<any> {
      return this.teamInvitationService.getActiveInvitationsByUserId(userId);
    }

}
