import { Injectable } from '@nestjs/common';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { TeamRules } from 'src/entities/team-rules.entity';
import { CreateTeamDTO } from './models/create-team.dto';
import { ShowTeamDTO } from './models/show-team.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TeamService {
    public constructor(
        @InjectRepository(Team) private teamRepository: Repository<Team>,
        @InjectRepository(TeamRules) private teamRulesRepository: Repository<TeamRules>,
      ) { }


    public async createTeam(body: CreateTeamDTO, user: User): Promise<ShowTeamDTO> {
    const newTeam = new Team();
    newTeam.teamName = body.teamName;
    const newUser = user;
    newTeam.users = [newUser];
    const rules = await this.teamRulesRepository.findOne({
        where: {
          minPercentApprovalOfItem: 100,
        },
      });
    newTeam.rules = Promise.resolve(rules);
    const savedTeam = await this.teamRepository.save(newTeam);
    const TeamToShow = plainToClass(ShowTeamDTO, savedTeam, { excludeExtraneousValues: true });
    return TeamToShow;
    }

    public async leaveTeam(teamId: string, user: User): Promise<ShowTeamDTO> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });
    const members = team.users;
    const leave = (members, user) => {

      return members.filter((ele) => {
          return ele.id !== user.id;
      });
   };
   const result = leave (members, user);
   team.users = result;
   const updatedTeam: Team = await this.teamRepository.save(team);
   const updatedTeamToShow = plainToClass(ShowTeamDTO, updatedTeam, { excludeExtraneousValues: true });
   return await updatedTeamToShow;
  }
}
