import { Injectable } from '@nestjs/common';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { TeamRules } from 'src/entities/team-rules.entity';
import { CreateTeamDTO } from './models/create-team.dto';

@Injectable()
export class TeamService {
    public constructor(
        @InjectRepository(Team) private teamRepository: Repository<Team>,
        @InjectRepository(TeamRules) private teamRulesRepository: Repository<TeamRules>,
      ) { }


    public async createTeam(body: CreateTeamDTO, user: User): Promise<any> {
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
    return await this.teamRepository.save(newTeam);
    }

    public async leaveTeam(id: string, user: User): Promise<any> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        id: id,
      },
    });
    const members = team.users;
    function leaveTeam (members, user) {

      return members.filter(function(ele){
          return ele.id !== user.id;
      });
   }
   var res = leaveTeam (members, user);
   team.users = res;
   await this.teamRepository.save(team);
   return await res;

    }
    
}
