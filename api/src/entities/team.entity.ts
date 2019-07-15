import { User } from "./user.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { TeamInvitation } from "./team-invitation.entity";
import { TeamRules } from "./team-rules.entity";
import { WorkItem } from "./work-item.entity";

@Entity('team')
export class Team{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  teamName: string;

  @ManyToMany(type => User, user => user.teams,  {
    eager: true
})
  @JoinTable()
  users: User[];

  @OneToMany(type => TeamInvitation, TeamInvitation => TeamInvitation.team)
  TeamInvitation: Promise<TeamInvitation[]>;

  @ManyToOne(type => TeamRules, teamRules => teamRules.team)
  rules: Promise<TeamRules>;

  @OneToMany((type) => WorkItem, (workItem) => workItem.team)
  workItems: Promise<WorkItem[]>;
}