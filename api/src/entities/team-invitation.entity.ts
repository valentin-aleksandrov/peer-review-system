import { OneToMany, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { TeamInvitationStatus } from "./team-invitation-status.entity";


@Entity('team_invitation')
export class TeamInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => TeamInvitationStatus, TeamInvitationStatus => TeamInvitationStatus.status,{
    eager: true
})
  status: TeamInvitationStatus;

  @ManyToOne(type => Team, team => team.TeamInvitation, {
    eager: true
})
  team: Team;

  @ManyToOne(type => User, user => user.host, {
    eager: true
})
  host: User;

  @ManyToOne(type => User, user => user.invitee, {
    eager: true
})
  invitee: User;
}