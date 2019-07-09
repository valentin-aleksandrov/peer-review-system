import { Injectable } from '@nestjs/common';
import { Team } from 'src/entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamInvitation } from 'src/entities/team-invitation.entity';
import { TeamInvitationStatus } from 'src/entities/team-invitation-status.entity';
import { stat } from 'fs';
import { User } from 'src/entities/user.entity';
import { AddTeamInvitationDTO } from './models/add-team-invitation.dto';

@Injectable()
export class TeamInvitationService {
    public constructor(
        @InjectRepository(Team) private teamRepository: Repository<Team>,
        @InjectRepository(TeamInvitationStatus) private teamInvitationStatusRepository: Repository<TeamInvitationStatus>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(TeamInvitation) private teamInvitationRepository: Repository<TeamInvitation>,
        
      ) { }

    
    public async createTeamInvitation(body: AddTeamInvitationDTO, user: User): Promise<any> {
        const newInvitation = new TeamInvitation();
        const status = await this.teamInvitationStatusRepository.findOne({
            where: {
              status: 'pending',
            },
          });
        newInvitation.status = Promise.resolve(status);
        newInvitation.host = user;
        const team = await this.teamRepository.findOne({
            where: {
              name: body.teamName,
            },
          });
          newInvitation.team = Promise.resolve(team);
        const invitee = await this.userRepository.findOne({
            where: {
              name: body.inviteeName,
            },
          });
        console.log(invitee);
        
       // this.teamInvitationRepository.save(newInvitation);
        newInvitation.invitee = Promise.resolve( await invitee);
        console.log(newInvitation.invitee);
        console.log(newInvitation.host);
        return await this.teamInvitationRepository.save(newInvitation);

    }
}

