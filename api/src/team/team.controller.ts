import { Controller, Post, UseGuards, Body, ValidationPipe, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateTeamDTO } from './models/create-team.dto';
import { ShowTeamDTO } from './models/show-team.dto';

@Controller('api/team')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
      ) {}

    @Post()
    @UseGuards(AuthGuard())
    public async createTeam(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: CreateTeamDTO,
    @SessionUser() user: User,
  ): Promise<ShowTeamDTO> {
    return await this.teamService.createTeam(body, user);
  }
    @Delete(':id')
    @UseGuards(AuthGuard())
    public async leaveTeam(
    @Param('id') teamId: string,
    @SessionUser() user: User,
  ): Promise<ShowTeamDTO> {
    return await this.teamService.leaveTeam(teamId, user);
  }

}
