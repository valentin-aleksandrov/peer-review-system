import { Injectable } from '@nestjs/common';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { TeamRules } from 'src/entities/team-rules.entity';
import { CreateTeamDTO } from './models/create-team.dto';
import { ShowTeamDTO } from './models/show-team.dto';
import { plainToClass } from 'class-transformer';
import { SimpleTeamInfoDTO } from './models/simple-team-info.dto';
import { ShowUserDTO } from 'src/users/models/show-user.dto';

@Injectable()
export class TeamService {
  public constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(TeamRules)
    private teamRulesRepository: Repository<TeamRules>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async createTeam(
    body: CreateTeamDTO,
    user: User,
  ): Promise<ShowTeamDTO> {
    console.log('test1');
    const newTeam = new Team();
    newTeam.teamName = body.teamName;
    console.log('test2');
    const newUser = user;
    newTeam.users = [newUser];
    console.log('test3');
    let rules;
    rules = await this.teamRulesRepository.findOne({
      where: {
        minPercentApprovalOfItem: body.rule.minPercentApprovalOfItem,
        minNumberOfReviewers: body.rule.minNumberOfReviewers,
      },
    });
    console.log('test4');
    if (!rules) {
      const newRules = new TeamRules();
      newRules.minNumberOfReviewers = body.rule.minNumberOfReviewers;
      newRules.minPercentApprovalOfItem = body.rule.minPercentApprovalOfItem;
      console.log('test4,5');
      console.log(newRules);
      console.log(newRules.id,' id');
      console.log(newRules.minNumberOfReviewers,' min rev');
      console.log(newRules.minPercentApprovalOfItem,'min percen');
      console.log(newRules.team,'team');
      
      
      
      
      
      const savedNewRules = await this.teamRulesRepository.save(newRules);
      console.log('test4,6');
      newTeam.rules = savedNewRules;
      console.log('test4,7');
    } else {
      newTeam.rules = rules;
    }
    console.log('test5');
    const savedTeam = await this.teamRepository.save(newTeam);
   
    console.log(savedTeam);
    
    
    const TeamToShow: ShowTeamDTO = plainToClass(ShowTeamDTO, savedTeam, {
      excludeExtraneousValues: true,
    });
    TeamToShow.rules = await savedTeam.rules;
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
      return members.filter(ele => {
        return ele.id !== user.id;
      });
    };
    const result = leave(members, user);
    team.users = result;
    const updatedTeam: Team = await this.teamRepository.save(team);
    const updatedTeamToShow = plainToClass(ShowTeamDTO, updatedTeam, {
      excludeExtraneousValues: true,
    });
    return await updatedTeamToShow;
  }

  public async getTeamMembers(teamId: string): Promise<ShowUserDTO[]> {
    const team: Team = await this.teamRepository.findOne({
      where: {
        id: teamId,
      },
    });
    const membersIds: string[] = await team.users.map((user)=>user.id);
    const members: User[] = [];
    
    for (const userId of membersIds) {
      const foundMember: User = await this.userRepository.findOne({where: {
        id: userId,
      }});  
      members.push(foundMember);
    }
    
    const membersToShow: ShowUserDTO[] = []; 
    for (const elem of members) {
    // const member: ShowUserDTO = plainToClass(ShowUserDTO, elem, {
    // excludeExtraneousValues: true,
    // });
      const member: ShowUserDTO = await this.convertToShowUserDTO(elem);
      membersToShow.push(member);
    }
    return await membersToShow;
}
  public async getUserTeams(userId: string): Promise<SimpleTeamInfoDTO[]> {
    const foundUser: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const teams: Team[] = await foundUser.teams;
    // console.log('foundUser', foundUser);
    // console.log('foundTeams', teams);

    const foundTeams: SimpleTeamInfoDTO[] = [];
    for (const currentTeam of teams) {
      const members: ShowUserDTO[] = await this.getTeamMembers(currentTeam.id);
      const simpleInfo: SimpleTeamInfoDTO = {
        id: currentTeam.id,
        teamName: currentTeam.teamName,
        members: members.map((user) => user.username),
      };
      foundTeams.push(simpleInfo);
      
    }
    return await foundTeams;
  }
  private async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {
    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: (await user.role).name,
      avatarURL: user.avatarURL,
    };
    return convertedUser;
  }
}
