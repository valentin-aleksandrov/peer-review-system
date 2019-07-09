
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinTable, 
  ManyToOne
} from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';
import { TeamInvitation } from './team-invitation.entity';
import { Activity } from './activity.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  username: string;

  @Column('nvarchar', {unique: true})
  email: string;

  @Column('nvarchar')
  password: string;

  @Column('nvarchar')
  firstName: string;

  @Column('nvarchar')
  lastName: string;

  @Column({default: false})
  isDeleted: boolean;

  @ManyToOne(type => Role, role => role.name)
  role: Role;

  @ManyToMany(type => Team, team => team.users)
  @JoinTable()
  teams: Promise<Team[]>;

  @ManyToMany(type => TeamInvitation, TeamInvitation => TeamInvitation.host)
  host: Promise <TeamInvitation>;

  @ManyToMany(type => TeamInvitation, TeamInvitation => TeamInvitation.invitee)
  invitee: Promise<TeamInvitation>;

  @OneToMany(type => Activity, activity => activity.user)
  activity: Promise<Activity[]>;

}

