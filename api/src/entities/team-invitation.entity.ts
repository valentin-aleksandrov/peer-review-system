import { OneToMany, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { TeamInvitationStatus } from "./team-invitation-status.entity";


@Entity('team_invitation')
export class TeamInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => TeamInvitationStatus, TeamInvitationStatus => TeamInvitationStatus.status)
  status: Promise<TeamInvitationStatus>;

  @ManyToOne(type => Team, team => team.TeamInvitation)
  team: Promise<Team>;

  @ManyToOne(type => User, user => user.host, {
    eager: true
})
  host: User;

  @ManyToOne(type => User, user => user.invitee)
  invitee: Promise<User>;
}