import { Controller, Post, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';
import { SessionUser } from 'src/decorators/session-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateTeamDTO } from './models/create-team.dto';

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
  ): Promise<any> {
    return await this.teamService.createTeam(body, user);
  }

}
