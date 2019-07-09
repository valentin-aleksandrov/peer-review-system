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

  @ManyToMany(type => User, user => user.host)
  @JoinTable()
  host: Promise<User>;

  @ManyToMany(type => User, user => user.invitee)
  @JoinTable()
  invitee: Promise<User>;
}