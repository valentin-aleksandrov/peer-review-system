import { User } from "./user.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { TeamInvitation } from "./team-invitation.entity";
import { TeamRules } from "./team-rules.entity";

@Entity('team')
export class Team{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(type => User, user => user.teams,  {
    eager: true
})
  @JoinTable()
  users: User[];

  @OneToMany(type => TeamInvitation, TeamInvitation => TeamInvitation.team)
  TeamInvitation: Promise<TeamInvitation[]>;

  @ManyToOne(type => TeamRules, teamRules => teamRules.team)
  rules: Promise<TeamRules>;
 
}