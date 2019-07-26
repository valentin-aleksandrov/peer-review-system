import { Controller, Post, UseGuards, Body, ValidationPipe, Delete, Param, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateTeamDTO } from './models/create-team.dto';
import { ShowTeamDTO } from './models/show-team.dto';
import { SimpleTeamInfoDTO } from './models/simple-team-info.dto';

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
    console.log('body controller ',body);
    
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

  @Get('/user/:id')
  @UseGuards(AuthGuard())
  public async getUserTeams(
  @Param('id') userId: string,
  ): Promise<SimpleTeamInfoDTO[]> {
    return await this.teamService.getUserTeams(userId);
  }

}
